import { HomepageCardData } from "@/data/HomepageCard";
import HomepageCard from "./_components/Homepage/Cards";

export default function Home() {
  const cardData = HomepageCardData;
  return (
    <main className="bg-backgroundLight w-full text-white">
      <div className="max-w-[1280px] mx-auto py-5 px-2 flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col items-center gap-y-5">
            <h1 className="text-5xl lg:text-7xl">
              Welcome to{" "}
              <span className="border-b-2 border-textDark hover:text-textDark hover:border-textWhite transition duration-500">
                Nutri Vista!
              </span>
            </h1>
            <p className="text-xl lg:text-2xl">
              Your ultimate companion for hassle-free{" "}
              <span className="text-textDark ">nutrition analysis!</span>
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {cardData.map((cdata, index) => {
              return <HomepageCard key={index} data={cdata} />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
