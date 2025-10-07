import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Database,
  Shield,
  Zap,
  ArrowRight,
  Cloud,
  Lock,
  Activity,
  Globe,
  Layers,
  GitBranch,
  HardDrive
} from "lucide-react";

const AnimatedArchitecture = () => {
  const [activeFlow, setActiveFlow] = useState<number>(0);
  const [animationStep, setAnimationStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const flows = [
    { from: "client", to: "gateway", label: "HTTPS Request" },
    { from: "gateway", to: "transaction", label: "Route & Balance" },
    { from: "transaction", to: "redis", label: "Acquire Lock" },
    { from: "transaction", to: "postgres", label: "Persist Data" },
    { from: "transaction", to: "rabbitmq", label: "Publish Event" },
    { from: "rabbitmq", to: "services", label: "Process Async" },
  ];

  return (
    <section id="architecture" className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            System Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Microservices architecture with distributed locking and circuit breakers
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Architecture Diagram */}
          <Card className="mb-8 overflow-hidden">
            <CardHeader>
              <CardTitle>Transaction Flow Architecture</CardTitle>
            </CardHeader>
            <CardContent className="relative p-8">
              <div className="grid grid-cols-4 gap-8">
                {/* Column 1: Client Layer */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Client Layer</div>
                  <div
                    id="client"
                    className={`relative p-4 rounded-lg border-2 transition-all duration-500 ${
                      animationStep === 0 ? 'border-primary bg-primary/10 scale-105' : 'border-border'
                    }`}
                  >
                    <Globe className="h-8 w-8 mb-2 text-primary" />
                    <div className="font-semibold">Web/Mobile Client</div>
                    <div className="text-xs text-muted-foreground mt-1">REST API Calls</div>
                    {animationStep === 0 && (
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                        <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Gateway & Load Balancer */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Gateway Layer</div>
                  <div
                    id="gateway"
                    className={`relative p-4 rounded-lg border-2 transition-all duration-500 ${
                      animationStep === 1 ? 'border-primary bg-primary/10 scale-105' : 'border-border'
                    }`}
                  >
                    <Cloud className="h-8 w-8 mb-2 text-primary" />
                    <div className="font-semibold">API Gateway</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Rate Limiting<br/>
                      Load Balancing<br/>
                      Authentication
                    </div>
                    {animationStep === 1 && (
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                        <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <Shield className="h-8 w-8 mb-2 text-green-500" />
                    <div className="font-semibold text-sm">Circuit Breaker</div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Resilience4j
                    </Badge>
                  </div>
                </div>

                {/* Column 3: Core Services */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Service Layer</div>

                  <div
                    id="transaction"
                    className={`relative p-4 rounded-lg border-2 transition-all duration-500 ${
                      animationStep === 2 || animationStep === 3 ? 'border-primary bg-primary/10 scale-105' : 'border-border'
                    }`}
                  >
                    <Server className="h-8 w-8 mb-2 text-primary" />
                    <div className="font-semibold">Transaction Service</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Core Processing<br/>
                      10,000+ TPS
                    </div>
                    <Badge className="mt-2" variant="default">Port 8081</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border border-border">
                      <Layers className="h-6 w-6 mb-1 text-blue-500" />
                      <div className="text-xs font-semibold">Payment</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border">
                      <GitBranch className="h-6 w-6 mb-1 text-purple-500" />
                      <div className="text-xs font-semibold">Account</div>
                    </div>
                  </div>

                  <div
                    id="services"
                    className={`p-3 rounded-lg border border-border ${
                      animationStep === 5 ? 'border-primary bg-primary/10' : ''
                    }`}
                  >
                    <Activity className="h-6 w-6 mb-1 text-orange-500" />
                    <div className="text-xs font-semibold">Notification Service</div>
                  </div>
                </div>

                {/* Column 4: Data Layer */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Data Layer</div>

                  <div
                    id="redis"
                    className={`relative p-4 rounded-lg border-2 transition-all duration-500 ${
                      animationStep === 3 ? 'border-primary bg-primary/10 scale-105' : 'border-border'
                    }`}
                  >
                    <Lock className="h-8 w-8 mb-2 text-red-500" />
                    <div className="font-semibold">Redis</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Distributed Locking<br/>
                      Caching<br/>
                      Session Store
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">Redisson</Badge>
                  </div>

                  <div
                    id="postgres"
                    className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                      animationStep === 4 ? 'border-primary bg-primary/10 scale-105' : 'border-border'
                    }`}
                  >
                    <Database className="h-8 w-8 mb-2 text-blue-500" />
                    <div className="font-semibold">PostgreSQL</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Primary Database<br/>
                      ACID Compliance
                    </div>
                  </div>

                  <div
                    id="rabbitmq"
                    className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                      animationStep === 5 ? 'border-primary bg-primary/10 scale-105' : 'border-border'
                    }`}
                  >
                    <Zap className="h-8 w-8 mb-2 text-yellow-500" />
                    <div className="font-semibold">RabbitMQ</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Message Queue<br/>
                      Event Streaming
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Flow Indicator */}
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Current Flow:</div>
                  <Badge variant="default" className="animate-pulse">
                    {flows[animationStep]?.label || "Initializing..."}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Technologies */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Distributed Locking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Redis with Redisson client ensures transaction integrity across multiple instances.
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Lock Timeout</span>
                    <Badge variant="secondary">30s</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Wait Time</span>
                    <Badge variant="secondary">10s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Circuit Breaker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Resilience4j provides automatic failure recovery with configurable thresholds.
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Failure Rate</span>
                    <Badge variant="secondary">40%</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Open Duration</span>
                    <Badge variant="secondary">20s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  Data Persistence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  PostgreSQL with optimized indexing and connection pooling via HikariCP.
                </p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Pool Size</span>
                    <Badge variant="secondary">100</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Query Timeout</span>
                    <Badge variant="secondary">5s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedArchitecture;