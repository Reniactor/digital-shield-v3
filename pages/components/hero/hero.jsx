import Image from "next/image";
import Aero_03 from "next/font/local";
import SubmitNFT from "../submitnft/submitnft";

const aero = Aero_03({
  src: "../../../public/AERO_03.ttf",
  subsets: ["Latin"],
});

const Hero = () => {
  return (
    <div className="mt-28 w-[85%] max-w-2xl flex flex-col items-center">
      <h1
        className={`${aero.className} text-center text-[2.4rem] font-black mb-2 text-blue-accent`}
        aria-label="page name"
      >
        Digital Shield
      </h1>
      <h2
        className="text-sm w-[90%] max-w-[60ch]"
        aria-label="page description"
      >
        Digital Shield is a lock-down contract built on blockchain technology
        that provides a secure way for people to protect their valuable assets.
        The contract allows users to set predetermined conditions for accessing
        their assets and can be reassigned to another designated person if
        certain requirements are not met.
      </h2>
      <div
        className="flex justify-center w-full mt-10"
        aria-label="page input fields to lock cryptos and images"
      >
        <SubmitNFT />
      </div>
    </div>
  );
};

export default Hero;
