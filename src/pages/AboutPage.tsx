import { motion } from "framer-motion";
import { BookOpen, Code2, Globe, Palette, FileCode, Brain, Target, Sparkles } from "lucide-react";

const technologies = [
  { name: "Java", icon: <FileCode className="h-6 w-6" />, desc: "Core language for analysis" },
  { name: "HTML", icon: <Code2 className="h-6 w-6" />, desc: "Page structure & semantics" },
  { name: "CSS", icon: <Palette className="h-6 w-6" />, desc: "Styling & responsive design" },
  { name: "JavaScript", icon: <Globe className="h-6 w-6" />, desc: "Interactive functionality" },
  { name: "AI Analysis", icon: <Brain className="h-6 w-6" />, desc: "Intelligent code explanations" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <div className="container max-w-4xl px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2 text-sm font-medium text-muted-foreground shadow-card"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              About the Project
            </motion.div>
            <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">About CodeSense</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
              An AI-powered educational platform for understanding Java programs.
            </p>
          </div>

          {/* Project Overview */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              Project Overview
            </h2>
            <div className="rounded-2xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated md:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base md:leading-7">
                CodeSense is an AI-powered learning platform that helps students understand Java programs
                using automatic code explanations and complexity analysis. It bridges the gap between
                writing code and truly understanding it — providing step-by-step logic breakdowns,
                Big-O complexity estimation, optimization suggestions, and an integrated compiler
                for hands-on experimentation.
              </p>
            </div>
          </motion.section>

          {/* Key Technologies */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
                <Code2 className="h-5 w-5 text-accent" />
              </div>
              Key Technologies Used
            </h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {technologies.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={item}
                  className="group rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    {tech.icon}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{tech.name}</h3>
                  <p className="text-xs text-muted-foreground">{tech.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Purpose */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
                <Target className="h-5 w-5 text-warning" />
              </div>
              Purpose
            </h2>
            <div className="rounded-2xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated md:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base md:leading-7">
                The aim of CodeSense is to help beginners easily understand programming logic,
                algorithm behavior, and performance complexity. By providing instant, AI-driven
                feedback on Java code, students can learn faster, identify inefficiencies, and
                develop a deeper understanding of how their programs work under the hood.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
