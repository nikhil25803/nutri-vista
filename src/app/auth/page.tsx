"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Authentication() {
  const session = useSession();

  if (session?.data) {
    redirect("/");
  }

  return (
    <section className="bg-backgroundLight w-full">
      <div className="max-w-[1280px] px-2 py-5 mx-auto h-screen flex items-center justify-center">
        <div className=" p-5 text-white w-fit flex flex-col items-center justify-center gap-y-5">
          <h1 className="text-2xl md:text-4xl">Authentication</h1>
          <div className="flex flex-col sm:flex-row gap-y-5 gap-x-5">
            <button
              className="flex justify-center items-center text-xl md:text-2xl p-4 bg-textDark gap-x-3 hover:bg-backgroundDark transition-colors duration-500"
              onClick={() => signIn("github")}
            >
              <FaGithub />
              GitHub
            </button>
            <button
              className="flex justify-center items-center text-xl md:text-2xl p-4 bg-textDark gap-x-3 hover:bg-backgroundDark transition-colors duration-500"
              onClick={() => signIn("google")}
            >
              <FaGoogle />
              Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
