import axios from "axios";
import ProfileStatCard from "./StatsCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface LastEntryProps {
  email: string;
  jwtToken: string;
}

export default function LastEntry(props: LastEntryProps) {
  const currentDate = new Date();
  const [nutrientsData, setNutrientsData] = useState({
    protein: 0,
    carbs: 0,
    sugars: 0,
    fats: 0,
    sodium: 0,
    calories: 0,
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  // Function to make /getLastEntry API Call
  const fetchLastEntryData = async (userEmail: string, jwtToken: string) => {
    // Call the function
    const entryResponse = await axios.get("/api/getLastEntry", {
      params: {
        useremail: userEmail,
      },
      headers: {
        usertoken: jwtToken,
      },
    });

    if (entryResponse.status === 200) {
      const res = {
        fetched: true,
        data: entryResponse.data,
      };

      return res;
    } else {
      const res = {
        fetched: false,
        data: null,
      };

      return res;
    }
  };

  useEffect(() => {
    // Getting time-stamp
    const fetchedDate = new Date().toLocaleDateString();

    // Call the function
    const callFetchLastEntryData = async () => {
      const res = await fetchLastEntryData(props.email, props.jwtToken);
      if (res.fetched) {
        setNutrientsData(res.data.data);

        // Cache the result
        localStorage.setItem(`${fetchedDate}`, JSON.stringify(res.data));
      } else {
        toast.error("Error while fetching data. Sorry :(");
      }
    };

    const cachedData = localStorage.getItem(`${fetchedDate}`);
    if (!cachedData) {
      callFetchLastEntryData();
    } else {
      const cachedLastEntryData = JSON.parse(cachedData);
      setNutrientsData(cachedLastEntryData.data);
    }
  }, []);

  return (
    <section className="bg-backgroundDark mt-10 my-auto px-2 py-10 rounded-xl">
      <div className="flex flex-col items-center gap-y-5">
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="text-2xl md:text-3xl">Last Entry Result</h1>
          <p className="text-xl md:text-lg text-textGrey">
            Date :{" "}
            {`${nutrientsData.day}/${nutrientsData.month}/${nutrientsData.year}`}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-20 gap-y-10">
          <ProfileStatCard
            value={parseInt(nutrientsData.calories.toString())}
            category={"Calories"}
          />
          <ProfileStatCard
            value={parseInt(nutrientsData.fats.toString())}
            category={"Fat"}
          />
          <ProfileStatCard
            value={parseInt(nutrientsData.carbs.toString())}
            category={"Carbs"}
          />
          <ProfileStatCard
            value={parseInt(nutrientsData.sodium.toString())}
            category={"Sodium"}
          />
          <ProfileStatCard
            value={parseInt(nutrientsData.sugars.toString())}
            category={"Sugars"}
          />
          <ProfileStatCard
            value={parseInt(nutrientsData.protein.toString())}
            category={"Protein"}
          />
        </div>
      </div>
    </section>
  );
}
