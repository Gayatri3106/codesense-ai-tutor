import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Trash2, Upload, FileText, Timer, Lightbulb, Loader2, HardDrive, Search } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import AIChatPanel from "@/components/AIChatPanel";

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

interface AnalysisResults {
  summary: string;
  steps: string[];
  timeComplexity: { best: string; average: string; worst: string; bestExpl: string; avgExpl: string; worstExpl: string };
  spaceComplexity: { value: string; explanation: string };
  suggestions: string[];
}

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

      // Summary
      let summary = `This program defines a class \`${className}\``;
      if (code.includes("main(")) summary += " with a main method as the entry point";
      if (hasLoop) summary += ". It uses loop constructs for iterative processing";
      if (hasNestedLoop) summary += " including nested loops";
      if (hasRecursion) summary += ". It employs recursion";
      if (hasArray) summary += ". Array/list data structures are used for storing data";
      summary += ".";

      // Steps
      const steps: string[] = [];
      if (code.includes("main(")) steps.push("Program execution begins in the main() method.");
      if (hasArray) steps.push("Variables and data structures (arrays/lists) are initialized.");
      if (hasLoop) steps.push("Loop iterates through elements for processing.");
      if (hasNestedLoop) steps.push("Inner loop performs comparisons or nested operations.");
      if (code.includes("if")) steps.push("Conditional statements evaluate expressions and branch logic.");
      if (hasRecursion) steps.push("Recursive calls are made until the base case is reached.");
      if (code.includes("System.out")) steps.push("Results are printed to the console via System.out.");
      if (steps.length === 0) steps.push("Code structure analyzed. Basic operations are performed sequentially.");

      // Time complexity
      let best = "O(1)", avg = "O(n)", worst = "O(n²)";
      let bestExpl = "Occurs when the required element is found immediately or no processing is needed.";
      let avgExpl = "Occurs when the algorithm scans about half of the data on average.";
      let worstExpl = "Occurs when the algorithm must process the entire dataset with maximum comparisons.";

      if (hasNestedLoop) {
        best = "O(n)"; avg = "O(n²)"; worst = "O(n²)";
        bestExpl = "Occurs when the data is already sorted and minimal swaps are needed.";
        avgExpl = "Occurs when elements are in random order requiring quadratic comparisons.";
        worstExpl = "Occurs when the data is in reverse order, requiring maximum swaps.";
      } else if (hasRecursion) {
        best = "O(n)"; avg = "O(n log n)"; worst = "O(2ⁿ)";
        bestExpl = "Occurs with optimal recursive partitioning.";
        avgExpl = "Balanced recursive calls result in logarithmic depth.";
        worstExpl = "Unbalanced recursion leads to exponential branching.";
      } else if (!hasLoop) {
        best = "O(1)"; avg = "O(1)"; worst = "O(1)";
        bestExpl = "Constant time — no loops or recursion detected.";
        avgExpl = "Constant time — fixed number of operations.";
        worstExpl = "Constant time — independent of input size.";
      }

      // Space complexity
      let spaceVal = "O(1)", spaceExpl = "Only primitive variables are used; no additional memory scales with input.";
      if (hasArray) { spaceVal = "O(n)"; spaceExpl = "Additional memory is used to store the array or collection data structure."; }
      if (hasRecursion) { spaceVal = "O(n)"; spaceExpl = "The recursion stack grows proportionally to the depth of recursive calls."; }

      // Suggestions
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
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">AI Java Code Analyzer</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Paste or upload Java code and get a full AI-powered explanation including logic, step-by-step breakdown, and complexity analysis.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Left: Editor */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={analyzeCode}
                disabled={!code.trim() || analyzing}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {analyzing ? "Analyzing..." : "Analyze Code"}
              </button>
              <button
                onClick={() => { setCode(""); setResults(null); }}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" /> Clear Code
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Upload className="h-4 w-4" /> Upload File
              </button>
              <button
                onClick={() => { setCode(sampleCode); setResults(null); }}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Load Example
              </button>
              <input ref={fileInputRef} type="file" accept=".java,.txt" className="hidden" onChange={handleUpload} />
            </div>

            <CodeEditor value={code} onChange={setCode} placeholder="Paste your Java code here..." minHeight="400px" />
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {results ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Summary */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Search className="h-4 w-4 text-primary" /> Code Summary
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{results.summary}</p>
                </div>

                {/* Steps */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-primary" /> Step-by-Step Explanation
                  </div>
                  <ol className="space-y-2.5 text-sm">
                    {results.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Time Complexity */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Timer className="h-4 w-4 text-primary" /> Time Complexity Analysis
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Best Case", value: results.timeComplexity.best, expl: results.timeComplexity.bestExpl },
                      { label: "Average Case", value: results.timeComplexity.average, expl: results.timeComplexity.avgExpl },
                      { label: "Worst Case", value: results.timeComplexity.worst, expl: results.timeComplexity.worstExpl },
                    ].map((c) => (
                      <div key={c.label} className="rounded-lg border bg-muted/40 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
                          <span className="font-mono text-sm font-bold text-primary">{c.value}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{c.expl}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Space Complexity */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <HardDrive className="h-4 w-4 text-accent" /> Space Complexity
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Space Complexity</span>
                      <span className="font-mono text-sm font-bold text-accent">{results.spaceComplexity.value}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{results.spaceComplexity.explanation}</p>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="h-4 w-4 text-warning" /> Optimization Suggestions
                  </div>
                  <ul className="space-y-2 text-sm">
                    {results.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border bg-muted/20">
                <div className="text-center text-sm text-muted-foreground">
                  <Search className="mx-auto mb-2 h-10 w-10 opacity-30" />
                  <p className="font-medium">No analysis yet</p>
                  <p className="text-xs">Paste code and click "Analyze Code" to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat below */}
        <div className="mt-8">
          <AIChatPanel context={code} />
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
