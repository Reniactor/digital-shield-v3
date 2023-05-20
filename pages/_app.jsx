import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Trispace } from "next/font/google";
import NavBar from "./components/header.jsx";
import Hero from "./components/hero/hero";

const trispace = Trispace({ subsets: ["latin"] });

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "polygon";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={activeChain}>
      <Component {...pageProps} />
      <main
        className={`${trispace.className} flex flex-col items-center bg-background-color-website min-h-screen min-w-full text-base-text-color`}
      >
        <NavBar />
        <Hero />
      </main>
    </ThirdwebProvider>
  );
}

export default MyApp;
