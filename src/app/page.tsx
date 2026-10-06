import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { SolfaScalePlayer } from "@/components/landing/SolfaScalePlayer";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SolfaScalePlayer />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
