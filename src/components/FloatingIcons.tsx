import { motion } from "framer-motion";
import { Code2, Terminal, Braces, Hash, Binary, FileCode } from "lucide-react";

const icons = [
  { Icon: Code2, x: "8%", y: "15%", size: 20, delay: 0 },
  { Icon: Terminal, x: "85%", y: "20%", size: 22, delay: 0.5 },
  { Icon: Braces, x: "15%", y: "70%", size: 18, delay: 1.2 },
  { Icon: Hash, x: "78%", y: "65%", size: 16, delay: 0.8 },
  { Icon: Binary, x: "50%", y: "10%", size: 14, delay: 1.5 },
  { Icon: FileCode, x: "90%", y: "80%", size: 20, delay: 0.3 },
  { Icon: Braces, x: "30%", y: "85%", size: 16, delay: 1.8 },
  { Icon: Code2, x: "70%", y: "40%", size: 14, delay: 2.0 },
];

const FloatingIcons = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {icons.map(({ Icon, x, y, size, delay }, i) => (
      <motion.div
        key={i}
        className="absolute text-primary/10 dark:text-primary/[0.07]"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.6, 0.3, 0.6, 0],
          scale: [0.8, 1, 0.9, 1, 0.8],
          y: [0, -18, 0, 18, 0],
        }}
        transition={{
          duration: 8,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon size={size} strokeWidth={1.5} />
      </motion.div>
    ))}
  </div>
);

export default FloatingIcons;
