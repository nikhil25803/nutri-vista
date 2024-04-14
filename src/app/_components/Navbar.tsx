"use client";

import Link from "next/link";
import { TbUserSquareRounded } from "react-icons/tb";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GrLogout } from "react-icons/gr";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const [tokenCreated, setTokenCreated] = useState(false);
  const [loggedIn, setIsLoggedIn] = useState(false);

  const [userName, setUsername] = useState();

  // Function to logout user
  const logOutUser = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/auth" });
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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
          const res = {
            fethced: true,
            data: validationResponse.data,
          };

          return res;
        } else {
          const res = {
            fethced: false,
            data: null,
          };

          return res;
        }
      } catch (error) {
        const res = {
          fethced: false,
          data: null,
        };

        return res;
      }
    };

    // If there, is it valid
    const checkTokenValidity = async () => {
      if (localStorageToken) {
        const check = await validateToken(localStorageToken);
        if (check.fethced) {
          setIsLoggedIn(true);
          setTokenCreated(true);

          setUsername(check.data.data.username);
        } else {
          setIsLoggedIn(false);
          logOutUser();
        }
      } else {
        setIsLoggedIn(false);
        logOutUser();
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
            <div>
              <button
                className="px-4 py-2 "
                onClick={() => {
                  router.push(`/${userName}`);
                }}
              >
                <TbUserSquareRounded className="text-4xl text-white hover:text-textDark transition duration-500" />
              </button>
              <button className="px-4 py-2 " onClick={logOutUser}>
                <GrLogout className="text-4xl text-white hover:text-textDark transition duration-500" />
              </button>
            </div>
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
