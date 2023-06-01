import { useEffect, useState } from "react";
import NavBar from "./components/header";
import {
  useAddress,
  useContract,
  useContractEvents,
  useContractWrite,
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
  //Get the contract address
  const { contract } = useContract(
    `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`
  );
  const adminAddress = process.env.ADMINWALLET;
  const walletAddress = useAddress();
  const weiAmount = 1000000000000000000;
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
      subscribe: false,
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
      const data = await contractData;
      const numberToUseToSlice = numberForDatabase || 0;
      let amount = [];
      if (data && data.length > 0) {
        data.slice(numberToUseToSlice).map((arrayItem) => {
          amount.push(parseInt(arrayItem.data.amount._hex, 16));
        });
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
    // Get the wallet address

    // Call the addValueToDatabase function with the desired value
    const valueToAdd = numberForDatabase; // Replace with the value you want to add
    try {
      await mutateAsyncWithdrawFunds({
        args: [ethers.utils.parseEther(`${amountToBeWithdrawn}`)],
      });
    } catch (error) {
      console.log(error);
      return;
    }
    addValueToDatabase(adminAddress, valueToAdd);
    // Perform the withdraw funds logic here
  };
  const handleAddFundsButtonClick = async () => {};
  return (
    <>
      {walletAddress != adminAddress ? (
        <Custom404 />
      ) : (
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
            <form className="w-3/5 flex items-center justify-around">
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
                />
                <button
                  onClick={handleAddFundsButtonClick}
                  className="font-medium h-full min-w-[8rem] rounded-tr-md rounded-br-md bg-header-background-color text-blue-accent hover:bg-white hover:text-header-background-color duration-500"
                >
                  Add Funds
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
};
export default Admin;
