import { useEffect, useState } from "react";
import NavBar from "./components/header";
import {
  useAddress,
  useContract,
  useContractEvents,
  useContractWrite,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ethers } from "ethers";
import Custom404 from "./404";

const Admin = () => {
  const [amountToBeWithdrawn, setAmountToBeWithdrawn] = useState(0);
  const [numberForDatabase, setNumberForDatabase] = useState(0);
  const [currentIterationFromDB, setCurrentIterationFromDB] = useState(NaN);
  const [cryptoAmountToAdd, setCryptoAmountToAdd] = useState(NaN);
  //Get the contract address
  const adminAddress = process.env.NEXT_PUBLIC_ADMINWALLET;
  const { contract } = useContract(
    `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`
  );

  const fetchDataFromDatabase = async () => {
    const usersCollectionRef = collection(db, "users");
    const userQuery = query(
      usersCollectionRef,
      where("wallet", "==", adminAddress)
    );

    try {
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        // Get the first user document
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();

        // Access the desired data from userData
        const currentValue = userData.currentIteration;
        console.log("Current Value:", currentValue);
        setCurrentIterationFromDB(currentValue);
      } else {
        console.log("User not found for the given wallet address.");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const walletAddress = useAddress();
  const weiAmount = 1000000000000000000;
  200000000000000;
  const formulaToRemove5Percent = (value) => {
    return Number((value * 0.05).toFixed(2));
  };

  //Get contract data, loading state and errors
  const {
    data: contractData,
    isLoading: contractDataIsLoading,
    error: contractDataError,
  } = useContractEvents(contract, "LockCreated", {
    queryFilter: {
      subscribe: true,
    },
  });

  const {
    data: fundsWithdrawnContractData,
    isLoading: fundsWithdrawnContractDataIsLoading,
    error: fundsWithdrawnContractDataError,
  } = useContractEvents(contract, "FundsWithdrawn", {
    queryFilter: {
      subscribe: true,
    },
  });

  const {
    mutateAsync: mutateAsyncWithdrawFunds,
    isLoading: withdrawFundsIsLoading,
    error: withdrawFundsError,
  } = useContractWrite(contract, "withdrawFunds");

  const {
    mutateAsync: mutateAsyncAddFunds,
    isLoading: AddFundsIsLoading,
    error: addFundsError,
  } = useContractWrite(contract, "addFunds");

  useEffect(() => {
    const getCreatedLocks = async () => {
      fetchDataFromDatabase();
      const data = await contractData;
      console.log(data);
      const numberToUseToSlice = currentIterationFromDB || 0;
      let amount = [];
      if (data && data.length > 0) {
        data.slice(numberToUseToSlice).map((arrayItem) => {
          amount.push(parseInt(arrayItem.data.amount._hex, 16));
        });
        console.log(amount.length);
        setNumberForDatabase(amount.length);
        amount = amount.reduce(
          (previousValue, currentValue) =>
            previousValue + formulaToRemove5Percent(currentValue),
          0
        );
        amount = amount / weiAmount;
        setAmountToBeWithdrawn(amount);
      }
    };

    getCreatedLocks();
  }, [contractDataIsLoading]);

  const addValueToDatabase = async (walletAddress, value) => {
    const usersCollectionRef = collection(db, "users");
    const userQuery = query(
      usersCollectionRef,
      where("wallet", "==", walletAddress)
    );
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      userQuerySnapshot.forEach((userDoc) => {
        const userId = userDoc.id;
        const userRef = doc(db, "users", userId);

        // Check if the wallet exists for the user
        const userData = userDoc.data();
        const wallet = userData.wallet;

        if (wallet === walletAddress) {
          const currentValue = userData.currentIteration || 0;
          const updatedValue = currentValue + value;

          // Update the value in the database
          updateDoc(userRef, { currentIteration: updatedValue })
            .then(() => {
              console.log("Value updated successfully!");
            })
            .catch((error) => {
              console.log("Error updating value:", error);
            });
        } else {
          console.log("Wallet not found for the given address.");
        }
      });
    } else {
      console.log("User not found for the given wallet address.");
    }
  };

  // Usage in the handleWithdrawFundsButtonClick function
  const handleWithdrawFundsButtonClick = async () => {
    // Call the addValueToDatabase function with the desired value
    const valueToAdd = numberForDatabase; // Replace with the value you want to add
    try {
      await mutateAsyncWithdrawFunds({
        args: [ethers.utils.parseEther(`${amountToBeWithdrawn}`)],
      });
      addValueToDatabase(adminAddress, valueToAdd);
    } catch (error) {
      console.log(error);
      return;
    }
    // Perform the withdraw funds logic here
  };
  const handleAddFundsButtonClick = async () => {
    try {
      await mutateAsyncAddFunds({
        args: [],
        overrides: { value: ethers.utils.parseEther(`${cryptoAmountToAdd}`) },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {!walletAddress ? (
        <div className="min-h-screen min-w-full flex flex-col justify-center items-center gap-8 bg-background-color-website text-titleWhite font-medium text-2xl">
          To see this page you must first login
          <ConnectWallet
            theme="dark"
            className="!bg-header-background-color !border-none !h-14 !w-40 !text-blue-accent hover:!text-base-text-color !transition-transform !duration-700"
          />
        </div>
      ) : walletAddress == adminAddress ? (
        <main className="bg-background-color-website min-h-screen h-screen min-w-screen flex items-center">
          <NavBar />
          <div className="w-full h-3/5 flex flex-col items-center justify-around">
            {contractDataIsLoading ? (
              <h1 className="text-center text-titleWhite text-2xl font-medium font-trispace">
                Loading...
              </h1>
            ) : (
              <h1 className="text-center text-titleWhite text-2xl font-medium font-trispace">
                Available amount: ${amountToBeWithdrawn || 0}
              </h1>
            )}
            <form className="w-3/5 flex items-center justify-around max-[1000px]:flex-col max-[1000px]:justify-around max-[1000px]:items-center max-[1000px]:gap-20">
              <div className="h-12 flex justify-center items-center">
                <button
                  type="button"
                  onClick={handleWithdrawFundsButtonClick}
                  className="font-medium h-full min-w-[8rem] rounded-md bg-header-background-color text-blue-accent hover:bg-white hover:text-header-background-color duration-500"
                >
                  Withdraw Funds
                </button>
              </div>
              <div className="h-12 flex justify-center items-center">
                <input
                  id="addFunds"
                  type="number"
                  className="h-full rounded-tl-md rounded-bl-md text-center focus:outline-none"
                  placeholder="Add Funds"
                  onChange={(e) => {
                    e.preventDefault();
                    const value = e.target.value;
                    setCryptoAmountToAdd(value);
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFundsButtonClick}
                  className="font-medium h-full min-w-[8rem] rounded-tr-md rounded-br-md bg-header-background-color text-blue-accent hover:bg-white hover:text-header-background-color duration-500"
                >
                  Add Funds
                </button>
              </div>
            </form>
          </div>
        </main>
      ) : (
        <Custom404 />
      )}
    </>
  );
};
export default Admin;
