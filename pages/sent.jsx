import { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { useAddress } from "@thirdweb-dev/react";
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
      <div className="flex justify-around items-center pt-16">
        {sentFormData.map((data) => (
          <Nftcard
            key={data.lockId}
            imageURL={data.imageURL}
            param1={data.firstParameter}
            param2={data.secondParameter}
            param3={data.thirdParameter}
            hours={data.hours}
            minutes={data.minutes}
            seconds={data.seconds}
            cryptoAmount={data.cryptoAmount}
            claimable={data.claimable}
            claimed={data.claimed}
            id={data.lockId}
          />
        ))}
      </div>
    </div>
  );
};

export default Sent;
