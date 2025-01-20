import { Features } from "@/components/Features";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="overflow-auto scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
      <Hero />
      <Features />
      <div className="min-h-screen flex justify-center items-center border-2 border-black">
        <h1 className="text-4xl font-bebas-neue mr-4">Home</h1>
      </div>
    </div>
  );
}
