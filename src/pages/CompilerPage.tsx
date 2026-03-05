import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, AlertTriangle, CheckCircle, XCircle, Bug, Terminal } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";

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
  output: string;
  errors: { line: number; message: string; type: "error" | "warning" }[];
  debugLog: string[];
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
      const debugLog: string[] = [];
      let output = "";
      let success = true;

      debugLog.push("[DEBUG] Starting compilation...");
      debugLog.push("[DEBUG] Parsing source file...");

      // Simple static checks
      if (!code.includes("class ")) {
        errors.push({ line: 1, message: "Missing class declaration", type: "error" });
        success = false;
      }

      const openBraces = (code.match(/{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push({
          line: code.split("\n").length,
          message: `Mismatched braces: ${openBraces} opening vs ${closeBraces} closing`,
          type: "error",
        });
        success = false;
      }

      const lines = code.split("\n");
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (
          trimmed &&
          !trimmed.startsWith("//") &&
          !trimmed.startsWith("/*") &&
          !trimmed.startsWith("*") &&
          !trimmed.endsWith("{") &&
          !trimmed.endsWith("}") &&
          !trimmed.endsWith(";") &&
          !trimmed.startsWith("import") &&
          !trimmed.startsWith("package") &&
          !trimmed.startsWith("public class") &&
          !trimmed.startsWith("class") &&
          !trimmed.includes("for") &&
          !trimmed.includes("while") &&
          !trimmed.includes("if") &&
          !trimmed.includes("else") &&
          !trimmed.includes("try") &&
          !trimmed.includes("catch") &&
          trimmed.length > 3
        ) {
          errors.push({ line: i + 1, message: `Possible missing semicolon`, type: "warning" });
        }
      });

      if (success) {
        debugLog.push("[DEBUG] Compilation successful");
        debugLog.push("[DEBUG] Executing program...");

        // Simulate output from println
        const printMatches = code.matchAll(/System\.out\.println\((.*?)\)/g);
        const outputs: string[] = [];
        for (const match of printMatches) {
          let val = match[1].trim();
          if (val.startsWith('"') && val.endsWith('"')) {
            outputs.push(val.slice(1, -1));
          } else {
            outputs.push(`[computed: ${val}]`);
          }
        }

        output = outputs.length > 0 ? outputs.join("\n") : "Program executed successfully (no output).";
        debugLog.push("[DEBUG] Program finished with exit code 0");
      } else {
        debugLog.push("[DEBUG] Compilation failed with errors");
        output = "Compilation failed. See errors below.";
      }

      setResult({ success, output, errors, debugLog });
      setCompiling(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Compiler & Debugger</h1>
          <p className="text-sm text-muted-foreground">
            Write, compile, and debug Java code with real-time error detection.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <div className="space-y-4">
            <CodeEditor value={code} onChange={setCode} placeholder="Write your Java code..." />
            <button
              onClick={compile}
              disabled={!code.trim() || compiling}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {compiling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {compiling ? "Compiling..." : "Compile & Run"}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Console Output */}
                <OutputPanel
                  title={result.success ? "Output" : "Compilation Failed"}
                  icon={
                    result.success ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )
                  }
                  variant="code"
                >
                  <pre className="whitespace-pre-wrap font-mono text-sm text-code-fg">{result.output}</pre>
                </OutputPanel>

                {/* Errors */}
                {result.errors.length > 0 && (
                  <OutputPanel title={`Issues (${result.errors.length})`} icon={<AlertTriangle className="h-4 w-4" />}>
                    <div className="space-y-2">
                      {result.errors.map((err, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2 rounded-md border p-2 text-sm ${
                            err.type === "error"
                              ? "border-destructive/30 bg-destructive/5"
                              : "border-warning/30 bg-warning/5"
                          }`}
                        >
                          {err.type === "error" ? (
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                          ) : (
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                          )}
                          <div>
                            <span className="font-mono text-xs text-muted-foreground">Line {err.line}:</span>{" "}
                            <span className="text-foreground">{err.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </OutputPanel>
                )}

                {/* Debug Log */}
                <OutputPanel title="Debug Log" icon={<Bug className="h-4 w-4" />} variant="code">
                  <div className="space-y-0.5 font-mono text-xs">
                    {result.debugLog.map((log, i) => (
                      <div key={i} className="text-code-comment">
                        {log}
                      </div>
                    ))}
                  </div>
                </OutputPanel>
              </motion.div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/30">
                <div className="text-center text-sm text-muted-foreground">
                  <Terminal className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  <p>Click "Compile & Run" to see output</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default CompilerPage;
