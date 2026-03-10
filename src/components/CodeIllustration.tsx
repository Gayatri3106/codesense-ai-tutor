import { motion } from "framer-motion";

const lines = [
  { indent: 0, text: "public class Main {", color: "text-code-keyword" },
  { indent: 1, text: "public static void main(String[] args) {", color: "text-code-keyword" },
  { indent: 2, text: 'System.out.println("Hello!");', color: "text-code-string" },
  { indent: 2, text: "int[] arr = {5, 3, 8, 1};", color: "text-code-fg" },
  { indent: 2, text: "Arrays.sort(arr);", color: "text-code-accent" },
  { indent: 1, text: "}", color: "text-code-fg" },
  { indent: 0, text: "}", color: "text-code-fg" },
];

const CodeIllustration = () => (
  <motion.div
    initial={{ opacity: 0, x: 40, rotateY: -8 }}
    animate={{ opacity: 1, x: 0, rotateY: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="hidden w-full max-w-md rounded-2xl border bg-code-bg p-5 shadow-elevated lg:block"
    style={{ perspective: 800 }}
  >
    {/* Terminal header */}
    <div className="mb-4 flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-destructive/70" />
      <span className="h-3 w-3 rounded-full bg-warning/70" />
      <span className="h-3 w-3 rounded-full bg-success/70" />
      <span className="ml-3 text-xs text-muted-foreground font-mono">Main.java</span>
    </div>

    <div className="space-y-1 font-mono text-xs leading-relaxed sm:text-sm">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.12, duration: 0.35 }}
          className="flex gap-3"
        >
          <span className="w-5 select-none text-right text-muted-foreground/50">
            {i + 1}
          </span>
          <span className={line.color} style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
            {line.text}
          </span>
        </motion.div>
      ))}

      {/* Blinking cursor */}
      <motion.div
        className="ml-8 mt-1 h-4 w-2 rounded-sm bg-accent"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </div>
  </motion.div>
);

export default CodeIllustration;
