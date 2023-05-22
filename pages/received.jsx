import { useAddress } from "@thirdweb-dev/react";
import NavBar from "./components/header";
import Nftcard from "./components/nftcard/nftcard";

const Received = () => {
  const walletAddress = useAddress();

  return (
    <main className="bg-background-color-website min-h-screen min-w-screen flex justify-center items-center text-white">
      <NavBar />
      {!walletAddress ? (
        <div>Please connect your wallet to see this page</div>
      ) : (
        <Nftcard />
      )}
    </main>
  );
};
export default Received;
