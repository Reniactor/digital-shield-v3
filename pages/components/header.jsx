import Image from "next/image";
import logo from "../../public/logo.png";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function NavBar() {
  const address = useAddress();
  const links = [
    {
      name: "Sent",
      route: "/sent",
    },
    {
      name: "Received",
      route: "/received",
    },
    {
      name: "Home",
      route: "/",
    },
  ];
  if (address == process.env.NEXT_PUBLIC_ADMINWALLET)
    links.push({ name: "Admin", route: "/admin" });
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
      <Link href="/">
        <Image src={logo} alt="logo" className="h-12 w-auto" priority />
      </Link>
      <div className="flex min-w-[240px] max-w-[245px] justify-between items-center">
        <ConnectWallet
          theme="dark"
          className="!bg-transparent !border-none !max-h-full !text-blue-accent hover:!text-base-text-color !transition-transform !duration-700"
        />
        <DropdownButton id="dropdown-basic-button" title="">
          {links.map(({ name, route }, index) => {
            return (
              <Dropdown.Item href={route} key={index}>
                {name}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
    </header>
  );
}
