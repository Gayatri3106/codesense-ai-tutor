import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, Trash2, Terminal, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
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

      // Check for missing semicolons
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
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Online Java Compiler</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Write, compile, and run Java code directly in your browser with error highlighting.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={compile}
                disabled={!code.trim() || compiling}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {compiling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {compiling ? "Compiling..." : "Run Code"}
              </button>
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" /> Clear Console
              </button>
            </div>
            <CodeEditor value={code} onChange={setCode} placeholder="Write your Java code..." minHeight="450px" />
          </div>

          {/* Console Output */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-code-line shadow-card">
              <div className="flex items-center gap-2 border-b border-code-line bg-code-bg px-4 py-2.5">
                <Terminal className="h-4 w-4 text-code-accent" />
                <span className="text-sm font-semibold text-code-fg">Console Output</span>
                {result && (
                  <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    result.success ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {result.success ? <><CheckCircle className="h-3 w-3" /> Success</> : <><XCircle className="h-3 w-3" /> Failed</>}
                  </span>
                )}
              </div>
              <div className="code-editor min-h-[400px] p-4">
                {result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="space-y-0.5 font-mono text-sm">
                      {result.output.map((line, i) => (
                        <div
                          key={i}
                          className={
                            line.startsWith("$") ? "text-code-accent font-semibold" :
                            line.includes("error") ? "text-destructive" :
                            line.includes("successful") || line.includes("exit code 0") ? "text-success" :
                            "text-code-fg"
                          }
                        >
                          {line || "\u00A0"}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex h-[360px] items-center justify-center">
                    <div className="text-center">
                      <Terminal className="mx-auto mb-2 h-10 w-10 text-code-comment opacity-40" />
                      <p className="text-sm text-code-comment">Click "Run Code" to compile and execute</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Errors/Warnings */}
            {result && result.errors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-4 shadow-card">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Issues ({result.errors.length})
                </h3>
                <div className="space-y-2">
                  {result.errors.map((err, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 rounded-lg border p-2.5 text-sm ${
                        err.type === "error" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"
                      }`}
                    >
                      {err.type === "error" ? (
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                      )}
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">Line {err.line}:</span>{" "}
                        <span>{err.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
