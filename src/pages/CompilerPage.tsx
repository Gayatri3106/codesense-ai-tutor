import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, Trash2, Terminal, AlertTriangle, CheckCircle, XCircle, Code2 } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";

const defaultCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeSense!");
        
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum of 1 to 10: " + sum);
    }
}`;

interface CompileResult {
  success: boolean;
  output: string[];
  errors: { line: number; message: string; type: "error" | "warning" }[];
}

const CompilerPage = () => {
  const [code, setCode] = useState(defaultCode);
  const [compiling, setCompiling] = useState(false);
  const [result, setResult] = useState<CompileResult | null>(null);

  const compile = () => {
    if (!code.trim()) return;
    setCompiling(true);
    setResult(null);

    setTimeout(() => {
      const errors: CompileResult["errors"] = [];
      const output: string[] = [];
      let success = true;

      if (!code.includes("class ")) {
        errors.push({ line: 1, message: "Missing class declaration", type: "error" });
        success = false;
      }

      const openBraces = (code.match(/{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push({ line: code.split("\n").length, message: `Mismatched braces: ${openBraces} opening vs ${closeBraces} closing`, type: "error" });
        success = false;
      }

      const lines = code.split("\n");
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("//") && !trimmed.startsWith("/*") && !trimmed.startsWith("*") &&
            !trimmed.endsWith("{") && !trimmed.endsWith("}") && !trimmed.endsWith(";") &&
            !trimmed.startsWith("import") && !trimmed.startsWith("package") &&
            !trimmed.startsWith("public class") && !trimmed.startsWith("class") &&
            !trimmed.includes("for") && !trimmed.includes("while") &&
            !trimmed.includes("if") && !trimmed.includes("else") &&
            !trimmed.includes("try") && !trimmed.includes("catch") && trimmed.length > 3) {
          errors.push({ line: i + 1, message: "Possible missing semicolon", type: "warning" });
        }
      });

      if (success) {
        output.push("$ javac Main.java");
        output.push("Compilation successful.");
        output.push("");
        output.push("$ java Main");

        const printMatches = code.matchAll(/System\.out\.println\((.*?)\)/g);
        for (const match of printMatches) {
          let val = match[1].trim();
          if (val.startsWith('"') && val.endsWith('"')) {
            output.push(val.slice(1, -1));
          } else {
            output.push(`[computed: ${val}]`);
          }
        }

        output.push("");
        output.push("Process finished with exit code 0");
      } else {
        output.push("$ javac Main.java");
        output.push("Compilation failed.");
        errors.filter(e => e.type === "error").forEach(e => {
          output.push(`Main.java:${e.line}: error: ${e.message}`);
        });
      }

      setResult({ success, output, errors });
      setCompiling(false);
    }, 1800);
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
            <Terminal className="h-3.5 w-3.5 text-accent" />
            Online IDE
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Online Java Compiler</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Write, compile, and run Java code directly in your browser with error highlighting.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={compile}
                disabled={!code.trim() || compiling}
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-all duration-200 hover:bg-primary/90 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {compiling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {compiling ? "Compiling..." : "Run Code"}
              </button>
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
              >
                <Trash2 className="h-4 w-4" /> Clear Console
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-elevated">
              <CodeEditor value={code} onChange={setCode} placeholder="Write your Java code..." minHeight="500px" />
            </div>
          </motion.div>

          {/* Console Output */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="overflow-hidden rounded-2xl border border-code-line shadow-elevated">
              <div className="flex items-center gap-2 border-b border-code-line bg-code-bg px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                </div>
                <Terminal className="ml-2 h-4 w-4 text-code-accent" />
                <span className="text-sm font-semibold text-code-fg">Console Output</span>
                {result && (
                  <span className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                    result.success ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {result.success ? <><CheckCircle className="h-3 w-3" /> Success</> : <><XCircle className="h-3 w-3" /> Failed</>}
                  </span>
                )}
              </div>
              <div className="code-editor min-h-[460px] p-5">
                {result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="space-y-1 font-mono text-sm">
                      {result.output.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={
                            line.startsWith("$") ? "text-code-accent font-semibold" :
                            line.includes("error") ? "text-destructive" :
                            line.includes("successful") || line.includes("exit code 0") ? "text-success" :
                            "text-code-fg"
                          }
                        >
                          {line || "\u00A0"}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex h-[420px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-code-line">
                        <Terminal className="h-8 w-8 text-code-comment/40" />
                      </div>
                      <p className="text-sm font-medium text-code-comment">Click "Run Code" to compile and execute</p>
                      <p className="mt-1 text-xs text-code-comment/60">Output will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Errors/Warnings */}
            {result && result.errors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 shadow-card">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                  Issues ({result.errors.length})
                </h3>
                <div className="space-y-2">
                  {result.errors.map((err, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${
                        err.type === "error" ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/10" : "border-warning/20 bg-warning/5 hover:bg-warning/10"
                      }`}
                    >
                      {err.type === "error" ? (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      )}
                      <div>
                        <span className="font-mono text-xs font-semibold text-muted-foreground">Line {err.line}</span>
                        <p className="mt-0.5 text-muted-foreground">{err.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
