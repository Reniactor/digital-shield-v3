import { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useAddress } from "@thirdweb-dev/react";
import NavBar from "./components/header";
import Nftcard from "./components/nftcard/nftcard";

const Received = () => {
  const address = useAddress();
  const [receivedFormData, setReceivedFormData] = useState([]);

  useEffect(() => {
    const fetchReceivedFormData = async () => {
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
            const receivedFormDataCollectionRef = collection(
              userDocRef,
              "receivedFormData"
            );

            const unsubscribe = onSnapshot(
              receivedFormDataCollectionRef,
              (querySnapshot) => {
                const receivedData = [];
                querySnapshot.forEach((doc) => {
                  const formData = doc.data();
                  receivedData.push(formData);
                });

                setReceivedFormData(receivedData);
              }
            );

            // Unsubscribe from the snapshot listener when component unmounts or address changes
            return () => unsubscribe();
          }
        }
      } catch (error) {
        console.error("Error fetching received form data:", error);
      }
    };

    fetchReceivedFormData();
  }, [address]);

  // Render the received form data
  return (
    <div className="min-h-screen min-w-screen bg-background-color-website">
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-9 pt-16 w-full">
        {receivedFormData.map((data) => (
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
            hours={data.hours}
            minutes={data.minutes}
            seconds={data.seconds}
            cryptoAmount={data.cryptoAmount}
            claimed={data.claimed}
            id={data.lockId}
            show={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Received;
