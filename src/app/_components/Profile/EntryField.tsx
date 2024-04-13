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

  // Instances
  const router = useRouter();

  // Function to make an entry

  const submitEntry = async () => {
    if (!value.trim()) {
      toast.error("Please enter your thoughts before submitting!");
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
        toast.success("Entry has been recorded successfully!");
        window.location.reload();
      } else {
        toast.success("An entry for today already exists!");
      }
    } else {
      toast.error("Unexpected error!");
    }
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
        <div className="text-2xl md:text-3xl">How was your day?</div>

        <textarea
          placeholder="Your words ..."
          className="w-2/3 bg-textGrey px-3 py-5 rounded-xl overflow-y-hidden resize-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          className="px-5 py-2 rounded-xl bg-textDark hover:bg-backgroundDark transition duration-300"
          onClick={submitEntry}
        >
          Submit
        </button>
      </div>
    </section>
  );
}
