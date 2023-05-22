import Image from "next/image";
import Aero_03 from "next/font/local";
import { Trispace } from "next/font/google";
import upload from "/public/alt upload image.png";
import cryptoUpArrow from "/public/crypto value up arrow.png";
import cryptoDownArrow from "/public/crypto value down arrow.png";
import { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { isValidAddress } from "ethereumjs-util";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../config/firebaseConfig";
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

const titleWhite = "#c6c4c8";

const trispace = Trispace({ src: "next/font/google", subsets: ["latin"] });

const aero = Aero_03({
  src: "../../../public/AERO_03.ttf",
  subsets: "latin",
});

function SubmitNFT() {
  const [selectedImage, setSelectedImage] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const address = useAddress() || null;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(usersCollectionRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    const createUserOnce = async () => {
      if (address && address !== undefined) {
        try {
          // Check if the user already exists
          const userQuery = query(
            usersCollectionRef,
            where("wallet", "==", address)
          );
          const userQuerySnapshot = await getDocs(userQuery);

          if (userQuerySnapshot.empty) {
            // User doesn't exist, create a new one
            await addDoc(usersCollectionRef, { wallet: address });
          } else {
            // User already exists
            console.log(address);
            console.log("User already exists!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    createUserOnce();
  }, [address]);

  const handleCryptoAmountChange = (event) => {
    const value = event.target.value;

    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Set the modified value back into the state
    setCryptoAmount(numericValue);
  };

  const handleIncrement = () => {
    // Increment the crypto amount
    const incrementedAmount = parseFloat(cryptoAmount) + 1;

    // Set the incremented value back into the state
    setCryptoAmount(incrementedAmount.toString());
  };

  const handleDecrement = () => {
    // Decrement the crypto amount
    const decrementedAmount = parseFloat(cryptoAmount) - 1;

    // Ensure the amount doesn't go below 0
    const clampedAmount = Math.max(0, decrementedAmount);

    // Set the clamped value back into the state
    setCryptoAmount(clampedAmount.toString());
  };

  const handleCancel = () => {
    document.getElementById("uploadForm").reset();
    setSelectedImage(null);
    setCryptoAmount(0);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Function to handle form submission

  const handleSubmit = async (event, walletAddress) => {
    event.preventDefault();

    const form = document.getElementById("uploadForm");
    const formData = new FormData(form);

    const recipientAddress = formData.get("recipientAddress");

    // Validate recipient address as a wallet address
    if (!recipientAddress || !isValidAddress(recipientAddress)) {
      // Invalid recipient address
      alert("Invalid recipient address.");
      return;
    }

    try {
      // Upload the image file
      const imageFile = formData.get("imagefile");
      const storage = getStorage();
      const originalFileName = imageFile.name;
      const imageStorageRef = ref(storage, `images/${originalFileName}`); // Store the image with the original file name
      const imageSnapshot = await uploadBytes(imageStorageRef, imageFile);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(imageSnapshot.ref);

      // Find the user by wallet address for receivedFormData
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(
        usersCollectionRef,
        where("wallet", "==", recipientAddress)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        // User found, assign the receivedFormData document
        const userDataRef = doc(db, "users", userQuerySnapshot.docs[0].id);
        const receivedFormDataCollectionRef = collection(
          userDataRef,
          "receivedFormData"
        );
        const newReceivedFormDataRef = doc(receivedFormDataCollectionRef);

        // Update data with image URL and save the receivedFormData
        const data = {
          senderAddress: walletAddress,
          firstParameter: formData.get("firstParameter"),
          secondParameter: formData.get("secondParameter"),
          thirdParameter: formData.get("thirdParameter"),
          hours: formData.get("hours"),
          minutes: formData.get("minutes"),
          seconds: formData.get("seconds"),
          cryptoAmount: formData.get("cryptoAmount"),
          imageURL: downloadURL,
          claimed: false,
          claimable: false,
        };

        await setDoc(newReceivedFormDataRef, data);
      } else {
        // User not found, create a new user with receivedFormData
        const newUserRef = await addDoc(usersCollectionRef, {
          wallet: recipientAddress,
        });
        const receivedFormDataCollectionRef = collection(
          newUserRef,
          "receivedFormData"
        );
        const newReceivedFormDataRef = doc(receivedFormDataCollectionRef);

        // Update data with image URL and save the receivedFormData
        const data = {
          senderAddress: walletAddress,
          firstParameter: formData.get("firstParameter"),
          secondParameter: formData.get("secondParameter"),
          thirdParameter: formData.get("thirdParameter"),
          hours: formData.get("hours"),
          minutes: formData.get("minutes"),
          seconds: formData.get("seconds"),
          cryptoAmount: formData.get("cryptoAmount"),
          imageURL: downloadURL,
          claimed: false,
          claimable: false,
        };

        await setDoc(newReceivedFormDataRef, data);
      }

      const senderUsersCollectionRef = collection(db, "users");
      const senderUserQuery = query(
        senderUsersCollectionRef,
        where("wallet", "==", walletAddress)
      );
      const senderUserQuerySnapshot = await getDocs(senderUserQuery);

      // Create and assign the sentFormData document
      const senderUserDataRef = doc(
        db,
        "users",
        senderUserQuerySnapshot.docs[0].id
      );
      const sentFormDataCollectionRef = collection(
        senderUserDataRef,
        "sentFormData"
      );
      const newSentFormDataRef = doc(sentFormDataCollectionRef);

      // Update data with image URL and save the sentFormData
      const data = {
        recipientAddress: recipientAddress,
        firstParameter: formData.get("firstParameter"),
        secondParameter: formData.get("secondParameter"),
        thirdParameter: formData.get("thirdParameter"),
        hours: formData.get("hours"),
        minutes: formData.get("minutes"),
        seconds: formData.get("seconds"),
        cryptoAmount: formData.get("cryptoAmount"),
        imageURL: downloadURL,
        claimed: false,
        claimable: false,
      };

      await setDoc(newSentFormDataRef, data);

      form.reset();
    } catch (error) {
      console.error("Error storing form data: ", error);
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
      w-full 
      h-[900px] 
      rounded-md 
      items-center 
      justify-center
      py-10
      `}
    >
      {!address ? (
        <div className="text-2xl font-bold text-center">
          Please Connect Your Wallet
        </div>
      ) : (
        <form
          id="uploadForm"
          className="h-full w-4/5 text-[rgba(255,255,255,0.7)]"
          onSubmit={(event) => handleSubmit(event, address)}
          noValidate
        >
          <div className="h-full w-full bg-[rgba(255,255,255,0.25)] rounded-xl flex flex-col justify-between">
            <div className="flex flex-col w-full items-center gap-6 my-6 relative">
              <h1 className=" text-xl">Upload Image</h1>
              <div className="relative flex w-4/5 h-auto max-w-[260px] hover:cursor-pointer justify-center items-center">
                <Image
                  src={selectedImage || upload}
                  height={1000}
                  width={1000}
                  alt="Uploaded Image"
                  className="max-h-[182px] max-w-[182px] overflow-y-hidden w-auto text-center"
                />
                <input
                  id="imagefile"
                  type="file"
                  name="imagefile"
                  accept="image/*"
                  className="absolute inset-0 w-4/5 h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  required
                />
              </div>
            </div>
            <div className="w-full flex-col gap-12">
              <h1 className="text-center text-xl mb-2 rounded-sm h-[2rem]">
                Achievements
              </h1>
              <div className="flex justify-around">
                <div className="flex w-[30%] flex-col">
                  <h1 className="text-center text-blue-accent max-h-[38.38px]">
                    1st parameter
                  </h1>
                  <select
                    name="firstParameter"
                    id="firstParameter"
                    className="bg-[rgba(255,255,255,0.25)] min-h-[66%] text-[rgba(255,255,255,0.9)] text-sm rounded-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-[rgba(255,255,255,0.9)] focus:outline-none hover:outline-none focus:ring-0 hover:ring-0"
                  >
                    <option value="No selection" className="">
                      No selection
                    </option>
                    <option
                      value="GPA: Achieve a minimum GPA of 3.5"
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      GPA: Achieve a minimum GPA of 3.5
                    </option>
                    <option
                      value="Skill Acquisition: Learn a new language or instrument."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Skill Acquisition: Learn a new language or instrument.
                    </option>
                    <option
                      value="Distance/Time: Run a marathon within 4 hours."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Distance/Time: Run a marathon within 4 hours.
                    </option>
                    <option
                      value="Certification: Obtain a project management certification."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Certification: Obtain a project management certification.
                    </option>
                    <option
                      value="Idea Implementation: Implement a new process or product."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Idea Implementation: Implement a new process or product.
                    </option>
                    <option
                      value="Volunteer Hours: Contribute 50 hours of community service."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Volunteer Hours: Contribute 50 hours of community service.
                    </option>
                    <option
                      value="Savings Goal: Save $10,000 within the contract period."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Savings Goal: Save $10,000 within the contract period.
                    </option>
                    <option
                      value="Weight Management: Achieve and maintain a healthy BMI."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Weight Management: Achieve and maintain a healthy BMI.
                    </option>
                    <option
                      value="Team Project Success: Successfully complete a team project on time and within budget."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Team Project Success: Successfully complete a team project
                      on time and within budget.
                    </option>
                    <option
                      value="Carbon Footprint Reduction: Decrease personal carbon emissions by 20%."
                      className="!bg-[rgba(255,255,255,0.25)] !text-[rgba(255,255,255,0.7)]"
                    >
                      Carbon Footprint Reduction: Decrease personal carbon
                      emissions by 20%.
                    </option>
                  </select>
                </div>
                <div className="flex w-[30%] flex-col">
                  <h1 className="text-center  text-blue-accent">
                    2nd parameter
                  </h1>
                  <select
                    name="secondParameter"
                    id="secondParameter"
                    className="bg-[rgba(255,255,255,0.25)] min-h-[66%] text-[rgba(255,255,255,0.9)] text-sm rounded-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-[rgba(255,255,255,0.9)] focus:outline-none hover:outline-none focus:ring-0 hover:ring-0"
                  >
                    <option value="No selection" className="">
                      No selection
                    </option>
                    <option
                      value="Course Completion: Successfully complete 12 courses."
                      className=""
                    >
                      Course Completion: Successfully complete 12 courses.
                    </option>
                    <option
                      value="Personal Growth: Attend personal development workshops."
                      className=""
                    >
                      Personal Growth: Attend personal development workshops.
                    </option>
                    <option
                      value="Strength/Weightlifting: Bench press 200 pounds."
                      className=""
                    >
                      Strength/Weightlifting: Bench press 200 pounds.
                    </option>
                    <option
                      value="Promotion: Achieve a higher job title or position."
                      className=""
                    >
                      Promotion: Achieve a higher job title or position.
                    </option>
                    <option
                      value="Creative Output: Publish a book or release an original artwork."
                      className=""
                    >
                      Creative Output: Publish a book or release an original
                      artwork.
                    </option>
                    <option
                      value="Leadership Role: Lead a community project or initiative."
                      className=""
                    >
                      Leadership Role: Lead a community project or initiative.
                    </option>
                    <option
                      value="Debt Reduction: Pay off $5,000 of personal debt."
                      className=""
                    >
                      Debt Reduction: Pay off $5,000 of personal debt.
                    </option>
                    <option
                      value="Wellness Activities: Complete 100 hours of yoga or meditation."
                      className=""
                    >
                      Wellness Activities: Complete 100 hours of yoga or
                      meditation.
                    </option>
                    <option
                      value="Leadership Development: Attend leadership training programs."
                      className=""
                    >
                      Leadership Development: Attend leadership training
                      programs.
                    </option>
                    <option
                      value="Recycling and Waste Reduction: Implement a recycling program and reduce waste by 50%."
                      className=""
                    >
                      Recycling and Waste Reduction: Implement a recycling
                      program and reduce waste by 50%.
                    </option>
                  </select>
                </div>
                <div className="flex w-[30%] flex-col">
                  <h1 className="text-center  text-blue-accent">
                    3rd parameter
                  </h1>
                  <select
                    name="thirdParameter"
                    id="thirdParameter"
                    className="bg-[rgba(255,255,255,0.25)] min-h-[66%] text-[rgba(255,255,255,0.9)] text-sm rounded-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-[rgba(255,255,255,0.9)] focus:outline-none hover:outline-none focus:ring-0 hover:ring-0"
                  >
                    <option value="No selection" className="">
                      No selection
                    </option>
                    <option
                      value="Research Project: Conduct an original research project and present findings."
                      className=""
                    >
                      Research Project: Conduct an original research project and
                      present findings.
                    </option>
                    <option
                      value="Mentorship: Receive mentoring from an industry expert for skill development."
                      className=""
                    >
                      Mentorship: Receive mentoring from an industry expert for
                      skill development.
                    </option>
                    <option
                      value="Endurance Challenge: Complete a triathlon or endurance race."
                      className=""
                    >
                      Endurance Challenge: Complete a triathlon or endurance
                      race.
                    </option>
                    <option
                      value="Industry Conference: Attend a major industry conference and present a paper."
                      className=""
                    >
                      Industry Conference: Attend a major industry conference
                      and present a paper.
                    </option>
                    <option
                      value="Patent Application: Submit a patent application for a unique invention."
                      className=""
                    >
                      Patent Application: Submit a patent application for a
                      unique invention.
                    </option>
                    <option
                      value="Fundraising Campaign: Successfully organize and execute a fundraising campaign for a charitable cause."
                      className=""
                    >
                      Fundraising Campaign: Successfully organize and execute a
                      fundraising campaign for a charitable cause.
                    </option>
                    <option
                      value="Investment Portfolio: Achieve a specified return on investment in a designated time frame."
                      className=""
                    >
                      Investment Portfolio: Achieve a specified return on
                      investment in a designated time frame.
                    </option>
                    <option
                      value="Wellness Challenge: Participate in and complete a fitness or wellness challenge."
                      className=""
                    >
                      Wellness Challenge: Participate in and complete a fitness
                      or wellness challenge.
                    </option>
                    <option
                      value="Team Building Event: Organize and facilitate a team-building event or workshop."
                      className=""
                    >
                      Team Building Event: Organize and facilitate a
                      team-building event or workshop.
                    </option>
                    <option
                      value="Renewable Energy Adoption: Install solar panels or other renewable energy sources for personal use."
                      className=""
                    >
                      Renewable Energy Adoption: Install solar panels or other
                      renewable energy sources for personal use.
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mt-5">
              <input
                type="text"
                name="recipientAddress"
                id="recipientAddress"
                className="rounded-sm text-center text-[rgba(255,255,255,0.7)] placeholder:text-[1rem] placeholder:text-center bg-[rgba(255,255,255,0.25)] w-4/5 focus:outline-none placeholder:text-[rgba(255,255,255,0.4)] h-[2rem]"
                placeholder="Recipient address..."
                required
              />
            </div>
            <div className="flex flex-col items-center justify-center w-full mb-10 mt-2 gap-2 text-xl">
              Time
              <div className="flex justify-around w-full">
                <input
                  type="number"
                  name="hours"
                  id="hours"
                  min="0"
                  className="rounded-sm text-center text-[rgba(255,255,255,0.7)] placeholder:text-[1rem] placeholder:text-center bg-[rgba(255,255,255,0.25)] w-[30%] focus:outline-none placeholder:text-[rgba(255,255,255,0.4)] h-[2rem]"
                  placeholder="Hours"
                />
                <input
                  type="number"
                  name="minutes"
                  id="minutes"
                  min="0"
                  className="rounded-sm text-center text-[rgba(255,255,255,0.7)] placeholder:text-[1rem] placeholder:text-center bg-[rgba(255,255,255,0.25)] w-[30%] focus:outline-none placeholder:text-[rgba(255,255,255,0.4)] h-[2rem]"
                  placeholder="Minutes"
                />
                <input
                  type="number"
                  name="seconds"
                  id="seconds"
                  min="0"
                  className="rounded-sm text-center text-[rgba(255,255,255,0.7)] placeholder:text-[1rem] placeholder:text-center bg-[rgba(255,255,255,0.25)] w-[30%] focus:outline-none placeholder:text-[rgba(255,255,255,0.4)] h-[2rem]"
                  placeholder="Seconds"
                />
              </div>
            </div>

            <div className="flex flex-col w-full items-center gap-2">
              <h1 className={`text-[rgba(255,255,255,0.7)] text-xl`}>Crypto</h1>
              <div className="input-field relative flex justify-center">
                <input
                  id="cryptoAmount"
                  type="text"
                  name="cryptoAmount"
                  value={`$${cryptoAmount}`}
                  onChange={handleCryptoAmountChange}
                  className={`text-blue-accent bg-[rgba(255,255,255,0.25)] h-[4.4rem] w-4/5 text-4xl font-medium px-10 rounded-xl focus:outline-none`}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <div className="absolute w-4/5 h-0 -translate-y-1/2 flex flex-col items-end gap-2">
                  <button
                    type="button"
                    className="increment-button hover:cursor-pointer"
                    onClick={handleIncrement}
                  >
                    <Image
                      src={cryptoUpArrow}
                      alt="Up Arrow"
                      height={45}
                      width={45}
                    />
                  </button>
                  <button
                    type="button"
                    className="decrement-button hover:cursor-pointer"
                    onClick={handleDecrement}
                    disabled={cryptoAmount <= 0}
                  >
                    <Image
                      src={cryptoDownArrow}
                      alt="Down Arrow"
                      height={45}
                      width={45}
                    />
                  </button>
                </div>
              </div>
              <h1 className="text-lg text-[rgba(255,255,255,0.4)]">
                Crypto amount to be sent
              </h1>
            </div>
            <div className="flex w-full justify-center gap-[2%]">
              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 rounded-bl-xl bg-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.5)] text-[rgba(255,255,255,0.7)] font-medium py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 rounded-br-xl bg-[rgba(4,212,227,0.25)] hover:bg-[rgba(4,212,227,0.5)] text-blue-accent font-medium py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default SubmitNFT;
