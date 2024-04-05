import { GrLinkedin, GrGithub } from "react-icons/gr";
import { BsTwitterX } from "react-icons/bs";
export default function Footer() {
  return (
    <footer className="bg-backgroundDark w-full text-white">
      <div className="max-w-[1280px] mx-auto py-10 flex flex-col gap-y-5 items-center justify-center text-xl md:text-3xl">
        <h1 className="">
          By{" "}
          <span className="text-textDark hover:text-white transition duration-300">
            <a href="https://nikhilraj.live/" target="_blank">
              Nikhil Raj
            </a>
          </span>
        </h1>
        <div className="flex gap-x-5">
          <a
            className="hover:text-textDark transition duration-300"
            href="https://www.linkedin.com/in/nikhil25803/"
            target="_blank"
          >
            <GrLinkedin />
          </a>
          <a
            className="hover:text-textDark transition duration-300"
            href="https://github.com/nikhil25803"
            target="_blank"
          >
            <GrGithub />
          </a>
          <a
            className="hover:text-textDark transition duration-300"
            href="https://twitter.com/humans_write"
            target="_blank"
          >
            <BsTwitterX />
          </a>
        </div>
      </div>
    </footer>
  );
}
