import Image from "next/image";
import logo from "../../public/logo.png";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
  return (
    <header
      className="flex 
    h-[3.5rem] 
    w-full 
    bg-header-background-color 
    items-center 
    px-2
    border-b-blue-accent 
    border-b-[3px]
    justify-between
    gap-2
    fixed
    top-0
    left-0"
    >
      <Image src={logo} alt="logo" className="h-12 w-auto" priority />
      <ConnectWallet
        theme="dark"
        className="!bg-transparent !border-none !max-h-full !text-blue-accent hover:!text-base-text-color !transition-transform !duration-700"
      />
    </header>
  );
}
