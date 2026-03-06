import { motion } from "framer-motion";
import { BookOpen, Code2, Globe, Palette, FileCode, Brain, Target } from "lucide-react";

const technologies = [
  { name: "Java", icon: <FileCode className="h-6 w-6" />, desc: "Core language for analysis" },
  { name: "HTML", icon: <Code2 className="h-6 w-6" />, desc: "Page structure & semantics" },
  { name: "CSS", icon: <Palette className="h-6 w-6" />, desc: "Styling & responsive design" },
  { name: "JavaScript", icon: <Globe className="h-6 w-6" />, desc: "Interactive functionality" },
  { name: "AI Analysis", icon: <Brain className="h-6 w-6" />, desc: "Intelligent code explanations" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <div className="container max-w-4xl py-12 md:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-card">
              <BookOpen className="h-3.5 w-3.5" />
              About the Project
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">About CodeSense</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
              An AI-powered educational platform for understanding Java programs.
            </p>
          </div>

          {/* Project Overview */}
          <section className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <BookOpen className="h-5 w-5 text-primary" />
              Project Overview
            </h2>
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                CodeSense is an AI-powered learning platform that helps students understand Java programs
                using automatic code explanations and complexity analysis. It bridges the gap between
                writing code and truly understanding it — providing step-by-step logic breakdowns,
                Big-O complexity estimation, optimization suggestions, and an integrated compiler
                for hands-on experimentation.
              </p>
            </div>
          </section>

          {/* Key Technologies */}
          <section className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Code2 className="h-5 w-5 text-accent" />
              Key Technologies Used
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technologies.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="group rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {tech.icon}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{tech.name}</h3>
                  <p className="text-xs text-muted-foreground">{tech.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Purpose */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Target className="h-5 w-5 text-warning" />
              Purpose
            </h2>
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                The aim of CodeSense is to help beginners easily understand programming logic,
                algorithm behavior, and performance complexity. By providing instant, AI-driven
                feedback on Java code, students can learn faster, identify inefficiencies, and
                develop a deeper understanding of how their programs work under the hood.
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
