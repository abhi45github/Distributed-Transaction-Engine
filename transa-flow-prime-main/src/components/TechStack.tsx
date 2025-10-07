import { Badge } from "@/components/ui/badge";

const technologies = [
  { name: "Java", category: "Language" },
  { name: "Spring Boot", category: "Framework" },
  { name: "Docker", category: "Container" },
  { name: "Redis", category: "Cache" },
  { name: "Microservices", category: "Architecture" },
  { name: "Circuit Breaker", category: "Pattern" },
  { name: "REST API", category: "Protocol" },
  { name: "Distributed Systems", category: "Architecture" },
];

const TechStack = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Technology <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Stack</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with industry-leading technologies for maximum reliability and performance
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-6 py-3 text-base border-primary/30 bg-card/50 backdrop-blur-sm hover:border-primary/60 hover:bg-primary/10 transition-all cursor-default group"
            >
              <span className="font-semibold group-hover:text-primary transition-colors">
                {tech.name}
              </span>
              <span className="ml-2 text-muted-foreground text-sm">• {tech.category}</span>
            </Badge>
          ))}
        </div>

        {/* Code Snippet */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <div className="h-3 w-3 rounded-full bg-secondary" />
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="ml-2 text-xs text-muted-foreground">TransactionService.java</span>
            </div>
            <pre className="text-sm text-foreground/90 font-mono">
              <code>{`@Service
@Transactional
public class TransactionService {
    
    @Autowired
    private RedisLockRegistry lockRegistry;
    
    @CircuitBreaker(name = "transactionService")
    public TransactionResult processTransaction(
        TransactionRequest request
    ) {
        Lock lock = lockRegistry.obtain(request.getId());
        try {
            if (lock.tryLock(5, TimeUnit.SECONDS)) {
                return executeTransaction(request);
            }
            throw new LockException("Failed to acquire lock");
        } finally {
            lock.unlock();
        }
    }
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
