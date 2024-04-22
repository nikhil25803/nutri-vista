import { HomepageCardData } from "@/data/HomepageCard";
import HomepageCard from "./_components/Homepage/Cards";

export default function Home() {
  const cardData = HomepageCardData;
  return (
    <main className="bg-backgroundLight w-full text-white">
      <div className="max-w-[1280px] mx-auto py-5 px-2 flex flex-col items-center justify-center h-fit sm:h-screen">
        <div className="flex flex-col items-center justify-center gap-y-20">
          <div className="flex flex-col items-center gap-y-5">
            <h1 className="text-3xl md:text-5xl lg:text-7xl">
              Welcome to{" "}
              <span className="border-b-2 border-textDark hover:text-textDark hover:border-textWhite transition duration-500">
                Nutri Vista!
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Your ultimate companion for hassle-free{" "}
              <span className="text-textDark ">nutrition analysis!</span>
            </p>
            <div>
            <a href="https://www.producthunt.com/posts/nutri-vista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-nutri&#0045;vista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=453224&theme=light" alt="Nutri&#0032;Vista - A&#0032;user&#0045;friendly&#0032;text&#0045;to&#0045;nutrition&#0032;analysis&#0032;platform&#0046; | Product Hunt" className="w-[200px] h-[35px] md:w-[250px] md:h-[54px] mt-10" /></a>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {cardData.map((cdata, index) => {
              return <HomepageCard key={index} data={cdata} />;
            })}
          </div>
          {/* <div className="">
            <button className="bg-textDark hover:bg-backgroundLight px-5 py-3 rounded-lg transition duration-300">
              Get Started
            </button>
          </div> */}
        </div>
      </div>
    </main>
  );
}
