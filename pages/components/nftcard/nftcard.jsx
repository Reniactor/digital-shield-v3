import {
  useContract,
  useContractWrite,
  useContractEvents,
  useAddress,
} from "@thirdweb-dev/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";

const Nftcard = ({
  imageURL,
  param1,
  param2,
  param3,
  cryptoAmount,
  claimable,
  claimed,
  id,
  show,
}) => {
  // Get the contract address
  const { contract } = useContract(
    `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`
  );
  // Get the contract to release cryptos (only in sent page)
  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "release"
  );
  // Get current state of claimed
  const [isClaimed, setIsClaimed] = useState(claimed);
  // Unix timestamp for each of the cards
  const [epochTime, setEpochTime] = useState(NaN);
  // Hours for the countdown within the component
  const [hours, setHours] = useState("");
  // Minutes for the countdown within the component
  const [minutes, setMinutes] = useState("");
  // Seconds for the countdown within the component
  const [seconds, setSeconds] = useState("");
  // Releasable or not depending on the component countdown
  const [releasable, setReleasable] = useState(false);

  // User address
  const address = useAddress();

  //Function to process each card hours, minutes and seconds left
  function getTimeUntil(timestamp) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = timestamp - currentTimestamp;
    if (timeDifference <= 0) {
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      setReleasable(true);
      return;
    }

    const hoursToCalc = Math.floor(timeDifference / (60 * 60));
    const minutesToCalc = Math.floor((timeDifference % (60 * 60)) / 60);
    const secondsToCalc = Math.floor(timeDifference % 60);

    const hoursString =
      hoursToCalc < 10 ? "0" + hoursToCalc : hoursToCalc.toString();
    const minutesString =
      minutesToCalc < 10 ? "0" + minutesToCalc : minutesToCalc.toString();
    const secondsString =
      secondsToCalc < 10 ? "0" + secondsToCalc : secondsToCalc.toString();

    setHours(hoursString);
    setMinutes(minutesString);
    setSeconds(secondsString);
  }
  // Getting the contract data to use in the card
  const {
    data: contractData,
    isLoading: contractDataIsLoading,
    error: contractDataError,
  } = useContractEvents(contract, "LockCreated", {
    queryFilter: {
      subscribe: true,
    },
  });
  // UseEffect to process the contract data, setting the block.timestamp to the EpochTime
  useEffect(() => {
    const getContractData = async () => {
      // If contract data isn't loading, execute code
      if (contractDataIsLoading === false) {
        try {
          // Getting the raw data first
          const rawData = await contractData;
          // Using an array to store the data retrieved
          const dataToProcess = [];
          // Using a map to iterate through the array as that's what i thought of at the moment honestly
          rawData.map((element) =>
            // element ID comes as a hex, so it gets parsed to decimal to compare it against the ID
            parseInt(element.data.lockId._hex, 16) === id
              ? // It would then get pushed to the previous array
                dataToProcess.push(element.data)
              : null
          );
          // EpochTime gets set to the releaseTime found within the element that's in the dataToProcess array
          setEpochTime(parseInt(dataToProcess[0].releaseTime._hex, 16));
        } catch (error) {
          // Error handling
          console.log(error);
        }
      }
    };

    getContractData();
  }, [contractDataIsLoading]);

  // An useEffect to make sure the countdown gets updated every second
  useEffect(() => {
    const interval = setInterval(() => {
      const unixTime = epochTime;
      getTimeUntil(unixTime);
    }, 1000);

    // Clearing the interval by the end of it
    return () => {
      clearInterval(interval);
    };
  }, [epochTime]);

  // Release click button handler
  const handleReleaseClick = async () => {
    try {
      await mutateAsync({
        args: [id],
      });
      const usersCollectionRef = collection(db, "users");
      const userQuerySnapshot = await getDocs(usersCollectionRef);

      userQuerySnapshot.forEach(async (userDoc) => {
        const userId = userDoc.id;
        const sentFormDataCollectionRef = collection(
          usersCollectionRef,
          userId,
          "sentFormData"
        );
        const sentFormDataQuerySnapshot = await getDocs(
          sentFormDataCollectionRef
        );

        sentFormDataQuerySnapshot.forEach(async (sentFormDataDoc) => {
          const sentFormDataId = sentFormDataDoc.id;
          const sentFormDataData = sentFormDataDoc.data();

          const lockId = sentFormDataData.lockId;

          if (lockId === id) {
            const sentFormDataDocRef = doc(
              db,
              "users",
              userId,
              "sentFormData",
              sentFormDataId
            );

            await updateDoc(sentFormDataDocRef, { claimed: true });
            // Perform any additional actions or state updates after the updateDoc call
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsClaimed(claimed);
  }, [claimed]);

  return (
    <div
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundRepeat: "no-repeat",
      }}
      className={`
      font-trispace 
      flex 
      flex-col 
      w-[300px] 
      h-[450px] 
      rounded-md 
      items-center 
      justify-between
      py-10
      text-titleWhite
      `}
    >
      <Image
        src={`${imageURL}`}
        height={200}
        width={200}
        className="max-w-[110px] max-h-[110px] overflow-hidden w-auto"
      />
      <div className="w-4/5 flex flex-col items-center">
        <h1>To dos:</h1>
        <h2 className="text-center text-sm font-medium">{param1}</h2>
        <h2 className="text-center text-sm font-medium">{param2}</h2>
        <h2 className="text-center text-sm font-medium">{param3}</h2>
      </div>
      <div className="w-4/5 flex flex-col items-center">
        {hours && minutes && seconds ? (
          <>
            <h1>Time left:</h1>
            <h2>
              {hours}:{minutes}:{seconds}
            </h2>
          </>
        ) : (
          ""
        )}
        <h1>Crypto amount:</h1>
        <h2>{cryptoAmount}</h2>
      </div>
      {show ? (
        isLoading ? (
          <button
            type="button"
            className="rounded-md w-24 h-12 bg-header-background-color text-titleWhite hover:bg-titleWhite hover:text-header-background-color duration-500"
            disabled
          >
            Loading...
          </button>
        ) : isClaimed ? (
          <button
            type="button"
            className="rounded-md w-24 h-12 bg-gray-400 text-titleWhite cursor-not-allowed"
            disabled
          >
            Already Released
          </button>
        ) : releasable ? (
          <button
            type="button"
            className="rounded-md w-24 h-12 bg-header-background-color text-titleWhite hover:bg-titleWhite hover:text-header-background-color duration-500"
            onClick={handleReleaseClick}
          >
            Release!
          </button>
        ) : releasable == false ? (
          <button
            type="button"
            className="rounded-md w-24 h-12 bg-red-900 text-titleWhite hover:bg-titleWhite hover:text-red-900  duration-500"
            disabled
          >
            Not yet!
          </button>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </div>
  );
};
export default Nftcard;
