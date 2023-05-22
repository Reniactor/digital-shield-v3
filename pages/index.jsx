import { Trispace } from "next/font/google";
import NavBar from "./components/header.jsx";
import Hero from "./components/hero/hero";
import { useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main
      className={`font-trispace flex flex-col items-center bg-background-color-website min-h-screen min-w-full text-base-text-color`}
    >
      <NavBar />
      <Hero />
    </main>
  );
}
