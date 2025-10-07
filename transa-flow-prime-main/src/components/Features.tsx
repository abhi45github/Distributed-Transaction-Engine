import { Server, Lock, RotateCcw, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Server,
    title: "Microservices Architecture",
    description: "Built with Java and Spring Boot, our distributed system handles complex transaction workflows across multiple services with seamless orchestration.",
    color: "text-primary",
  },
  {
    icon: Lock,
    title: "Distributed Locking",
    description: "Ensures transaction integrity using Redis-based distributed locking mechanisms, preventing race conditions and maintaining data consistency.",
    color: "text-secondary",
  },
  {
    icon: RotateCcw,
    title: "Circuit Breakers",
    description: "Advanced fault tolerance with circuit breakers and auto-recovery mechanisms that maintain 99.9% uptime even under heavy load.",
    color: "text-primary",
  },
  {
    icon: Layers,
    title: "Container Orchestration",
    description: "Dockerized services with efficient resource management, enabling rapid deployment and scaling across multiple environments.",
    color: "text-secondary",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Core <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade capabilities designed for mission-critical transaction processing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(76,209,255,0.15)] group"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 p-3 group-hover:shadow-[0_0_20px_rgba(76,209,255,0.3)] transition-all`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
