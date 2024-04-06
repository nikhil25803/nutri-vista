import Image from "next/image";
import ProfileStatCard from "../_components/Profile/StatsCard";
import EntryField from "../_components/Profile/EntryField";
import StatChart from "../_components/Profile/Last30DaysGraphs";

export default function ProfilePage({ params }: { params: { id: string } }) {
  return (
    <section className="bg-backgroundLight w-full">
      <div className="max-w-[1280px] mx-auto py-5 px-2 text-white h-fit">
        <div className="bg-backgroundDark px-5 py-10 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="flex flex-row items-center justify-center gap-x-5 md:flex-col gap-y-5 md:col-span-2">
              <Image
                src="https://avatars.githubusercontent.com/u/93156825?v=4"
                alt="Hello World"
                width={200}
                height={200}
                className="rounded-full"
              />
              <div>
                <h1 className="text-textDark text-3xl">Name</h1>
                <p className="text-textGrey">Username</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="space-y-5 text-center mt-5">
                <h1 className="text-2xl border-b-2 border-textGrey ">
                  Last 30 days total.
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10 text-white">
                  <ProfileStatCard value={150.5} category={"Calories"} />
                  <ProfileStatCard value={100} category={"Fat"} />
                  <ProfileStatCard value={17.94} category={"Carbs"} />
                  <ProfileStatCard value={233.92} category={"Sodium"} />
                  <ProfileStatCard value={1.59} category={"Sugars"} />
                  <ProfileStatCard value={3.59} category={"Protein"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entry Field  */}
        <EntryField />
        <StatChart />
      </div>
    </section>
  );
}
