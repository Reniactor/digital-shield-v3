import { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import {
  useAddress,
  useContractEvents,
  useContract,
} from "@thirdweb-dev/react";
import NavBar from "./components/header";
import Nftcard from "./components/nftcard/nftcard";

const Sent = () => {
  const address = useAddress();
  const [sentFormData, setSentFormData] = useState([]);

  useEffect(() => {
    const fetchSentFormData = async () => {
      try {
        if (address) {
          const usersCollectionRef = collection(db, "users");
          const userQuery = query(
            usersCollectionRef,
            where("wallet", "==", address)
          );
          const userQuerySnapshot = await getDocs(userQuery);

          if (!userQuerySnapshot.empty) {
            const userDocRef = doc(db, "users", userQuerySnapshot.docs[0].id);
            const sentFormDataCollectionRef = collection(
              userDocRef,
              "sentFormData"
            );
            const sentFormDataQuerySnapshot = await getDocs(
              sentFormDataCollectionRef
            );

            const sentData = [];
            sentFormDataQuerySnapshot.forEach((doc) => {
              const formData = doc.data();
              sentData.push(formData);
            });

            setSentFormData(sentData);
          }
        }
      } catch (error) {
        console.error("Error fetching sent form data:", error);
      }
    };

    fetchSentFormData();
  }, [address]);

  // Render the sent form data
  return (
    <div className="min-h-screen min-w-screen bg-background-color-website">
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-9 pt-16 w-full">
        {sentFormData.map((data) => (
          <Nftcard
            key={data.lockId}
            imageURL={data.imageURL}
            param1={
              data.firstParameter == "No selection" ? "" : data.firstParameter
            }
            param2={
              data.secondParameter == "No selection" ? "" : data.secondParameter
            }
            param3={
              data.thirdParameter == "No selection" ? "" : data.thirdParameter
            }
            cryptoAmount={data.cryptoAmount}
            claimable={data.claimable}
            claimed={data.claimed}
            id={data.lockId}
            show={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Sent;
