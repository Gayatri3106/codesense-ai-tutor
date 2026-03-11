import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trash2, Upload, Loader2, Code2, BookOpen, Bot } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import AIChatPanel from "@/components/AIChatPanel";
import ReactMarkdown from "react-markdown";

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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const complexityToPercent: Record<string, number> = {
  "O(1)": 10, "O(log n)": 25, "O(n)": 40, "O(n log n)": 55, "O(n²)": 75, "O(2ⁿ)": 95, "O(n!)": 100,
};

function detectComplexity(code: string) {
  const hasLoop = code.includes("for") || code.includes("while");
  const hasNestedLoop = (code.match(/for/g) || []).length >= 2 || (code.match(/while/g) || []).length >= 2;
  const hasArray = code.includes("[]") || code.includes("ArrayList");
  const hasRecursion = /(\w+)\s*\((.*)[\s\S]*?\1\s*\(/.test(code);

  let best = "O(1)", avg = "O(n)", worst = "O(n²)", space = "O(1)";
  if (hasNestedLoop) { best = "O(n)"; avg = "O(n²)"; worst = "O(n²)"; }
  else if (hasRecursion) { best = "O(n)"; avg = "O(n log n)"; worst = "O(2ⁿ)"; }
  else if (!hasLoop) { best = "O(1)"; avg = "O(1)"; worst = "O(1)"; }
  if (hasArray || hasRecursion) space = "O(n)";

  return { best, avg, worst, space };
}

const AnalyzerPage = () => {
  const [code, setCode] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [complexity, setComplexity] = useState<ReturnType<typeof detectComplexity> | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target?.result as string);
      setHasAnalyzed(false);
      setAiExplanation("");
      setComplexity(null);
    };
    reader.readAsText(file);
  };

  const analyzeCode = async () => {
    if (!code.trim() || analyzing) return;
    setAnalyzing(true);
    setAiExplanation("");
    setHasAnalyzed(true);

    // Quick static complexity detection
    setComplexity(detectComplexity(code));

    // Stream AI explanation
    const prompt = `Analyze this Java code in detail. Structure your response with these sections using markdown:

## 📖 Program Overview
Brief summary of what this program does.

## 🔍 Detailed Logic Explanation
Walk through the code step-by-step. Explain the algorithm, the logic behind each key block, why certain approaches are used, and how data flows through the program. Be thorough but beginner-friendly.

## ⚙️ Methods & Their Purpose
For each method, explain what it does, its parameters, return type, and how it fits into the overall program.

## 📊 Time & Space Complexity
Analyze best, average, and worst case time complexity with Big-O notation. Explain WHY each complexity is what it is. Also cover space complexity.

## 💡 Suggestions & Improvements
Actionable tips to improve the code — performance, readability, edge cases, error handling.

Here is the code:
\`\`\`java
${code}
\`\`\``;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({ error: "Request failed" }));
        setAiExplanation(`⚠️ ${body.error || `Error ${resp.status}`}`);
        setAnalyzing(false);
        return;
      }

      if (!resp.body) {
        setAiExplanation("⚠️ No response received.");
        setAnalyzing(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setAiExplanation(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      setAiExplanation("⚠️ Failed to connect to AI. Please try again.");
    }

    setAnalyzing(false);
  };

  const complexityItems = complexity
    ? [
        { label: "Best Time", value: complexity.best, color: "success" as const },
        { label: "Avg Time", value: complexity.avg, color: "warning" as const },
        { label: "Worst Time", value: complexity.worst, color: "destructive" as const },
        { label: "Space", value: complexity.space, color: "accent" as const },
      ]
    : [];

  const colorMap = {
    success: { bar: "bg-success", text: "text-success" },
    warning: { bar: "bg-warning", text: "text-warning" },
    destructive: { bar: "bg-destructive", text: "text-destructive" },
    accent: { bar: "bg-accent", text: "text-accent" },
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
            Paste or upload Java code for AI-powered logic explanation and complexity analysis.
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
              onClick={() => { setCode(sampleCode); setHasAnalyzed(false); setAiExplanation(""); setComplexity(null); }}
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
              onClick={() => { setCode(""); setHasAnalyzed(false); setAiExplanation(""); setComplexity(null); }}
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
              {analyzing ? "Analyzing with AI..." : "Analyze Code"}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {hasAnalyzed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
            >
              {/* Complexity Boxes */}
              {complexity && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {complexityItems.map((item, i) => {
                    const c = colorMap[item.color];
                    const pct = complexityToPercent[item.value] || 50;
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
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* AI Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border bg-card shadow-card overflow-hidden"
              >
                <div className="flex items-center gap-2.5 border-b px-5 py-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                    <Bot className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm font-semibold">AI Code Explanation</span>
                  {analyzing && (
                    <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Generating...
                    </span>
                  )}
                </div>
                <div className="px-5 py-5">
                  {aiExplanation ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-pre:bg-[hsl(var(--code-bg))] prose-pre:text-[hsl(var(--code-fg))]">
                      <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is analyzing your code...</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* AI Chat */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <AIChatPanel context={code} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyzerPage;
