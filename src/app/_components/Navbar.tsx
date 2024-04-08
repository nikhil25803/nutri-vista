"use client";

import Link from "next/link";
import { TbUserSquareRounded } from "react-icons/tb";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDatFromToken } from "../helpers/decodeToke";

export default function Navbar() {
  const { data: session } = useSession();

  const [tokenCreated, setTokenCreated] = useState(false);

  useEffect(() => {
    // Check if JWT token already there
    const localStorageToken = localStorage.getItem("token");

    // If there, is it valid
    if (localStorageToken) {
      const decodedToken = getDatFromToken(localStorageToken);
      if (decodedToken.tokenValid) {
        setTokenCreated(true);
      }
    }

    // If not, fetch new token and add
    const fetchToken = async () => {
      if (session && session.user && !tokenCreated) {
        try {
          const response = await axios.post("/api/gettoken", {
            email: session.user.email,
          });
          if (response.data.tokenCreated) {
            setTokenCreated(true);
            const jwtToken = response.data.token;

            // Save to local-storage
            localStorage.setItem("token", jwtToken);
          }
        } catch (error) {
          console.log("Error callign the /api/gettoken endpoint: ", error);
        }
      }
    };

    fetchToken();
  }, [session, tokenCreated]);

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
