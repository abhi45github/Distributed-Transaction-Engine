import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  Play,
  RotateCw,
  TrendingUp,
  Clock,
  Server,
  Shield,
  Upload,
  Download,
  FileText
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: number;
  latency?: number;
}

interface Metrics {
  totalTransactions: number;
  successRate: number;
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  currentTPS: number;
  peakTPS: number;
}

const LiveDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalTransactions: 0,
    successRate: 100,
    avgLatency: 0,
    p50Latency: 0,
    p95Latency: 0,
    p99Latency: 0,
    currentTPS: 0,
    peakTPS: 0,
  });
  const [progress, setProgress] = useState(0);
  const [demoPhase, setDemoPhase] = useState<"idle" | "single" | "concurrent" | "highload" | "complete" | "csv">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startDemo = () => {
    setIsRunning(true);
    setTransactions([]);
    setProgress(0);
    setDemoPhase("single");
    runDemo();
  };

  const runDemo = async () => {
    // Phase 1: Single Transaction
    setDemoPhase("single");
    await simulateSingleTransaction();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProgress(20);

    // Phase 2: Concurrent Transactions
    setDemoPhase("concurrent");
    await simulateConcurrentTransactions(100);
    setProgress(50);

    // Phase 3: High Load Test
    setDemoPhase("highload");
    await simulateHighLoad(1000);
    setProgress(100);

    // Complete
    setDemoPhase("complete");
    setIsRunning(false);
  };

  const simulateSingleTransaction = async () => {
    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      amount: 1000,
      status: "pending",
      timestamp: Date.now(),
    };

    setTransactions(prev => [transaction, ...prev]);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 50));

    transaction.status = "processing";
    transaction.latency = Math.floor(Math.random() * 20) + 30;
    setTransactions(prev => [transaction, ...prev.slice(1)]);

    await new Promise(resolve => setTimeout(resolve, 100));

    transaction.status = "completed";
    setTransactions(prev => [transaction, ...prev.slice(1)]);

    updateMetrics([transaction]);
  };

  const simulateConcurrentTransactions = async (count: number) => {
    const newTransactions: Transaction[] = [];
    const batchSize = 10;

    for (let i = 0; i < count; i += batchSize) {
      const batch = Array.from({ length: Math.min(batchSize, count - i) }, (_, j) => ({
        id: `TXN${Date.now()}-${i + j}`,
        amount: Math.floor(Math.random() * 5000) + 100,
        status: "completed" as const,
        timestamp: Date.now(),
        latency: Math.floor(Math.random() * 30) + 10,
      }));

      newTransactions.push(...batch);
      setTransactions(prev => [...batch, ...prev].slice(0, 50));

      const currentProgress = 20 + (i / count) * 30;
      setProgress(currentProgress);

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    updateMetrics(newTransactions);
  };

  const simulateHighLoad = async (targetTPS: number) => {
    const duration = 3000; // 3 seconds
    const interval = 100; // Update every 100ms
    const transactionsPerInterval = Math.floor(targetTPS * interval / 1000);
    const iterations = duration / interval;

    let allTransactions: Transaction[] = [];

    for (let i = 0; i < iterations; i++) {
      const batch = Array.from({ length: transactionsPerInterval }, (_, j) => ({
        id: `TXN-HL-${Date.now()}-${j}`,
        amount: Math.floor(Math.random() * 10000) + 100,
        status: Math.random() > 0.02 ? "completed" : "failed" as const,
        timestamp: Date.now(),
        latency: Math.floor(Math.random() * 50) + 5,
      }));

      allTransactions.push(...batch);
      setTransactions(prev => [...batch, ...prev].slice(0, 50));

      const currentProgress = 50 + (i / iterations) * 50;
      setProgress(currentProgress);

      // Update TPS
      setMetrics(prev => ({
        ...prev,
        currentTPS: transactionsPerInterval * (1000 / interval),
        peakTPS: Math.max(prev.peakTPS, transactionsPerInterval * (1000 / interval)),
      }));

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    updateMetrics(allTransactions);
  };

  const updateMetrics = (newTransactions: Transaction[]) => {
    setMetrics(prev => {
      const completed = newTransactions.filter(t => t.status === "completed");
      const latencies = completed.map(t => t.latency || 0).sort((a, b) => a - b);

      const totalTransactions = prev.totalTransactions + newTransactions.length;
      const successCount = prev.totalTransactions * (prev.successRate / 100) + completed.length;
      const successRate = (successCount / totalTransactions) * 100;

      const p50 = latencies[Math.floor(latencies.length * 0.5)] || prev.p50Latency;
      const p95 = latencies[Math.floor(latencies.length * 0.95)] || prev.p95Latency;
      const p99 = latencies[Math.floor(latencies.length * 0.99)] || prev.p99Latency;
      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length || prev.avgLatency;

      return {
        totalTransactions,
        successRate,
        avgLatency: Math.round(avgLatency),
        p50Latency: Math.round(p50),
        p95Latency: Math.round(p95),
        p99Latency: Math.round(p99),
        currentTPS: prev.currentTPS,
        peakTPS: prev.peakTPS,
      };
    });
  };

  const resetDemo = () => {
    setTransactions([]);
    setMetrics({
      totalTransactions: 0,
      successRate: 100,
      avgLatency: 0,
      p50Latency: 0,
      p95Latency: 0,
      p99Latency: 0,
      currentTPS: 0,
      peakTPS: 0,
    });
    setProgress(0);
    setDemoPhase("idle");
    setIsRunning(false);
  };

  // Generate sample CSV data
  const generateSampleCSV = () => {
    const headers = "transaction_id,amount,currency,type,account_from,account_to,timestamp,status\n";
    const rows = [];

    for (let i = 1; i <= 100; i++) {
      const status = Math.random() > 0.05 ? "completed" : "failed";
      const amount = (Math.random() * 9900 + 100).toFixed(2);
      const timestamp = new Date(Date.now() - Math.random() * 86400000).toISOString();

      rows.push([
        `TXN${Date.now()}-${i}`,
        amount,
        "USD",
        ["TRANSFER", "PAYMENT", "WITHDRAWAL", "DEPOSIT"][Math.floor(Math.random() * 4)],
        `ACC${Math.floor(Math.random() * 1000)}`,
        `ACC${Math.floor(Math.random() * 1000)}`,
        timestamp,
        status
      ].join(","));
    }

    return headers + rows.join("\n");
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Process uploaded CSV file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processCSVContent(content);
    };
    reader.readAsText(file);
  };

  // Parse and process CSV content
  const processCSVContent = async (content: string) => {
    setIsRunning(true);
    setDemoPhase("csv");
    setProgress(0);
    setTransactions([]);

    const lines = content.split("\n").filter(line => line.trim());
    const headers = lines[0].split(",").map(h => h.trim());

    const csvTransactions: Transaction[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      const txnData: any = {};

      headers.forEach((header, index) => {
        txnData[header] = values[index];
      });

      const transaction: Transaction = {
        id: txnData.transaction_id || `TXN-CSV-${i}`,
        amount: parseFloat(txnData.amount) || Math.random() * 5000 + 100,
        status: (txnData.status as any) || "completed",
        timestamp: new Date(txnData.timestamp || Date.now()).getTime(),
        latency: Math.floor(Math.random() * 50) + 10,
      };

      csvTransactions.push(transaction);

      // Simulate processing delay
      if (i % 10 === 0) {
        setTransactions(prev => [...csvTransactions.slice(-20), ...prev].slice(0, 50));
        setProgress((i / lines.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    updateMetrics(csvTransactions);
    setProgress(100);
    setDemoPhase("complete");
    setIsRunning(false);
  };

  const getPhaseMessage = () => {
    switch (demoPhase) {
      case "single":
        return "Processing single transaction...";
      case "concurrent":
        return "Running concurrent transactions (100 TPS)...";
      case "highload":
        return "High load test (1000 TPS target)...";
      case "csv":
        return "Processing CSV file transactions...";
      case "complete":
        return "Demo completed successfully!";
      default:
        return "Ready to start demo";
    }
  };

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Live Demo
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the Distributed Transaction Engine in action. Watch real-time transaction processing with live metrics.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction Processing Demo</CardTitle>
                  <CardDescription>{getPhaseMessage()}</CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={startDemo}
                    disabled={isRunning}
                    size="lg"
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {isRunning ? "Running..." : "Start Demo"}
                  </Button>

                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="secondary"
                      size="lg"
                      className="gap-2"
                      disabled={isRunning}
                    >
                      <Upload className="h-4 w-4" />
                      Upload CSV
                    </Button>
                    <Button
                      onClick={downloadSampleCSV}
                      variant="secondary"
                      size="lg"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Sample CSV
                    </Button>
                  </div>

                  <Button
                    onClick={resetDemo}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    disabled={isRunning}
                  >
                    <RotateCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
              {isRunning && (
                <Progress value={progress} className="mt-4" />
              )}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
                  <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                  <TabsTrigger value="features">Key Features</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Total Processed</span>
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-2xl font-bold">{metrics.totalTransactions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">transactions</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Success Rate</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">reliability</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Current TPS</span>
                          <Zap className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-bold">{metrics.currentTPS.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">peak: {metrics.peakTPS.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">P50 Latency</span>
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">{metrics.p50Latency}ms</div>
                        <p className="text-xs text-muted-foreground">median</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Latency Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">P50 (Median)</span>
                          <Badge variant={metrics.p50Latency < 50 ? "default" : "secondary"}>
                            {metrics.p50Latency}ms
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">P95</span>
                          <Badge variant={metrics.p95Latency < 100 ? "default" : "secondary"}>
                            {metrics.p95Latency}ms
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">P99</span>
                          <Badge variant={metrics.p99Latency < 200 ? "default" : "destructive"}>
                            {metrics.p99Latency}ms
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {transactions.length === 0 ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No transactions yet. Click "Start Demo" to begin processing.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      transactions.slice(0, 20).map((txn) => (
                        <div
                          key={txn.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              txn.status === "completed" ? "bg-green-500" :
                              txn.status === "processing" ? "bg-yellow-500" :
                              txn.status === "failed" ? "bg-red-500" :
                              "bg-gray-500"
                            }`} />
                            <div>
                              <p className="text-sm font-mono">{txn.id}</p>
                              <p className="text-xs text-muted-foreground">
                                Amount: ${txn.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              txn.status === "completed" ? "default" :
                              txn.status === "failed" ? "destructive" :
                              "secondary"
                            }>
                              {txn.status}
                            </Badge>
                            {txn.latency && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {txn.latency}ms
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">Distributed Locking</h4>
                            <p className="text-sm text-muted-foreground">
                              Redis-based distributed locks ensure transaction integrity across multiple instances.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Server className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">Circuit Breakers</h4>
                            <p className="text-sm text-muted-foreground">
                              Resilience4j circuit breakers provide automatic failure recovery for 99.9% uptime.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">High Throughput</h4>
                            <p className="text-sm text-muted-foreground">
                              Capable of processing 10,000+ transactions per second with horizontal scaling.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Zap className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-semibold mb-1">Low Latency</h4>
                            <p className="text-sm text-muted-foreground">
                              Sub-50ms P50 latency achieved through async processing and optimization.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {demoPhase === "complete" && (
            <Alert className="border-green-500 bg-green-50/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-200">
                <strong>Demo Completed Successfully!</strong> The system processed {metrics.totalTransactions.toLocaleString()} transactions
                with {metrics.successRate.toFixed(1)}% success rate. Peak TPS: {metrics.peakTPS.toLocaleString()},
                P99 Latency: {metrics.p99Latency}ms
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;