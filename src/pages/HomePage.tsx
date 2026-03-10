import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  BarChart3,
  Terminal,
  MessageSquare,
  Sparkles,
  Upload,
  Cpu,
  CheckCircle2,
  Clock,
} from "lucide-react";
import FloatingIcons from "@/components/FloatingIcons";
import CodeIllustration from "@/components/CodeIllustration";

/* ─── Data ─── */

const mainFeatures = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Code Analyzer",
    description: "Get detailed insights for every part of your code.",
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    icon: <Terminal className="h-8 w-8" />,
    title: "Java Compiler",
    description: "Compile & run your code with instant feedback.",
    gradient: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/15 text-accent",
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "AI Code Explanation",
    description: "Receive easy-to-understand AI explanations.",
    gradient: "from-[hsl(280_60%_70%/0.2)] to-[hsl(280_60%_70%/0.05)]",
    iconBg: "bg-[hsl(280_60%_70%/0.15)] text-[hsl(280_60%_70%)]",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Time Complexity",
    description: "Visualize code performance and complexity.",
    gradient: "from-warning/20 to-warning/5",
    iconBg: "bg-warning/15 text-warning",
  },
];

const howItWorks = [
  {
    icon: <Upload className="h-8 w-8" />,
    step: "01",
    title: "Upload Code",
    description: "Upload your Java code securely.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    step: "02",
    title: "Analyze",
    description: "Let CodeSense analyze your code using advanced AI.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: <CheckCircle2 className="h-8 w-8" />,
    step: "03",
    title: "Understand Output",
    description: "Receive intelligent code explanations & analysis.",
    color: "bg-[hsl(280_60%_70%/0.1)] text-[hsl(280_60%_70%)]",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    step: "04",
    title: "Time Complexity",
    description: "Visualize code performance and complexity.",
    color: "bg-warning/10 text-warning",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ─── Wave SVG ─── */
const WaveDivider = ({ flip = false, className = "" }: { flip?: boolean; className?: string }) => (
  <div className={`pointer-events-none w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-16 w-full sm:h-20 md:h-28">
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        className="fill-background"
        opacity=".25"
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        className="fill-background"
        opacity=".5"
      />
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        className="fill-background"
      />
    </svg>
  </div>
);

/* ─── Page ─── */

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(230_60%_12%)] via-[hsl(220_55%_18%)] to-[hsl(190_50%_22%)]">
        <FloatingIcons />

        {/* Radial glow effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[150px]" />
          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/12 blur-[130px]" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(280_60%_50%/0.06)] blur-[100px]" />
        </div>

        <div className="container relative px-4 py-20 sm:py-28 md:py-36 lg:py-44">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Platform
              </motion.div>

              <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Understand{" "}
                <br className="hidden sm:block" />
                Java Code{" "}
                <br />
                <span className="bg-gradient-to-r from-accent via-[hsl(180_70%_60%)] to-[hsl(200_80%_70%)] bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-primary-foreground/50 sm:text-lg lg:mx-0">
                CodeSense helps students analyze, compile, and understand Java
                programs using AI-assisted explanations and static analysis.
              </p>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                <Link
                  to="/analyzer"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_hsl(160_60%_40%/0.5)] sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent to-[hsl(180_60%_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-2">
                    Start Analyzing
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-8 py-3.5 text-sm font-semibold text-primary-foreground/70 backdrop-blur-sm transition-all duration-300 hover:border-primary-foreground/25 hover:bg-primary-foreground/10 hover:-translate-y-0.5 sm:w-auto"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right: code illustration */}
            <CodeIllustration />
          </div>
        </div>

        {/* Wave transition to white */}
        <WaveDivider />
      </section>

      {/* ═══════ LEVEL UP / FEATURES ═══════ */}
      <section className="bg-background py-16 md:py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Level Up Your Java Coding Skills
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground md:text-lg">
              Unlock the power of AI to analyze and understand your Java programs.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {mainFeatures.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <div
                  className={`group relative h-full rounded-2xl border bg-gradient-to-b ${f.gradient} p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1`}
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${f.iconBg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold tracking-tight">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative overflow-hidden bg-muted/30">
        <WaveDivider flip className="absolute left-0 top-0" />

        <div className="container relative px-4 pb-16 pt-28 md:pb-24 md:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              How It Works{" "}
              <span className="text-accent">›</span>{" "}
              <span className="text-muted-foreground">Java Coding Skills</span>
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground md:text-lg">
              Unlock the power of AI to analyze and understand your Java programs.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {howItWorks.map((s) => (
              <motion.div key={s.step} variants={fadeUp}>
                <div className="group h-full rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${s.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    {s.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold tracking-tight">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(230_60%_12%)] via-[hsl(220_55%_18%)] to-[hsl(190_50%_22%)]">
        <WaveDivider flip className="absolute left-0 top-0" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
        </div>

        <div className="container relative px-4 pb-20 pt-32 text-center md:pb-28 md:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-4xl">
              Ready to analyze your code?
            </h2>
            <p className="mb-10 text-primary-foreground/50">
              Paste your Java code and get instant insights.
            </p>
            <Link
              to="/analyzer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_hsl(160_60%_40%/0.5)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent to-[hsl(180_60%_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
