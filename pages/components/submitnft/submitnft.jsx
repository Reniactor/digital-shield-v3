"use client";
import Image from "next/image";
import Aero_03 from "next/font/local";
import { Trispace } from "next/font/google";
import upload from "/public/alt upload image.png";
import cryptoUpArrow from "/public/crypto value up arrow.png";
import cryptoDownArrow from "/public/crypto value down arrow.png";
import { useEffect, useState } from "react";

const titleWhite = "#c6c4c8";

const trispace = Trispace({ src: "next/font/google", subsets: ["latin"] });

const aero = Aero_03({
  src: "../../../public/AERO_03.ttf",
  subsets: "latin",
});

function SubmitNFT() {
  const [selectedImage, setSelectedImage] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(0);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleCancel = () => {
    document.getElementById("uploadForm").reset();
    setSelectedImage(null);
    setCryptoAmount(0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Collect the form data
    const formData = new FormData(event.target);
    const imageFile = formData.get("image");
    const cryptoValue = formData.get("cryptoAmount");
    const hours = formData.get("hours");
    const minutes = formData.get("minutes");
    const seconds = formData.get("seconds");

    // Do something with the form data
    console.log("Image File:", imageFile);
    console.log("Crypto Amount:", cryptoValue);
    console.log("hours:", hours);
    console.log("minutes:", minutes);
    console.log("seconds:", seconds);

    // Reset the form
    setSelectedImage("");
    setCryptoAmount(0);
  };

  return (
    <div
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundRepeat: "no-repeat",
      }}
      className={`
      ${trispace.className}  
      flex 
      flex-col 
      w-full 
      h-[900px] 
      rounded-md 
      items-center 
      py-10
      `}
    >
      <form
        id="uploadForm"
        className="h-full w-4/5 text-[rgba(255,255,255,0.7)]"
        noValidate
      >
        <div className="h-full w-full bg-[rgba(255,255,255,0.25)] rounded-xl flex flex-col justify-between">
          <div className="flex flex-col w-full items-center gap-6 my-6 relative">
            <h1 className=" text-xl">Upload Image</h1>
            <div className="relative w-4/5 h-auto max-w-[260px] hover:cursor-pointer">
              <Image
                src={selectedImage || upload}
                height={1000}
                width={1000}
                alt="Uploaded Image"
                className="max-h-[262px] max-w-[262px] overflow-y-hidden w-auto text-center"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="w-full flex-col gap-12">
            <h1 className="text-center text-xl mb-4 rounded-sm h-[2rem h-[2rem]]">
              Achievements
            </h1>
            <div className="flex justify-around">
              <div className="flex w-[30%] flex-col">
                <h1 className="text-center text-base text-blue-accent">
                  1st parameter
                </h1>
                <select
                  name="firstParameter"
                  id="firstParameter"
                  className="text-[rgba(255,255,255,0.7)] text-ellipsis bg-[rgba(255,255,255,0.25)] rounded-sm h-[2rem]"
                >
                  <option value="First A" className="">
                    First A
                  </option>
                  <option value="Second A" className="">
                    Second A
                  </option>
                  <option value="Third A" className="">
                    Third A
                  </option>
                </select>
              </div>
              <div className="flex w-[30%] flex-col">
                <h1 className="text-center  text-blue-accent">2nd parameter</h1>
                <select
                  name="secondParameter"
                  id="secondParameter"
                  className="text-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.25)] text-ellipsis rounded-sm h-[2rem]"
                >
                  <option value="First B" className="">
                    First B
                  </option>
                  <option value="Second B" className="">
                    Second B
                  </option>
                  <option value="Third B" className="">
                    Third B
                  </option>
                </select>
              </div>
              <div className="flex w-[30%] flex-col">
                <h1 className="text-center  text-blue-accent">3rd parameter</h1>
                <select
                  name="thirdParameter"
                  id="thirdParameter"
                  className="text-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.25)] text-ellipsis rounded-sm h-[2rem]"
                >
                  <option value="First C" className="">
                    First C
                  </option>
                  <option value="Second C" className="">
                    Second C
                  </option>
                  <option value="Third C" className="">
                    Third C
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full my-10 gap-2 text-xl">
            Time
            <div className="flex justify-around w-full">
              <input
                type="number"
                name="hours"
                id="input-hours"
                min="0"
                className="rounded-sm text-blue-accent placeholder:text-[1rem] placeholder:text-center bg-[rgba(255,255,255,0.25)] w-[30%] focus:outline-none placeholder:text-[rgba(255,255,255,0.4)] h-[2rem]"
                placeholder="hours"
              />
              <input
                type="number"
                name="minutes"
                id="input-minutes"
                min="0"
                className="rounded-sm text-blue-accent placeholder:text-[1rem] placeholder:text-center bg-[rgba(255,255,255,0.25)] w-[30%] focus:outline-none placeholder:text-[rgba(255,255,255,0.4)] h-[2rem]"
                placeholder="minutes"
              />
              <input
                type="number"
                name="seconds"
                id="input-seconds"
                min="0"
                className="rounded-sm text-blue-accent placeholder:text-[1rem] placeholder:text-center bg-[rgba(255,255,255,0.25)] w-[30%] focus:outline-none placeholder:text-[rgba(255,255,255,0.4)] h-[2rem]"
                placeholder="seconds"
              />
            </div>
          </div>

          <div className="flex flex-col w-full items-center gap-2">
            <h1 className={`text-[rgba(255,255,255,0.7)] text-xl`}>Crypto</h1>
            <div className="input-field relative flex justify-center">
              <input
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
              onSubmit={handleSubmit}
              className="w-1/2 rounded-br-xl bg-[rgba(4,212,227,0.25)] hover:bg-[rgba(4,212,227,0.5)] text-blue-accent font-medium py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SubmitNFT;
