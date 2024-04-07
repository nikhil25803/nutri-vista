export default function Custom404() {
  return (
    <section className="bg-backgroundLight w-full">
      <div className="max-w-[1280px] mx-auto px-2 py-5 flex flex-col items-center justify-center h-screen text-white gap-y-10">
        <h1 className="text-5xl md:text-7xl text-textDark border-b-2 border-textWhite">
          404
        </h1>
        <h1 className="text-3xl md:text-5xl ">Page Not Found</h1>
      </div>
    </section>
  );
}
