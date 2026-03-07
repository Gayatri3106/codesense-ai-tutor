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
  Sparkles,
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(220_70%_45%/0.06),transparent_60%)]" />
        </div>

        <div className="container relative px-4 py-20 sm:py-28 md:py-36 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/80 px-5 py-2 text-sm font-medium text-muted-foreground shadow-card backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              AI-Powered Code Analysis
            </motion.div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Understand Java Code{" "}
              <span className="bg-gradient-to-r from-accent to-[hsl(152_60%_50%)] bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              CodeSense helps students analyze, compile, and understand Java
              programs using AI-assisted explanations and static analysis.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/analyzer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 sm:w-auto"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-8 py-3.5 text-sm font-semibold text-foreground shadow-card transition-all duration-200 hover:bg-muted hover:-translate-y-0.5 sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Core Features
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground md:text-lg">
            Everything you need to understand, analyze, and debug your Java
            programs.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t bg-card">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(160_60%_40%/0.04),transparent_60%)]" />
        <div className="container relative px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to analyze your code?
            </h2>
            <p className="mb-10 text-muted-foreground">
              Paste your Java code and get instant insights.
            </p>
            <Link
              to="/analyzer"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-all duration-200 hover:bg-primary/90 hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
