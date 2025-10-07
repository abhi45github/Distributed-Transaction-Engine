import { Activity, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm">
            <Activity className="h-4 w-4 text-primary animate-pulse-glow" />
            <span className="text-muted-foreground">High-Performance Transaction Processing</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-slide-up">
            Distributed Transaction{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Engine
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.1s]">
            Enterprise-grade microservices architecture designed for scale, reliability, and performance
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 animate-slide-up [animation-delay:0.2s]">
            <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(76,209,255,0.2)]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <div className="text-3xl font-bold text-primary">10,000+</div>
              </div>
              <div className="text-sm text-muted-foreground">Concurrent Transactions</div>
            </div>

            <div className="rounded-xl border border-secondary/20 bg-card/50 backdrop-blur-sm p-6 hover:border-secondary/40 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-secondary" />
                <div className="text-3xl font-bold text-secondary">99.9%</div>
              </div>
              <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(76,209,255,0.2)]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary animate-pulse-glow" />
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Real-time
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Auto-Recovery</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up [animation-delay:0.3s]">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(76,209,255,0.3)] hover:shadow-[0_0_30px_rgba(76,209,255,0.5)] transition-all"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Try Live Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Architecture
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
