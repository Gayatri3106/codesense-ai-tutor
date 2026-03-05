import { motion } from "framer-motion";
import { Target, CheckCircle, Zap, BookOpen } from "lucide-react";

const AboutPage = () => {
  const objectives = [
    "Provide an intuitive platform for Java code analysis",
    "Help students understand program logic step-by-step",
    "Estimate time and space complexity automatically",
    "Suggest optimized approaches for common algorithms",
    "Integrate a basic Java compiler and debugger",
    "Offer AI-powered explanations via chat interface",
  ];

  const advantages = [
    { title: "Student-Friendly", desc: "Designed with academic learning in mind, no prior expertise required." },
    { title: "All-in-One Platform", desc: "Analysis, compilation, debugging, and AI help in a single application." },
    { title: "Instant Feedback", desc: "Get real-time analysis results without waiting for server processing." },
    { title: "API-Ready Architecture", desc: "Built with clean separation of concerns, ready for backend integration." },
  ];

  return (
    <div className="min-h-screen">
      <div className="container max-w-3xl py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              About the Project
            </div>
            <h1 className="mb-3 text-3xl font-bold">CodeSense</h1>
            <p className="text-muted-foreground">
              An AI-assisted educational tool for understanding Java programs through static analysis and intelligent explanations.
            </p>
          </div>

          {/* Problem Statement */}
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Target className="h-5 w-5 text-primary" />
              Problem Statement
            </h2>
            <div className="rounded-lg border bg-card p-5 shadow-card">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Students learning Java often struggle to understand the flow and logic of programs, especially 
                when dealing with complex data structures, nested loops, and recursion. Traditional IDEs provide 
                compilation and execution but lack explanatory capabilities. There is a need for an educational 
                tool that bridges the gap between writing code and understanding it — providing step-by-step 
                logic explanations, complexity analysis, and suggestions for improvement.
              </p>
            </div>
          </section>

          {/* Objectives */}
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <CheckCircle className="h-5 w-5 text-success" />
              Objectives
            </h2>
            <div className="rounded-lg border bg-card p-5 shadow-card">
              <ul className="space-y-2.5">
                {objectives.map((obj, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{obj}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </section>

          {/* Advantages */}
          <section className="mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Zap className="h-5 w-5 text-warning" />
              Advantages
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {advantages.map((adv, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-lg border bg-card p-4 shadow-card"
                >
                  <h3 className="mb-1 text-sm font-semibold">{adv.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{adv.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide Icons"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
