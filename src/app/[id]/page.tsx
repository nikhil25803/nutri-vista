"use client";

import Image from "next/image";
import ProfileStatCard from "../_components/Profile/StatsCard";
import EntryField from "../_components/Profile/EntryField";
import StatChart from "../_components/Profile/Last30DaysGraphs";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReactTyped } from "react-typed";
import axios from "axios";
import toast from "react-hot-toast";
import LastEntry from "../_components/Profile/LastEntry";

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Initialize router
  const router = useRouter();

  // Fetch session data
  const session = useSession();

  const [isValid, setIsValid] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [avatar, setAvatar] = useState(
    "https://avatars.githubusercontent.com/u/93156825?v=4"
  );
  const [dashboardData, setDashboardData] = useState({
    totalCalories: 0,
    totalFat: 0,
    totalCarbs: 0,
    totalSodium: 0,
    totalSugars: 0,
    totalProtein: 0,
  });

  // Function to logout user
  const logOutUser = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/auth" });
    localStorage.removeItem("token");
    router.push(data.url);
  };

  // Function to validate token
  const tokenValidity = async (tokenData: string) => {
    try {
      // Validate JWT Token
      const validationResponse = await axios.get("/api/validateUser", {
        headers: {
          usertoken: tokenData,
        },
      });

      // If toke is validated
      if (validationResponse.status == 200) {
        const response = {
          data: validationResponse.data,
          isValid: true,
        };

        return response;
      } else {
        const response = {
          data: null,
          isValid: false,
        };

        return response;
      }
    } catch (error) {
      const response = {
        data: null,
        isValid: false,
      };

      return response;
    }
  };

  // Function to fetch last 30 days data
  const fetchLast30DaysDaya = async (
    userEmail: string,
    sessionToken: string
  ) => {
    try {
      // Make an API call to fetch data
      const userData = await axios.get("/api/getDashboardStat", {
        params: {
          useremail: userEmail,
        },
        headers: {
          usertoken: sessionToken,
        },
      });

      if (userData.status === 200) {
        const res = {
          success: true,
          data: userData.data,
        };

        return res;
      } else {
        const res = {
          data: null,
          success: false,
        };

        return res;
      }
    } catch (error) {
      const res = {
        data: null,
        success: false,
      };

      return res;
    }
  };

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");

    if (!localStorageToken) {
      router.push("/auth");
    } else {
      // If token is available
      const checkTokenValidity = async () => {
        const check = await tokenValidity(localStorageToken);

        if (check.isValid) {
          setJwtToken(localStorageToken);
          const userData = check.data.data;
          if (params.id === userData.username) {
            // The user is authenticated as well as valid, then set the parameters
            setIsValid(true);
            setName(userData.name);
            setUsername(userData.username);
            setEmail(userData.email);
            setAvatar(userData.photourl);

            const fetchedDate = new Date().toLocaleDateString();

            // Check for cached result
            const cachedDashboardData = localStorage.getItem(
              `${fetchedDate}-dashboardStat`
            );
            if (cachedDashboardData) {
              setDashboardData(JSON.parse(cachedDashboardData));
            } else {
              // Now fetch the last 30 days data
              const dashboardStat = await fetchLast30DaysDaya(
                userData.email,
                localStorageToken
              );

              // If data has been fetched successfully
              if (dashboardStat.success) {
                setDashboardData(dashboardStat.data.data);
                localStorage.setItem(
                  `${fetchedDate}-dashboardStat`,
                  JSON.stringify(dashboardStat.data.data)
                );
              }
            }
          } else {
            toast.success("You can only visit your profile.", {
              id: userData.id,
            });
            setIsValid(false);
            router.push("/");
          }
        } else {
          toast.error("Session Expired. Login Again", { id: params.id });
          logOutUser();
          setIsValid(false);
        }
      };

      checkTokenValidity();
    }
  }, []);

  return (
    <section className="bg-backgroundLight w-full">
      {isValid ? (
        <div className="max-w-[1280px] mx-auto py-5 px-2 text-white h-fit">
          <div className="bg-backgroundDark px-5 py-10 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-x-5 md:flex-col gap-y-5 md:col-span-2">
                <Image
                  src={avatar}
                  alt="Hello World"
                  width={200}
                  height={200}
                  className="rounded-full w-[200px] h-[200px]"
                />
                <div>
                  <h1 className="text-textDark text-3xl">{name}</h1>
                  <p className="text-textGrey">{username}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="space-y-5 text-center mt-5">
                  <h1 className="text-2xl border-b-2 border-textGrey ">
                    Last 30 days total.
                  </h1>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10 text-white">
                    <ProfileStatCard
                      value={dashboardData.totalCalories}
                      category={"Calories (kcal)"}
                    />
                    <ProfileStatCard
                      value={dashboardData.totalFat}
                      category={"Fat (g)"}
                    />
                    <ProfileStatCard
                      value={dashboardData.totalCarbs}
                      category={"Carbs (g)"}
                    />
                    <ProfileStatCard
                      value={dashboardData.totalSodium}
                      category={"Sodium (mg)"}
                    />
                    <ProfileStatCard
                      value={dashboardData.totalSugars}
                      category={"Sugars (g)"}
                    />
                    <ProfileStatCard
                      value={dashboardData.totalProtein}
                      category={"Protein (g)"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Entry Field  */}
          <EntryField email={email} jwtToken={jwtToken} />
          <LastEntry email={email} jwtToken={jwtToken} />
          <StatChart email={email} jwtToken={jwtToken} />
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center h-screen">
          <h1 className="text-2xl md:text-4xl lg:text-6xl text-white">
            Loading{" "}
            <span>
              <ReactTyped
                className="text-textDark"
                strings={["..."]}
                typeSpeed={75}
                loop={false}
                cursorChar="."
              />
            </span>
          </h1>
        </div>
      )}
    </section>
  );
}
