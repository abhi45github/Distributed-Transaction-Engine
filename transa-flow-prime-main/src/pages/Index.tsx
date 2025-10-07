import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LiveDemo from "@/components/LiveDemo";
import AnimatedArchitecture from "@/components/AnimatedArchitecture";
import TechStack from "@/components/TechStack";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <LiveDemo />
      <AnimatedArchitecture />
      <TechStack />
    </div>
  );
};

export default Index;
