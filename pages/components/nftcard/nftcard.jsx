import {
  useContract,
  useContractWrite,
  useContractEvents,
  useAddress,
} from "@thirdweb-dev/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Nftcard = ({
  imageURL,
  param1,
  param2,
  param3,
  cryptoAmount,
  claimable,
  claimed,
  id,
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

  const [epochTime, setEpochTime] = useState(NaN);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [releasable, setReleasable] = useState(false);
  const address = useAddress();

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

  const {
    data: contractData,
    isLoading: contractDataIsLoading,
    error: contractDataError,
  } = useContractEvents(contract, "LockCreated", {
    queryFilter: {
      subscribe: true,
    },
  });

  useEffect(() => {
    const getContractData = async () => {
      if (contractDataIsLoading === false) {
        try {
          const rawData = await contractData;
          const dataToProcess = [];
          rawData.map((element) =>
            parseInt(element.data.lockId._hex, 16) === id
              ? dataToProcess.push(element.data)
              : null
          );
          setEpochTime(parseInt(dataToProcess[0].releaseTime._hex, 16));
        } catch (error) {
          console.log(error);
        }
      }
    };
    getContractData();
  }, [contractDataIsLoading]);

  useEffect(() => {
    console.log(epochTime);
    if (epochTime > 0) {
      getTimeUntil(epochTime);
    }
  }, [epochTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const unixTime = epochTime;
      getTimeUntil(unixTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [epochTime]);

  const handleReleaseClick = async () => {
    try {
      await mutateAsync({
        args: [id],
      });
    } catch (error) {
      console.log(error);
    }
  };

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
        <h2>{param1}</h2>
        <h2>{param2}</h2>
        <h2>{param3}</h2>
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
      {isLoading ? (
        <button
          type="button"
          className="rounded-md w-24 h-12 bg-header-background-color text-titleWhite hover:bg-titleWhite hover:text-header-background-color duration-500"
          disabled
        >
          Loading...
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
      )}
    </div>
  );
};
export default Nftcard;
