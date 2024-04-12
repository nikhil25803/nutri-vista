"use client";

import Link from "next/link";
import { TbUserSquareRounded } from "react-icons/tb";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const [tokenCreated, setTokenCreated] = useState(false);
  const [loggedIn, setIsLoggedIn] = useState(false);

  // Function to logout user
  const logOutUser = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/auth" });
    localStorage.removeItem("token");
    setIsLoggedIn(false)
    router.push(data.url);
  };

  useEffect(() => {
    // Check if JWT token already there
    const localStorageToken = localStorage.getItem("token");

    // Function to validate user token
    const validateToken = async (localStorageToken: string) => {
      try {
        const validationResponse = await axios.get("/api/validateUser", {
          headers: {
            usertoken: localStorageToken,
          },
        });

        if (validationResponse.status == 200) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    };

    // If there, is it valid
    const checkTokenValidity = async () => {
      if (localStorageToken) {
        const check = await validateToken(localStorageToken);
        if (check) {
          setIsLoggedIn(true);
          setTokenCreated(true);
        } else {
          setIsLoggedIn(false)
          logOutUser();
        }
      }
    };

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
        } catch (error) {}
      }
    };

    const fetchData = async () => {
      await checkTokenValidity();
      await fetchToken();
    };

    fetchData();
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
          {loggedIn && (
            <button
              className="px-4 py-2 "
              onClick={logOutUser}
            >
              <TbUserSquareRounded className="text-4xl text-white hover:text-textDark transition duration-500" />
            </button>
          )}
          {!loggedIn && (
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
