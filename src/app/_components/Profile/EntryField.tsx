export default function EntryField() {
  return (
    <section className="bg-backgroundDark mt-10 my-auto px-2 py-10 rounded-xl">
      <div className="flex flex-col items-center gap-y-5">
        <div className="text-2xl md:text-3xl">How was your day?</div>

        <textarea
          placeholder="Your words ..."
          className="w-2/3 bg-textGrey px-3 py-5 rounded-xl overflow-y-hidden resize-none"
        />

        <button className="px-5 py-2 rounded-xl bg-textDark hover:bg-backgroundDark transition duration-300">
          Submit
        </button>
      </div>
    </section>
  );
}
