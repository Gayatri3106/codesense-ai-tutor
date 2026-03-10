import { motion } from "framer-motion";
import { Code2, Terminal, Braces, Hash, Binary, FileCode, Sparkles } from "lucide-react";

const floatingItems = [
  { Icon: Code2, x: "5%", y: "12%", size: 22, delay: 0 },
  { Icon: Terminal, x: "88%", y: "18%", size: 24, delay: 0.6 },
  { Icon: Braces, x: "12%", y: "72%", size: 18, delay: 1.2 },
  { Icon: Hash, x: "80%", y: "68%", size: 16, delay: 0.9 },
  { Icon: Binary, x: "45%", y: "8%", size: 15, delay: 1.6 },
  { Icon: FileCode, x: "92%", y: "82%", size: 20, delay: 0.4 },
  { Icon: Braces, x: "25%", y: "88%", size: 16, delay: 2.0 },
  { Icon: Code2, x: "72%", y: "38%", size: 14, delay: 1.8 },
  { Icon: Sparkles, x: "60%", y: "75%", size: 12, delay: 2.2 },
  { Icon: Terminal, x: "35%", y: "30%", size: 13, delay: 1.0 },
];

// Starfield particles
const stars = Array.from({ length: 40 }, (_, i) => ({
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

const FloatingIcons = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Stars */}
    {stars.map((star, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute rounded-full bg-primary-foreground/30"
        style={{
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
        }}
        animate={{
          opacity: [0.1, 0.7, 0.1],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: star.duration,
          delay: star.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}

    {/* Floating code icons */}
    {floatingItems.map(({ Icon, x, y, size, delay }, i) => (
      <motion.div
        key={`icon-${i}`}
        className="absolute text-primary-foreground/[0.08]"
        style={{ left: x, top: y }}
        animate={{
          opacity: [0, 0.5, 0.2, 0.5, 0],
          y: [0, -20, 0, 20, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 10,
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
