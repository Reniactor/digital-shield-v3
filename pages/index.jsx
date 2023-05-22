import { Trispace } from "next/font/google";
import NavBar from "./components/header.jsx";
import Hero from "./components/hero/hero";
import { useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const contract = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  useEffect(() => {
    if (!contract) return;
    setLoading(false);
  }, [contract]);

  return (
    <main
      className={`font-trispace flex flex-col items-center bg-background-color-website min-h-screen min-w-full text-base-text-color`}
    >
      <NavBar />
      <Hero />
    </main>
  );
}
