import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trash2, Upload, FileText, Timer, Lightbulb, Loader2, HardDrive, Search, Code2, ChevronDown, Variable, Repeat, GitBranch, BookOpen, Cpu } from "lucide-react";
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
      const hasRecursion = /(\w+)\s*\(.*\)[\s\S]*?\1\s*\(/.test(code);
      const className = code.match(/class\s+(\w+)/)?.[1] || "Program";
      const lines = code.split("\n");

      // Summary
      let summary = `This program defines a class \`${className}\``;
      if (code.includes("main(")) summary += " with a main method as the entry point";
      if (hasLoop) summary += ". It uses loop constructs for iterative processing";
      if (hasNestedLoop) summary += " including nested loops";
      if (hasRecursion) summary += ". It employs recursion";
      if (hasArray) summary += ". Array/list data structures are used for storing data";
      summary += ".";

      // Methods
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
            details: `Accepts parameters: ${params || "none"}. Called from other methods to perform a focused task, improving code readability and maintainability.`,
          });
        }
      });

      // Variables
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
          else if (m[2] === "sum" || m[2] === "total" || m[2] === "count") role = "Accumulator that aggregates values during iteration";
          else if (m[2] === "result" || m[2] === "res" || m[2] === "ans") role = "Stores the final computed result";
          else if (m[1].includes("[]")) role = "Array storing multiple elements for indexed access";
          else if (m[2] === "arr" || m[2] === "array" || m[2] === "nums") role = "Primary data collection being processed";
          variables.push({ name: m[2], type: m[1], role });
        }
      }

      // Loops
      const loops: LoopInfo[] = [];
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.match(/^\s*for\s*\(/)) {
          const forMatch = trimmed.match(/for\s*\(\s*(.+?)\s*;\s*(.+?)\s*;\s*(.+?)\s*\)/);
          if (forMatch) {
            loops.push({
              type: "for",
              line: idx + 1,
              description: `For loop at line ${idx + 1}: initializes ${forMatch[1]}, continues while ${forMatch[2]}, updates with ${forMatch[3]}.`,
              iterationLogic: `Starts at ${forMatch[1]}, checks condition ${forMatch[2]} before each iteration, then executes ${forMatch[3]} after each pass.`,
            });
          } else if (trimmed.includes(":")) {
            loops.push({
              type: "for-each",
              line: idx + 1,
              description: `Enhanced for-each loop at line ${idx + 1} iterates over each element in the collection.`,
              iterationLogic: "Automatically retrieves each element sequentially — no index management needed.",
            });
          }
        } else if (trimmed.match(/^\s*while\s*\(/)) {
          loops.push({
            type: "while",
            line: idx + 1,
            description: `While loop at line ${idx + 1}: continues executing as long as the condition remains true.`,
            iterationLogic: "Evaluates condition before each iteration. If false initially, the loop body never executes.",
          });
        } else if (trimmed.match(/^\s*do\s*\{/)) {
          loops.push({
            type: "do-while",
            line: idx + 1,
            description: `Do-while loop at line ${idx + 1}: executes the body at least once before checking the condition.`,
            iterationLogic: "Body runs first, then condition is checked. Guarantees at least one execution.",
          });
        }
      });

      // Flow summary
      const flowSummary: string[] = [];
      flowSummary.push(`Execution starts at the main() method of the ${className} class.`);
      if (variables.length > 0) flowSummary.push(`${variables.length} variable(s) are declared and initialized for use throughout the program.`);
      if (methods.length > 1) flowSummary.push(`The main method delegates work to ${methods.length - 1} helper method(s) for modularity.`);
      if (loops.length > 0) flowSummary.push(`${loops.length} loop(s) perform iterative processing over data.`);
      if (hasNestedLoop) flowSummary.push("Nested loops create a quadratic relationship — inner loop runs fully for each outer loop iteration.");
      if (code.includes("if")) flowSummary.push("Conditional branches guide execution flow based on runtime values.");
      if (hasRecursion) flowSummary.push("Recursive calls break the problem into smaller sub-problems until a base case is reached.");
      if (code.includes("System.out")) flowSummary.push("Final results are printed to the console via System.out.");

      // Legacy steps (kept for compatibility)
      const steps: string[] = [];
      if (code.includes("main(")) steps.push("Program execution begins in the main() method — this is the entry point of any Java application.");
      const varDecls = code.match(/(int|double|float|long|String|char|boolean)\s+\w+/g);
      if (varDecls && varDecls.length > 0) steps.push(`Variables are declared and initialized (${varDecls.slice(0, 3).join(", ")}${varDecls.length > 3 ? ", ..." : ""}).`);
      if (hasArray) steps.push("An array or collection is created to store multiple elements.");
      if (hasLoop && !hasNestedLoop) steps.push("A loop iterates through elements sequentially — O(n) behavior.");
      if (hasNestedLoop) steps.push("Nested loops create quadratic O(n²) processing.");
      if (code.includes("if")) steps.push("Conditional statements enable decision-making logic.");
      if (hasRecursion) steps.push("Recursive method calls break the problem into sub-problems.");
      if (code.includes("System.out")) steps.push("Results are printed to the console.");
      if (steps.length === 0) steps.push("The code performs sequential operations without loops or recursion.");

      // Time complexity (same logic as before)
      let best = "O(1)", avg = "O(n)", worst = "O(n²)";
      let bestExpl = "Occurs when the required element is found immediately or no processing is needed. The algorithm performs a constant number of operations regardless of input.";
      let avgExpl = "On average, the algorithm processes roughly half the input before completing. With n elements, it performs approximately n/2 comparisons, simplifying to O(n).";
      let worstExpl = "Every element must be compared against every other element. With n elements, this produces n × (n-1)/2 comparisons, growing quadratically.";

      if (hasNestedLoop) {
        best = "O(n)"; avg = "O(n²)"; worst = "O(n²)";
        bestExpl = "Best case O(n) occurs when the data is already sorted. The outer loop runs n times but the inner loop detects no swaps are needed and can terminate early.";
        avgExpl = "On average, elements are in random order. The outer loop runs n times and the inner loop runs ~n/2 times per iteration, resulting in approximately n²/2 total comparisons — O(n²).";
        worstExpl = "Worst case O(n²) occurs when data is in reverse sorted order. Every comparison and swap must be performed — outer loop runs n-1 times, inner loop runs (n-1), (n-2)... 1 times.";
      } else if (hasRecursion) {
        best = "O(n)"; avg = "O(n log n)"; worst = "O(2ⁿ)";
        bestExpl = "Best case O(n) occurs when each recursive call processes data optimally — e.g., in divide-and-conquer where the pivot always splits the array in half.";
        avgExpl = "Average case O(n log n) occurs when recursive calls divide the problem roughly in half. Work at each level is O(n) with log₂(n) levels.";
        worstExpl = "Worst case O(2ⁿ) occurs with unoptimized recursion where each call branches into two sub-calls without memoization, creating an exponential tree.";
      } else if (!hasLoop) {
        best = "O(1)"; avg = "O(1)"; worst = "O(1)";
        bestExpl = "Constant time — no loops or recursion. A fixed number of operations regardless of input size.";
        avgExpl = "Constant time — every execution path performs the same fixed number of operations.";
        worstExpl = "Constant time — even in the worst case, operations are bounded by a constant. Ideal for lookup operations.";
      }

      let spaceVal = "O(1)", spaceExpl = "Constant space — only a fixed number of primitive variables are used. No additional data structures grow with input. This is 'in-place' processing.";
      if (hasArray) {
        spaceVal = "O(n)";
        spaceExpl = "Linear space — an array or collection stores n elements proportional to input size. Each element occupies memory, so total usage grows linearly.";
      }
      if (hasRecursion) {
        spaceVal = "O(n)";
        spaceExpl = "Linear space — each recursive call adds a stack frame. With recursion depth n, this means O(n) stack space. Deep recursion risks StackOverflowError.";
      }

      const suggestions: string[] = [];
      if (hasNestedLoop) {
        suggestions.push("Use HashMap instead of nested loops to reduce time complexity from O(n²) to O(n).");
        suggestions.push("Reduce redundant calculations by caching intermediate results.");
      }
      if (hasRecursion) suggestions.push("Consider using memoization or dynamic programming to avoid redundant computations.");
      suggestions.push("Use efficient data structures like TreeSet or PriorityQueue where applicable.");
      if (!code.includes("try") && !code.includes("catch")) suggestions.push("Add try-catch blocks for robust error handling.");
      if (code.length > 500) suggestions.push("Break the code into smaller methods for better readability and testability.");

      setResults({
        summary,
        methods,
        variables,
        loops,
        flowSummary,
        steps,
        timeComplexity: { best, average: avg, worst, bestExpl, avgExpl, worstExpl },
        spaceComplexity: { value: spaceVal, explanation: spaceExpl },
        suggestions,
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            AI Analysis Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">AI Java Code Analyzer</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Paste or upload Java code and get a full AI-powered explanation including logic, step-by-step breakdown, and complexity analysis.
          </p>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Left: Editor */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={analyzeCode}
                disabled={!code.trim() || analyzing}
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-all duration-200 hover:bg-primary/90 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {analyzing ? "Analyzing..." : "Analyze Code"}
              </button>
              <button
                onClick={() => { setCode(""); setResults(null); }}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
              >
                <Trash2 className="h-4 w-4" /> Clear
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
              >
                <Upload className="h-4 w-4" /> Upload
              </button>
              <button
                onClick={() => { setCode(sampleCode); setResults(null); }}
                className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/10 hover:-translate-y-0.5"
              >
                <Code2 className="h-4 w-4" /> Load Example
              </button>
              <input ref={fileInputRef} type="file" accept=".java,.txt" className="hidden" onChange={handleUpload} />
            </div>

            <div className="overflow-hidden rounded-2xl shadow-elevated">
              <CodeEditor value={code} onChange={setCode} placeholder="Paste your Java code here..." minHeight="450px" />
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  <Accordion type="multiple" defaultValue={["overview", "methods", "variables", "loops", "flow", "time", "space", "suggestions"]} className="space-y-3">
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

                    {/* Main Method & Methods */}
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
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                              >
                                <div className="font-mono text-xs font-bold text-primary mb-1">{method.name}</div>
                                <p className="text-sm font-medium text-foreground/80 mb-1">{method.purpose}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{method.details}</p>
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
                            Variables Used ({results.variables.length})
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
                                  <motion.tr
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="border-b border-muted/50 last:border-0"
                                  >
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

                    {/* Loops & Control Structures */}
                    {results.loops.length > 0 && (
                      <AccordionItem value="loops" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                          <div className="flex items-center gap-2.5 text-sm font-semibold">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                              <Repeat className="h-4 w-4 text-warning" />
                            </div>
                            Loops & Control Structures ({results.loops.length})
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5">
                          <div className="space-y-3">
                            {results.loops.map((loop, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="rounded-md bg-warning/10 px-2 py-0.5 font-mono text-[11px] font-bold text-warning uppercase">{loop.type}</span>
                                  <span className="text-xs text-muted-foreground">Line {loop.line}</span>
                                </div>
                                <p className="text-sm text-foreground/80 mb-1">{loop.description}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed italic">↻ {loop.iterationLogic}</p>
                              </motion.div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Logical Flow Summary */}
                    <AccordionItem value="flow" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-2.5 text-sm font-semibold">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                            <GitBranch className="h-4 w-4 text-primary" />
                          </div>
                          Logical Flow Summary
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5">
                        <ol className="space-y-2.5 text-sm">
                          {results.flowSummary.map((step, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className="flex gap-3 rounded-xl border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                                {i + 1}
                              </span>
                              <span className="text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                            </motion.li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Time Complexity */}
                    <AccordionItem value="time" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-2.5 text-sm font-semibold">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                            <Timer className="h-4 w-4 text-primary" />
                          </div>
                          Time Complexity Analysis
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5">
                        <div className="space-y-3">
                          <ComplexityBar
                            label="Best Case"
                            value={results.timeComplexity.best}
                            explanation={results.timeComplexity.bestExpl}
                            color="success"
                            percentage={complexityToPercent[results.timeComplexity.best] || 50}
                            delay={0}
                          />
                          <ComplexityBar
                            label="Average Case"
                            value={results.timeComplexity.average}
                            explanation={results.timeComplexity.avgExpl}
                            color="warning"
                            percentage={complexityToPercent[results.timeComplexity.average] || 50}
                            delay={0.1}
                          />
                          <ComplexityBar
                            label="Worst Case"
                            value={results.timeComplexity.worst}
                            explanation={results.timeComplexity.worstExpl}
                            color="destructive"
                            percentage={complexityToPercent[results.timeComplexity.worst] || 50}
                            delay={0.2}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Space Complexity */}
                    <AccordionItem value="space" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-2.5 text-sm font-semibold">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                            <HardDrive className="h-4 w-4 text-accent" />
                          </div>
                          Space Complexity
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5">
                        <ComplexityBar
                          label="Space Complexity"
                          value={results.spaceComplexity.value}
                          explanation={results.spaceComplexity.explanation}
                          color="accent"
                          percentage={complexityToPercent[results.spaceComplexity.value] || 30}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    {/* Suggestions */}
                    <AccordionItem value="suggestions" className="rounded-2xl border bg-card shadow-card overflow-hidden">
                      <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-2.5 text-sm font-semibold">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                            <Lightbulb className="h-4 w-4 text-warning" />
                          </div>
                          Optimization Suggestions ({results.suggestions.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5">
                        <ul className="space-y-2.5 text-sm">
                          {results.suggestions.map((s, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex gap-3 rounded-xl border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                            >
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
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-[500px] items-center justify-center rounded-2xl border border-dashed bg-muted/10"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                      <Search className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <p className="font-medium text-muted-foreground">No analysis yet</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">Paste code and click "Analyze Code" to begin</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* AI Chat below */}
        <div className="mt-10">
          <AIChatPanel context={code} />
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
