import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EntryPropsInterface {
  email: string;
  jwtToken: string;
}

export default function EntryField(props: EntryPropsInterface) {
  // State
  const [value, setValue] = useState("");
  const [buttonState, setButtonState] = useState("active");

  // Instances
  const router = useRouter();

  // Function to make an entry
  const submitEntry = async () => {
    setButtonState("not-active");
    if (!value.trim()) {
      toast.error("Please enter your thoughts before submitting!");
      setButtonState("active");
      return;
    }

    // Call the function
    const entryResponse = await axios.post(
      "/api/fetchNutrientsData",
      { text: value },
      {
        params: {
          useremail: props.email,
        },
        headers: {
          usertoken: props.jwtToken,
        },
      }
    );

    if (entryResponse.status === 200) {
      if (entryResponse.data.data) {
        // Getting time-stamp
        const fetchedDate = new Date().toLocaleDateString();

        // Clear cached data
        localStorage.removeItem(`${fetchedDate}-lastEntryData`);
        localStorage.removeItem(`${fetchedDate}-dashboardStat`);
        localStorage.removeItem(`${fetchedDate}-calories-graphData`);
        localStorage.removeItem(`${fetchedDate}-fats-graphData`);
        localStorage.removeItem(`${fetchedDate}-carbs-graphData`);
        localStorage.removeItem(`${fetchedDate}-sodium-graphData`);
        localStorage.removeItem(`${fetchedDate}-sugars-graphData`);
        localStorage.removeItem(`${fetchedDate}-protein-graphData`);

        toast.success("Entry has been recorded successfully!");
        window.location.reload();
      } else {
        toast.success("An entry for today already exists!");
      }
    } else {
      toast.error("Unexpected error!");
    }

    setButtonState("active");
  };

  useEffect(() => {
    // Reset States
    setValue("");
    const localStorageToken = localStorage.getItem("token");
    if (!localStorageToken) {
      router.push("/auth");
    }
  }, []);

  return (
    <section className="bg-backgroundDark mt-10 my-auto px-2 py-10 rounded-xl">
      <div className="flex flex-col items-center gap-y-5">
        <div className="text-2xl md:text-3xl">
          Diary entry for today's intake.
        </div>

        <textarea
          placeholder="Bread, eggs, orange juice, banana, munch, cheetos, rice (300 g), dal, pulses, momos, and roti."
          className="w-2/3 bg-textGrey px-3 py-5 rounded-xl overflow-y-hidden resize-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p>Note: You can make one entry a day only.</p>

        {buttonState === "active" ? (
          <button
            className="px-5 py-2 rounded-xl bg-textDark hover:bg-backgroundDark transition duration-300"
            onClick={submitEntry}
          >
            Submit
          </button>
        ) : (
          <button
            className="px-5 py-2 rounded-xl bg-backgroundDark transition duration-300"
            disabled={true}
          >
            Submitting ...
          </button>
        )}
      </div>
    </section>
  );
}
