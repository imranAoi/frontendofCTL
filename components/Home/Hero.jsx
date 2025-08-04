'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext'; // make sure this path is correct
import Image from 'next/image';
import { Button } from '../ui/button';
import image from '../../public/image.jpg';

const Hero = () => {
  const { user, loading } = useAuth(); // ✅ Destructure `loading` and `user` properly
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?._id) {
      router.push(`/dashboard/user/${user._id}`);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-t-4 border-gray-900 rounded-full" />
      </div>
    );
  }

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-[#dfc853]">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Clarity, finally.
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Simplify your work and life with the world’s #1 to-do list app.
        </p>
        <Button
          onClick={() => router.push('/login')}
          className="text-white px-6 py-3 rounded-md text-lg shadow-md"
        >
          Start for free
        </Button>
      </div>

      <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
        <Image
          src={image}
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
