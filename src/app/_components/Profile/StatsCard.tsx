export default function ProfileStatCard(data: any) {
  return (
    <div className="border-b-2 border-textDark text-center gap-5 space-y-2 p-2">
      <h1 className="text-2xl text-textDark">{data.value}</h1>
      <h6>{data.category}</h6>
    </div>
  );
}
