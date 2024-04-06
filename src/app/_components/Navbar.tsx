"use client";
import Link from "next/link";
import { useState } from "react";
import { TbUserSquareRounded } from "react-icons/tb";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <nav className="bg-backgroundDark text-textWhite w-full">
      <div className="max-w-[1280px] mx-auto py-5 px-2 flex justify-between items-center">
        <div className="text-3xl">
          <Link href="/">
            Nutri<span className="text-textDark ml-1">Vista</span>
          </Link>
        </div>
        <div>
          {loggedIn ? (
            <TbUserSquareRounded className="text-4xl text-white hover:text-textDark transition duration-500" />
          ) : (
            <button className="bg-textDark px-4 py-2 rounded-lg hover:bg-backgroundDark transition duration-300">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
