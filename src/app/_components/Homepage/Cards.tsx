import React from "react";

interface HomepageCardContent {
  title: string;
  description: string;
}

const HomepageCard = ({ data }: { data: HomepageCardContent }) => {
  return (
    <div className="bg-backgroundDark px-2 py-4 rounded-lg flex flex-col gap-y-2 shadow-lg shadow-textDark hover:shadow-sm transition duration-500">
      <h1 className="text-textDark">{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
};

export default HomepageCard;
