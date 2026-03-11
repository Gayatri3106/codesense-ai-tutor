import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trash2, Upload, FileText, Timer, Lightbulb, Loader2, HardDrive, Search, Code2, Variable, Repeat, GitBranch, BookOpen, Cpu } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import AIChatPanel from "@/components/AIChatPanel";
import ComplexityBar from "@/components/ComplexityBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const sampleCode = `public class BubbleSort {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        for (int num : arr) {
            System.out.print(num + " ");
        }
    }

    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`;

interface VariableInfo {
  name: string;
  type: string;
  role: string;
}

interface LoopInfo {
  type: string;
  line: number;
  description: string;
  iterationLogic: string;
}

interface MethodInfo {
  name: string;
  purpose: string;
  details: string;
}

interface AnalysisResults {
  summary: string;
  methods: MethodInfo[];
  variables: VariableInfo[];
  loops: LoopInfo[];
  flowSummary: string[];
  steps: string[];
  timeComplexity: { best: string; average: string; worst: string; bestExpl: string; avgExpl: string; worstExpl: string };
  spaceComplexity: { value: string; explanation: string };
  suggestions: string[];
}

const complexityToPercent: Record<string, number> = {
  "O(1)": 10, "O(log n)": 25, "O(n)": 40, "O(n log n)": 55, "O(n²)": 75, "O(2ⁿ)": 95, "O(n!)": 100,
};

const AnalyzerPage = () => {
  const [code, setCode] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target?.result as string);
      setResults(null);
    };
    reader.readAsText(file);
  };

  const analyzeCode = () => {
    if (!code.trim()) return;
    setAnalyzing(true);
    setResults(null);

    setTimeout(() => {
      const hasLoop = code.includes("for") || code.includes("while");
      const hasNestedLoop = (code.match(/for/g) || []).length >= 2 || (code.match(/while/g) || []).length >= 2;
      const hasArray = code.includes("[]") || code.includes("ArrayList");
      const hasRecursion = /(\w+)\s*\((.*)[\s\S]*?\1\s*\(/ .test(code);
      const className = code.match(/class\s+(\w+)/)?.[1] || "Program";
      const lines = code.split("\n");

      let summary = `This program defines a class \`${className}\``;
      if (code.includes("main(")) summary += " with a main method as the entry point";
      if (hasLoop) summary += ". It uses loop constructs for iterative processing";
      if (hasNestedLoop) summary += " including nested loops";
      if (hasRecursion) summary += ". It employs recursion";
      if (hasArray) summary += ". Array/list data structures are used for storing data";
      summary += ".";

      const methods: MethodInfo[] = [];
      if (code.includes("main(")) {
        methods.push({
          name: "main(String[] args)",
          purpose: "Entry point of the Java application — the JVM calls this method first when the program starts.",
          details: "This is a public static method required by the JVM. It initializes the program, sets up data, and orchestrates calls to other methods.",
        });
      }
      const methodMatches = [...code.matchAll(/\b(?:public|private|protected|static)\s+(?:static\s+)?(\w+)\s+(\w+)\s*\(([^)]*)\)/g)];
      methodMatches.forEach(m => {
        if (m[2] !== "main") {
          const params = m[3] ? m[3].trim() : "none";
          methods.push({
            name: `${m[2]}(${params})`,
            purpose: `Returns ${m[1]}. Encapsulates specific logic for modular, reusable code.`,
            details: `Accepts parameters: ${params || "none"}. Called from other methods to perform a focused task.`,
          });
        }
      });

      const variables: VariableInfo[] = [];
      const varRegex = /(int|double|float|long|String|char|boolean|int\[\]|double\[\]|String\[\])\s+(\w+)\s*[=;,)]/g;
      const seen = new Set<string>();
      let m;
      while ((m = varRegex.exec(code)) !== null) {
        if (!seen.has(m[2])) {
          seen.add(m[2]);
          let role = "Stores a value used in program logic";
          if (m[2] === "temp" || m[2] === "tmp") role = "Temporary variable used for swapping values";
          else if (m[2] === "i" || m[2] === "j" || m[2] === "k") role = "Loop counter controlling iteration";
          else if (m[2] === "n" || m[2] === "len" || m[2] === "length" || m[2] === "size") role = "Stores the size/length of a data structure";
          else if (m[2] === "sum" || m[2] === "total" || m[2] === "count") role = "Accumulator that aggregates values";
          else if (m[2] === "result" || m[2] === "res" || m[2] === "ans") role = "Stores the final computed result";
          else if (m[1].includes("[]")) role = "Array storing multiple elements";
          else if (m[2] === "arr" || m[2] === "array" || m[2] === "nums") role = "Primary data collection being processed";
          variables.push({ name: m[2], type: m[1], role });
        }
      }

      const loops: LoopInfo[] = [];
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.match(/^\s*for\s*\(/)) {
          const forMatch = trimmed.match(/for\s*(\s*(.+?)\s*;\s*(.+?)\s*;\s*(.+?)\s*\))/);
          if (forMatch) {
            loops.push({ type: "for", line: idx + 1, description: `For loop: initializes ${forMatch[1]}, continues while ${forMatch[2]}, updates ${forMatch[3]}.`, iterationLogic: `Starts at ${forMatch[1]}, checks ${forMatch[2]} each iteration, executes ${forMatch[3]} after each pass.` });
          } else if (trimmed.includes(":")) {
            loops.push({ type: "for-each", line: idx + 1, description: `Enhanced for-each loop iterates over each element.`, iterationLogic: "Retrieves each element sequentially." });
          }
        } else if (trimmed.match(/^\s*while\s*\(/)) {
          loops.push({ type: "while", line: idx + 1, description: `While loop continues as long as condition is true.`, iterationLogic: "Evaluates condition before each iteration." });
        } else if (trimmed.match(/^\s*do\s*\{/)) {
          loops.push({ type: "do-while", line: idx + 1, description: `Do-while loop executes body at least once.`, iterationLogic: "Body runs first, then condition checked." });
        }
      });

      const flowSummary: string[] = [];
      flowSummary.push(`Execution starts at main() of ${className}.`);
      if (variables.length > 0) flowSummary.push(`${variables.length} variable(s) declared and initialized.`);
      if (methods.length > 1) flowSummary.push(`Delegates to ${methods.length - 1} helper method(s).`);
      if (loops.length > 0) flowSummary.push(`${loops.length} loop(s) for iterative processing.`);
      if (hasNestedLoop) flowSummary.push("Nested loops create quadratic relationship.");
      if (code.includes("if")) flowSummary.push("Conditional branches guide execution flow.");
      if (hasRecursion) flowSummary.push("Recursive calls break problem into sub-problems.");
      if (code.includes("System.out")) flowSummary.push("Results printed to console.");

      const steps: string[] = [];
      if (code.includes("main(")) steps.push("Execution begins in main().");
      const varDecls = code.match(/(int|double|float|long|String|char|boolean)\s+\w+/g);
      if (varDecls && varDecls.length > 0) steps.push(`Variables declared (${varDecls.slice(0, 3).join(", ")}${varDecls.length > 3 ? ", ..." : ""}).`);
      if (hasArray) steps.push("Array/collection created.");
      if (hasLoop && !hasNestedLoop) steps.push("Loop iterates through elements — O(n).");
      if (hasNestedLoop) steps.push("Nested loops — O(n²) processing.");
      if (code.includes("if")) steps.push("Conditional statements for decision-making.");
      if (hasRecursion) steps.push("Recursive calls break problem into sub-problems.");
      if (code.includes("System.out")) steps.push("Results printed to console.");
      if (steps.length === 0) steps.push("Sequential operations without loops or recursion.");

      let best = "O(1)", avg = "O(n)", worst = "O(n²)";
      let bestExpl = "Constant operations regardless of input.";
      let avgExpl = "Processes roughly half the input on average.";
      let worstExpl = "Every element compared against every other.";

      if (hasNestedLoop) {
        best = "O(n)"; avg = "O(n²)"; worst = "O(n²)";
        bestExpl = "Data already sorted — inner loop terminates early.";
        avgExpl = "Random order — outer runs n times, inner ~n/2 per iteration.";
        worstExpl = "Reverse sorted — every comparison and swap performed.";
      } else if (hasRecursion) {
        best = "O(n)"; avg = "O(n log n)"; worst = "O(2ⁿ)";
        bestExpl = "Each recursive call processes data optimally.";
        avgExpl = "Problem divided roughly in half each call — O(n log n).";
        worstExpl = "Unoptimized recursion branches exponentially.";
      } else if (!hasLoop) {
        best = "O(1)"; avg = "O(1)"; worst = "O(1)";
        bestExpl = "No loops or recursion — constant time.";
        avgExpl = "Fixed operations regardless of input.";
        worstExpl = "Bounded by a constant even in worst case.";
      }

      let spaceVal = "O(1)", spaceExpl = "Constant space — only primitive variables used.";
      if (hasArray) { spaceVal = "O(n)"; spaceExpl = "Linear space — array stores n elements."; }
      if (hasRecursion) { spaceVal = "O(n)"; spaceExpl = "Linear space — recursive calls add stack frames."; }

      const suggestions: string[] = [];
      if (hasNestedLoop) {
        suggestions.push("Use HashMap to reduce O(n²) to O(n).");
        suggestions.push("Cache intermediate results to reduce redundant calculations.");
      }
      if (hasRecursion) suggestions.push("Consider memoization or dynamic programming.");
      suggestions.push("Use efficient data structures like TreeSet or PriorityQueue.");
      if (!code.includes("try") && !code.includes("catch")) suggestions.push("Add try-catch blocks for error handling.");
      if (code.length > 500) suggestions.push("Break code into smaller methods for readability.");

      setResults({ summary, methods, variables, loops, flowSummary, steps, timeComplexity: { best, average: avg, worst, bestExpl, avgExpl, worstExpl }, spaceComplexity: { value: spaceVal, explanation: spaceExpl }, suggestions });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            AI Analysis Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">AI Java Code Analyzer</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Paste or upload Java code for AI-powered explanation, logic breakdown, and complexity analysis.
          </p>
        </motion.div>

        {/* Code Editor Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border bg-card p-5 shadow-card"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => { setCode(sampleCode); setResults(null); }}
              className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-3 py-2 text-xs font-medium text-accent transition-all hover:bg-accent/10 hover:-translate-y-0.5"
            >
              <Code2 className="h-3.5 w-3.5" /> Load Example
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
            >
              <Upload className="h-3.5 w-3.5" /> Upload .java
            </button>
            <button
              onClick={() => { setCode(""); setResults(null); }}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
            <input ref={fileInputRef} type="file" accept=".java,.txt" className="hidden" onChange={handleUpload} />
          </div>

          <div className="overflow-hidden rounded-xl shadow-elevated">
            <CodeEditor value={code} onChange={setCode} placeholder="Paste your Java code here..." minHeight="280px" />
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={analyzeCode}
              disabled={!code.trim() || analyzing}
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition-all duration-200 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-elevated"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {analyzing ? "Analyzing..." : "Analyze Code"}
            </button>
          </div>
        </motion.div>

        {/* Analysis Results — only shown after analysis */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
            >
              {/* Complexity Overview — compact grid of boxes */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: "Best Time", value: results.timeComplexity.best, color: "success" as const, pct: complexityToPercent[results.timeComplexity.best] || 50 },
                  { label: "Avg Time", value: results.timeComplexity.average, color: "warning" as const, pct: complexityToPercent[results.timeComplexity.average] || 50 },
                  { label: "Worst Time", value: results.timeComplexity.worst, color: "destructive" as const, pct: complexityToPercent[results.timeComplexity.worst] || 50 },
                  { label: "Space", value: results.spaceComplexity.value, color: "accent" as const, pct: complexityToPercent[results.spaceComplexity.value] || 30 },
                ].map((item, i) => {
                  const colorMap = {
                    success: { bar: "bg-success", text: "text-success", bg: "bg-success/10" },
                    warning: { bar: "bg-warning", text: "text-warning", bg: "bg-warning/10" },
                    destructive: { bar: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10" },
                    accent: { bar: "bg-accent", text: "text-accent", bg: "bg-accent/10" },
                  };
                  const c = colorMap[item.color];
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-xl border bg-card p-4 shadow-card text-center"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                      <p className={`font-mono text-lg font-bold ${c.text}`}>{item.value}</p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          className={`h-full rounded-full ${c.bar}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Detailed Accordion Sections */}
              <Accordion type="multiple" defaultValue={["overview", "methods", "variables", "loops", "flow", "suggestions"]} className="space-y-3">
                {/* Program Overview */}
                <AccordionItem value="overview" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      Program Overview
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">{results.summary}</p>
                  </AccordionContent>
                </AccordionItem>

                {/* Methods */}
                {results.methods.length > 0 && (
                  <AccordionItem value="methods" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                      <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                          <Cpu className="h-4 w-4 text-primary" />
                        </div>
                        Methods ({results.methods.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="space-y-3">
                        {results.methods.map((method, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
                            <div className="font-mono text-xs font-bold text-primary mb-1">{method.name}</div>
                            <p className="text-sm text-foreground/80 mb-1">{method.purpose}</p>
                            <p className="text-xs text-muted-foreground">{method.details}</p>
                          </motion.div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Variables */}
                {results.variables.length > 0 && (
                  <AccordionItem value="variables" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                      <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                          <Variable className="h-4 w-4 text-accent" />
                        </div>
                        Variables ({results.variables.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                              <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                              <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.variables.map((v, i) => (
                              <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-muted/50 last:border-0">
                                <td className="py-2.5 pr-4 font-mono text-xs font-bold text-primary">{v.name}</td>
                                <td className="py-2.5 pr-4 font-mono text-xs text-accent">{v.type}</td>
                                <td className="py-2.5 text-xs text-muted-foreground">{v.role}</td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Loops */}
                {results.loops.length > 0 && (
                  <AccordionItem value="loops" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                      <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                          <Repeat className="h-4 w-4 text-warning" />
                        </div>
                        Loops ({results.loops.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="space-y-3">
                        {results.loops.map((loop, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="rounded-md bg-warning/10 px-2 py-0.5 font-mono text-[11px] font-bold text-warning uppercase">{loop.type}</span>
                              <span className="text-xs text-muted-foreground">Line {loop.line}</span>
                            </div>
                            <p className="text-sm text-foreground/80 mb-1">{loop.description}</p>
                            <p className="text-xs text-muted-foreground italic">↻ {loop.iterationLogic}</p>
                          </motion.div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Flow */}
                <AccordionItem value="flow" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                        <GitBranch className="h-4 w-4 text-primary" />
                      </div>
                      Logical Flow
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <ol className="space-y-2 text-sm">
                      {results.flowSummary.map((step, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-3 rounded-xl border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{i + 1}</span>
                          <span className="text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                {/* Suggestions */}
                <AccordionItem value="suggestions" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                        <Lightbulb className="h-4 w-4 text-warning" />
                      </div>
                      Suggestions ({results.suggestions.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <ul className="space-y-2 text-sm">
                      {results.suggestions.map((s, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3 rounded-xl border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning/10">
                            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                          </span>
                          <span className="text-muted-foreground leading-relaxed">{s}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chat — only shown after analysis */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-6"
          >
            <AIChatPanel context={code} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalyzerPage;
