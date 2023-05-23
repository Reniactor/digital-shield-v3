import { useContract, useContractWrite } from "@thirdweb-dev/react";
import Image from "next/image";

const Nftcard = ({
  imageURL,
  param1,
  param2,
  param3,
  hours,
  minutes,
  seconds,
  cryptoAmount,
  claimable,
  claimed,
  id,
}) => {
  const { contract } = useContract(
    `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`
  );
  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "release"
  );
  const handleClick = async () =>
    await mutateAsync({
      args: [id],
    });
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
        <h1>To do's:</h1>
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
      {id ? (
        <button
          type="button"
          className="rounded-md w-24 h-12 bg-header-background-color text-titleWhite hover:bg-titleWhite hover:text-header-background-color duration-500"
          onClick={handleClick}
        >
          Release!
        </button>
      ) : (
        ""
      )}
    </div>
  );
};
export default Nftcard;
