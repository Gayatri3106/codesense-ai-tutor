import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Brain, Timer, Lightbulb, Terminal, MessageSquare } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "Smart Code Input",
    description: "Paste Java code with syntax-aware editor featuring line numbers and tab support.",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Static Analysis",
    description: "Step-by-step explanation of program logic, control flow, and data structures.",
  },
  {
    icon: <Timer className="h-5 w-5" />,
    title: "Complexity Analysis",
    description: "Automatic time and space complexity estimation with Big-O notation.",
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Better Approaches",
    description: "Suggestions for optimized algorithms based on detected complexity patterns.",
  },
  {
    icon: <Terminal className="h-5 w-5" />,
    title: "Online Compiler",
    description: "Compile and run Java code directly in the browser with error highlighting.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "AI Assistant",
    description: "Chat-based AI assistant to explain concepts and help debug your code.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(220_70%_45%/0.08),transparent_60%)]" />
        <div className="container relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Code2 className="h-3 w-3" />
              AI-Powered Java Analysis
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Understand Java Code{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Intuitively
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              CodeSense helps students analyze, compile, and understand Java programs through
              AI-assisted explanations and static analysis.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/compiler"
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Terminal className="h-4 w-4" />
                Open Compiler
              </Link>
            </div>
          </motion.div>

          {/* Code preview decoration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-12 max-w-xl"
          >
            <div className="overflow-hidden rounded-lg border border-code-line shadow-elevated">
              <div className="flex items-center gap-1.5 border-b border-code-line bg-code-bg px-4 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 font-mono text-xs text-code-comment">HelloWorld.java</span>
              </div>
              <pre className="code-editor p-4 text-sm leading-relaxed">
                <code>
                  <span className="text-code-keyword">public class</span>{" "}
                  <span className="text-code-accent">HelloWorld</span> {"{\n"}
                  {"    "}
                  <span className="text-code-keyword">public static void</span>{" "}
                  <span className="text-code-accent">main</span>
                  {"(String[] args) {\n"}
                  {"        "}System.out.println(
                  <span className="text-code-string">"Hello, CodeSense!"</span>
                  {");\n"}
                  {"    }\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold">Core Features</h2>
          <p className="text-muted-foreground">Everything you need to understand Java programs better.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-card">
        <div className="container py-12 text-center">
          <h2 className="mb-2 text-xl font-bold">Ready to analyze your code?</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Paste your Java code and get instant insights.
          </p>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
