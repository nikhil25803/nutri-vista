"use client";

import Link from "next/link";
import { TbUserSquareRounded } from "react-icons/tb";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-backgroundDark text-textWhite w-full">
      <div className="max-w-[1280px] mx-auto py-5 px-2 flex justify-between items-center">
        <div className="text-3xl">
          <Link href="/">
            Nutri<span className="text-textDark ml-1">Vista</span>
          </Link>
        </div>
        <div>
          {session && (
            <button className="px-4 py-2 " onClick={() => signOut()}>
              <TbUserSquareRounded className="text-4xl text-white hover:text-textDark transition duration-500" />
            </button>
          )}
          {!session && (
            <button
              className="bg-textDark px-4 py-2 rounded-lg hover:bg-backgroundDark transition duration-300"
              onClick={() => signIn()}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
