import Image from "next/image";
import { Button } from "../ui/button";
import Link from 'next/link'
const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-[#dfc853]">
      
      {/* Left content */}
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Clarity, finally.
        </h1>

        <p className="text-gray-600 text-lg md:text-xl">
          Simplify your work and life with the world’s #1 to-do list app.
        </p>
        <Link href="/login">
        <Button className=" text-white px-6 py-3 rounded-md text-lg shadow-md">
          Start for free
        </Button>
        </Link>
      </div>

      {/* Right image mockup */}
      <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
        <Image
          src="https://images.unsplash.com/photo-1555435023-27409794b5c3?fit=crop&w=600&q=80"
          alt="Todo List Example"
          width={500}
          height={500}
          className="rounded-xl shadow-lg border border-gray-200"
        />
      </div>
    </section>
  );
};

export default Hero;
