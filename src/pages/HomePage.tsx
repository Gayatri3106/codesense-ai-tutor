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
  Upload,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import FloatingIcons from "@/components/FloatingIcons";
import CodeIllustration from "@/components/CodeIllustration";

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

const howItWorks = [
  {
    icon: <Upload className="h-7 w-7" />,
    step: "01",
    title: "Upload Code",
    description: "Paste or type your Java code into the built-in editor.",
  },
  {
    icon: <Cpu className="h-7 w-7" />,
    step: "02",
    title: "Analyze",
    description: "Our AI engine breaks down methods, loops, and complexity.",
  },
  {
    icon: <CheckCircle2 className="h-7 w-7" />,
    step: "03",
    title: "Understand Output",
    description: "Get structured explanations, suggestions, and complexity charts.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-[hsl(220_70%_12%)] via-[hsl(210_50%_18%)] to-[hsl(170_50%_18%)]">
        <FloatingIcons />

        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/5 blur-[80px]" />
        </div>

        <div className="container relative px-4 py-24 sm:py-32 md:py-40 lg:py-44">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium text-primary-foreground/80 backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                AI-Powered Code Analysis
              </motion.div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Understand Java Code{" "}
                <span className="bg-gradient-to-r from-accent to-[hsl(180_60%_60%)] bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>

              <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-primary-foreground/60 sm:text-lg md:text-xl lg:mx-0">
                CodeSense helps students analyze, compile, and understand Java
                programs using AI-assisted explanations and static analysis.
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                <Link
                  to="/analyzer"
                  className="glow-btn group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-elevated transition-all duration-300 hover:shadow-[0_0_28px_hsl(160_60%_40%/0.45)] hover:-translate-y-0.5 sm:w-auto"
                >
                  Start Analyzing
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-8 py-3.5 text-sm font-semibold text-primary-foreground/80 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/10 hover:-translate-y-0.5 sm:w-auto"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right illustration */}
            <CodeIllustration />
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
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

      {/* ─── How It Works ─── */}
      <section className="relative overflow-hidden border-y bg-muted/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(160_60%_40%/0.04),transparent_70%)]" />
        <div className="container relative px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground md:text-lg">
              Three simple steps to master your Java code.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {howItWorks.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(50%+40px)] top-10 hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-accent/30 to-accent/5 md:block" />
                )}
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-110 group-hover:shadow-[0_0_24px_hsl(160_60%_40%/0.3)]">
                  {s.icon}
                </div>
                <span className="mb-2 text-xs font-bold tracking-widest text-accent">
                  STEP {s.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(220_70%_12%)] via-[hsl(210_50%_18%)] to-[hsl(170_50%_18%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        </div>
        <div className="container relative px-4 py-20 text-center md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
              Ready to analyze your code?
            </h2>
            <p className="mb-10 text-primary-foreground/60">
              Paste your Java code and get instant insights.
            </p>
            <Link
              to="/analyzer"
              className="glow-btn group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-elevated transition-all duration-300 hover:shadow-[0_0_28px_hsl(160_60%_40%/0.45)] hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
