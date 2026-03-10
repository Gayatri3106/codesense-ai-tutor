import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const lines = [
  { indent: 0, text: "public class Main {", color: "text-code-keyword" },
  { indent: 1, text: "public static void main(String[] args) {", color: "text-code-keyword" },
  { indent: 2, text: 'System.out.println("Hello!");', color: "text-code-string" },
  { indent: 2, text: "int[] arr = {5, 3, 8, 1};", color: "text-code-fg" },
  { indent: 2, text: "Arrays.sort(arr);", color: "text-code-accent" },
  { indent: 2, text: "for (int x : arr) {", color: "text-code-keyword" },
  { indent: 3, text: "System.out.print(x);", color: "text-code-string" },
  { indent: 2, text: "}", color: "text-code-fg" },
  { indent: 1, text: "}", color: "text-code-fg" },
  { indent: 0, text: "}", color: "text-code-fg" },
];

const CodeIllustration = () => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
    className="relative hidden w-full max-w-lg lg:block"
  >
    {/* Glowing lightbulb decoration */}
    <motion.div
      className="absolute -right-6 -top-10 z-10"
      animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-warning/30 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-warning to-warning/70 shadow-lg">
          <Lightbulb className="h-8 w-8 text-warning-foreground" />
        </div>
      </div>
    </motion.div>

    {/* Main editor card */}
    <div className="relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-code-bg/90 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm">
      {/* Browser-style header */}
      <div className="flex items-center gap-2 border-b border-primary-foreground/5 bg-code-bg px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-destructive/80" />
          <span className="h-3 w-3 rounded-full bg-warning/80" />
          <span className="h-3 w-3 rounded-full bg-success/80" />
        </div>
        <div className="ml-3 flex items-center gap-2 rounded-md bg-primary-foreground/5 px-3 py-1">
          <span className="font-mono text-[10px] text-primary-foreground/40">CodeSense</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-1.5 w-6 rounded-full bg-accent/60" />
        </div>
      </div>

      {/* Code content */}
      <div className="p-5">
        <div className="space-y-0.5 font-mono text-[11px] leading-[1.8] sm:text-xs">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
              className="flex gap-3"
            >
              <span className="w-5 select-none text-right text-primary-foreground/20">
                {i + 1}
              </span>
              <span className={line.color} style={{ paddingLeft: `${line.indent * 1}rem` }}>
                {line.text}
              </span>
            </motion.div>
          ))}
          {/* Blinking cursor */}
          <motion.div
            className="ml-8 mt-1 h-3.5 w-1.5 rounded-sm bg-accent"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
    </div>

    {/* Floating mini-card decoration */}
    <motion.div
      className="absolute -bottom-4 -left-6 z-10 rounded-xl border border-primary-foreground/10 bg-code-bg/90 px-4 py-2.5 shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 font-mono text-[10px]">
        <span className="text-accent">✓</span>
        <span className="text-primary-foreground/50">Analysis complete</span>
        <span className="text-accent">O(n log n)</span>
      </div>
    </motion.div>
  </motion.div>
);

export default CodeIllustration;
