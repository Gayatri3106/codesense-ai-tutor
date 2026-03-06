import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  BarChart3,
  Lightbulb,
  Terminal,
  MessageSquare,
  Code2,
} from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Static Code Analysis",
    description:
      "Understand your Java program's logic with step-by-step explanations of each operation.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Complexity Estimation",
    description:
      "Get time and space complexity analysis for your code to understand performance.",
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Smart Suggestions",
    description:
      "Receive optimization recommendations and alternative approaches based on complexity.",
  },
  {
    icon: <Terminal className="h-6 w-6" />,
    title: "Compiler & Debugger",
    description:
      "Compile Java code online with error highlighting and debug messages.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "AI Assistant",
    description:
      "Chat with an AI that explains code, answers questions, and helps debug issues.",
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Code Editor",
    description:
      "Full-featured code editor with syntax highlighting and line numbers for Java.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(220_70%_45%/0.08),transparent_60%)]" />
        <div className="container relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-card">
              <Search className="h-3.5 w-3.5 text-primary" />
              AI-Powered Code Analysis
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Understand Java Code{" "}
              <span className="bg-gradient-to-r from-accent to-[hsl(152_60%_50%)] bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              CodeSense helps students analyze, compile, and understand Java
              programs using AI-assisted explanations and static analysis.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-card transition-all hover:bg-muted"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Core Features
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground md:text-lg">
            Everything you need to understand, analyze, and debug your Java
            programs.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-card">
        <div className="container py-16 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">
            Ready to analyze your code?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Paste your Java code and get instant insights.
          </p>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition-all hover:bg-primary/90"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
