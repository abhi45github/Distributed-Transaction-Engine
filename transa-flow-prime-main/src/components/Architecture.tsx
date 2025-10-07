import { ArrowRight, Database, Server, Cloud, Shield } from "lucide-react";

const Architecture = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            System <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Architecture</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scalable microservices design with fault-tolerant components
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Architecture Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Client Layer */}
            <div className="rounded-xl border border-primary/30 bg-card/50 backdrop-blur-sm p-6 text-center hover:border-primary/60 transition-all hover:shadow-[0_0_20px_rgba(76,209,255,0.2)]">
              <Cloud className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Client Layer</h3>
              <p className="text-xs text-muted-foreground">API Gateway</p>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-6 w-6 text-primary/50" />
            </div>

            {/* Service Layer */}
            <div className="rounded-xl border border-secondary/30 bg-card/50 backdrop-blur-sm p-6 text-center hover:border-secondary/60 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Server className="h-8 w-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Microservices</h3>
              <p className="text-xs text-muted-foreground">Spring Boot</p>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-6 w-6 text-primary/50" />
            </div>

            {/* Data Layer */}
            <div className="rounded-xl border border-primary/30 bg-card/50 backdrop-blur-sm p-6 text-center hover:border-primary/60 transition-all hover:shadow-[0_0_20px_rgba(76,209,255,0.2)]">
              <Database className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Data Layer</h3>
              <p className="text-xs text-muted-foreground">Redis & DB</p>
            </div>
          </div>

          {/* Key Patterns */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6">
              <Shield className="h-6 w-6 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Circuit Breaker</h4>
              <p className="text-sm text-muted-foreground">
                Prevents cascade failures and enables graceful degradation
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6">
              <Database className="h-6 w-6 text-secondary mb-3" />
              <h4 className="font-semibold mb-2">Distributed Lock</h4>
              <p className="text-sm text-muted-foreground">
                Redis-based locking ensures transaction integrity
              </p>
            </div>

            <div className="rounded-xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6">
              <Server className="h-6 w-6 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Auto-Recovery</h4>
              <p className="text-sm text-muted-foreground">
                Automatic service recovery maintains high availability
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
