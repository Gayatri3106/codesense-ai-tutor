import { useState } from "react";
import { motion } from "framer-motion";
import { Play, FileText, Timer, Lightbulb, Loader2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
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

const AnalyzerPage = () => {
  const [code, setCode] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    explanation: string[];
    complexity: { time: string; space: string };
    suggestions: string[];
  } | null>(null);

  const analyzeCode = () => {
    if (!code.trim()) return;
    setAnalyzing(true);
    setResults(null);

    // Simulated analysis
    setTimeout(() => {
      const hasLoop = code.includes("for") || code.includes("while");
      const hasNestedLoop = (code.match(/for/g) || []).length >= 2 || (code.match(/while/g) || []).length >= 2;
      const hasArray = code.includes("[]") || code.includes("ArrayList");
      const hasRecursion = /(\w+)\s*\(.*\)[\s\S]*?\1\s*\(/.test(code);

      const explanation: string[] = [];
      if (code.includes("class ")) {
        const className = code.match(/class\s+(\w+)/)?.[1] || "Unknown";
        explanation.push(`Defines a class named \`${className}\`.`);
      }
      if (code.includes("main(")) {
        explanation.push("Contains the `main` method — the program's entry point.");
      }
      if (hasArray) {
        explanation.push("Uses array or list data structures for storing collections of elements.");
      }
      if (hasLoop) {
        explanation.push("Contains loop constructs for iterative processing.");
      }
      if (hasNestedLoop) {
        explanation.push("Uses nested loops — pay attention to quadratic time complexity.");
      }
      if (hasRecursion) {
        explanation.push("Uses recursion — ensure a proper base case exists to avoid stack overflow.");
      }
      if (code.includes("System.out")) {
        explanation.push("Outputs results to the console using `System.out`.");
      }
      if (explanation.length === 0) {
        explanation.push("Code structure analyzed. No major patterns detected.");
      }

      let timeComplexity = "O(1)";
      let spaceComplexity = "O(1)";
      if (hasNestedLoop) {
        timeComplexity = "O(n²)";
      } else if (hasLoop) {
        timeComplexity = "O(n)";
      }
      if (hasRecursion) {
        timeComplexity = "O(2ⁿ) — verify with recurrence relation";
        spaceComplexity = "O(n) — recursive call stack";
      }
      if (hasArray) {
        spaceComplexity = "O(n)";
      }

      const suggestions: string[] = [];
      if (hasNestedLoop) {
        suggestions.push("Consider using a HashMap to reduce nested loop operations from O(n²) to O(n).");
        suggestions.push("If sorting is involved, try Merge Sort or Quick Sort for O(n log n) performance.");
      }
      if (!code.includes("try") && !code.includes("catch")) {
        suggestions.push("Add try-catch blocks for robust error handling.");
      }
      if (code.length > 500) {
        suggestions.push("Consider breaking the code into smaller methods for better readability.");
      }
      if (suggestions.length === 0) {
        suggestions.push("Code looks well-structured. Consider adding JavaDoc comments for documentation.");
      }

      setResults({
        explanation,
        complexity: { time: timeComplexity, space: spaceComplexity },
        suggestions,
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Code Analyzer</h1>
          <p className="text-sm text-muted-foreground">
            Paste your Java code to get step-by-step explanations and complexity analysis.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Editor + Results */}
          <div className="space-y-4 lg:col-span-2">
            <CodeEditor
              value={code}
              onChange={setCode}
              placeholder="Paste your Java code here..."
            />

            <div className="flex items-center gap-3">
              <button
                onClick={analyzeCode}
                disabled={!code.trim() || analyzing}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {analyzing ? "Analyzing..." : "Analyze Code"}
              </button>
              <button
                onClick={() => { setCode(sampleCode); setResults(null); }}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Load Example
              </button>
            </div>

            {/* Results */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <OutputPanel title="Step-by-Step Explanation" icon={<FileText className="h-4 w-4" />}>
                  <ol className="space-y-2 text-sm">
                    {results.explanation.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </OutputPanel>

                <OutputPanel title="Complexity Estimation" icon={<Timer className="h-4 w-4" />}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border bg-muted/50 p-3">
                      <div className="text-xs font-medium text-muted-foreground">Time Complexity</div>
                      <div className="mt-1 font-mono text-lg font-bold text-primary">{results.complexity.time}</div>
                    </div>
                    <div className="rounded-md border bg-muted/50 p-3">
                      <div className="text-xs font-medium text-muted-foreground">Space Complexity</div>
                      <div className="mt-1 font-mono text-lg font-bold text-accent">{results.complexity.space}</div>
                    </div>
                  </div>
                </OutputPanel>

                <OutputPanel title="Suggestions" icon={<Lightbulb className="h-4 w-4" />}>
                  <ul className="space-y-2 text-sm">
                    {results.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </OutputPanel>
              </motion.div>
            )}
          </div>

          {/* AI Chat */}
          <div className="lg:col-span-1">
            <AIChatPanel context={code} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
