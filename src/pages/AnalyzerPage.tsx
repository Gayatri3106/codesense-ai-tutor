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

      // Steps — detailed line-by-line style
      const steps: string[] = [];
      if (code.includes("main(")) steps.push("Program execution begins in the main() method — this is the entry point of any Java application. The JVM calls this method first when the program starts.");
      
      // Detect variable declarations
      const varDecls = code.match(/(int|double|float|long|String|char|boolean)\s+\w+/g);
      if (varDecls && varDecls.length > 0) {
        steps.push(`Variables are declared and initialized (${varDecls.slice(0, 3).join(", ")}${varDecls.length > 3 ? ", ..." : ""}). Memory is allocated on the stack for primitive types and on the heap for objects.`);
      }
      if (hasArray) steps.push("An array or collection data structure is created to store multiple elements. Arrays provide O(1) random access by index but have a fixed size after creation.");
      
      // Detect method definitions
      const methods = code.match(/\b(public|private|protected|static)\s+\w+\s+(\w+)\s*\(/g);
      if (methods && methods.length > 1) {
        steps.push(`Multiple methods are defined (${methods.length} found). The program is modularized into separate functions, each responsible for a specific task.`);
      }

      if (hasLoop && !hasNestedLoop) steps.push("A loop iterates through the elements sequentially. Each element is visited exactly once, performing a constant amount of work per iteration — this results in linear O(n) behavior.");
      if (hasNestedLoop) {
        steps.push("An outer loop iterates through each element of the dataset. For each iteration of the outer loop, the inner loop runs through remaining elements — this creates a quadratic relationship where total operations ≈ n × n.");
        if (code.includes("swap") || code.includes("temp")) {
          steps.push("Inside the inner loop, elements are compared and swapped if they are out of order. A temporary variable holds one value during the exchange to prevent data loss.");
        }
      }
      if (code.includes("if")) steps.push("Conditional statements (if/else) evaluate boolean expressions to determine which branch of code executes. This enables decision-making logic within the program.");
      if (code.includes("switch")) steps.push("A switch statement is used to select one of many code blocks to execute based on the value of a variable, providing cleaner multi-branch logic than chained if-else statements.");
      if (hasRecursion) steps.push("The method calls itself recursively, breaking the problem into smaller sub-problems. Each recursive call adds a new frame to the call stack until a base case is reached, then results are returned back up the chain.");
      if (code.includes("return")) steps.push("A return statement sends a value back to the calling method and terminates the current method execution.");
      if (code.includes("System.out")) steps.push("Results are printed to the console using System.out. The print/println methods convert values to strings and write them to the standard output stream.");
      if (steps.length === 0) steps.push("The code performs sequential operations without loops or recursion. Each statement executes exactly once from top to bottom.");

      // Time complexity — detailed explanations
      let best = "O(1)", avg = "O(n)", worst = "O(n²)";
      let bestExpl = "Occurs when the required element is found immediately or no processing is needed. The algorithm performs a constant number of operations regardless of input — for example, checking only the first element.";
      let avgExpl = "On average, the algorithm processes roughly half the input before completing. With n elements, it performs approximately n/2 comparisons, which simplifies to O(n) in Big-O notation since constants are dropped.";
      let worstExpl = "Every element must be compared against every other element. With n elements, this produces n × (n-1)/2 comparisons, which grows quadratically — doubling the input size quadruples the execution time.";

      if (hasNestedLoop) {
        best = "O(n)"; avg = "O(n²)"; worst = "O(n²)";
        bestExpl = "Best case O(n) occurs when the data is already in the desired order. The outer loop still runs n times, but the inner loop detects no swaps are needed and can terminate early (with an optimization flag). Only n comparisons are made.";
        avgExpl = "On average, elements are in random order. The outer loop runs n times and the inner loop runs ~n/2 times per iteration, resulting in approximately n²/2 total comparisons. In Big-O notation, constants are dropped, giving O(n²). For 1,000 elements, this means ~500,000 operations.";
        worstExpl = "Worst case O(n²) occurs when data is in reverse sorted order. Every possible comparison and swap must be performed — the outer loop runs n-1 times and the inner loop runs (n-1), (n-2), ... 1 times respectively, totaling n(n-1)/2 operations. For 10,000 elements, this means ~50 million operations.";
      } else if (hasRecursion) {
        best = "O(n)"; avg = "O(n log n)"; worst = "O(2ⁿ)";
        bestExpl = "Best case O(n) occurs when each recursive call processes the data optimally — for example, in a divide-and-conquer algorithm where the pivot always splits the array in half, requiring only n operations at each level with log(n) levels.";
        avgExpl = "Average case O(n log n) occurs when recursive calls divide the problem roughly in half each time. The work at each recursion level is O(n), and there are log₂(n) levels. For 1,000 elements: 1000 × 10 ≈ 10,000 operations — much better than O(n²).";
        worstExpl = "Worst case O(2ⁿ) occurs with unoptimized recursion where each call branches into two sub-calls without memoization. This creates an exponential tree — for n=30, this means over 1 billion operations. This is why memoization or dynamic programming is critical.";
      } else if (!hasLoop) {
        best = "O(1)"; avg = "O(1)"; worst = "O(1)";
        bestExpl = "Constant time O(1) — no loops or recursion detected. The algorithm performs a fixed number of operations (assignments, arithmetic, comparisons) regardless of input size. Whether the input has 10 or 10 million elements, the execution time remains the same.";
        avgExpl = "Constant time O(1) — every execution path performs the same fixed number of operations. There are no data-dependent iterations, so performance is completely predictable and independent of input size.";
        worstExpl = "Constant time O(1) — even in the worst case, the number of operations is bounded by a constant. This is the most efficient time complexity possible and is ideal for lookup operations like accessing an array by index or a HashMap by key.";
      }

      // Space complexity — detailed
      let spaceVal = "O(1)", spaceExpl = "Constant space O(1) — only a fixed number of primitive variables (int, boolean, etc.) are used regardless of input size. No additional data structures grow with the input. The memory footprint remains the same whether processing 10 or 10 million elements. This is also called 'in-place' processing.";
      if (hasArray) { 
        spaceVal = "O(n)"; 
        spaceExpl = "Linear space O(n) — an array or collection is used that stores n elements, where n is proportional to the input size. Each element occupies memory (4 bytes for int, 8 bytes for double), so total memory usage grows linearly. For example, an int array of 1,000 elements uses ~4KB of heap memory. If additional temporary arrays are created, the space multiplier increases but remains O(n)."; 
      }
      if (hasRecursion) { 
        spaceVal = "O(n)"; 
        spaceExpl = "Linear space O(n) — each recursive call adds a new stack frame to the call stack, consuming memory for local variables, parameters, and the return address (~50-100 bytes per frame). With a recursion depth of n, this means O(n) stack space. Deep recursion (n > ~10,000) risks a StackOverflowError in Java. Tail-call optimization is NOT supported in Java, so iterative alternatives should be considered for large inputs."; 
      }

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
