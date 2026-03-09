import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComplexityBarProps {
  label: string;
  value: string;
  explanation: string;
  color: "success" | "warning" | "destructive" | "accent";
  percentage: number;
  delay?: number;
}

const colorMap = {
  success: { bar: "bg-success", text: "text-success", bg: "bg-success/10" },
  warning: { bar: "bg-warning", text: "text-warning", bg: "bg-warning/10" },
  destructive: { bar: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10" },
  accent: { bar: "bg-accent", text: "text-accent", bg: "bg-accent/10" },
};

const ComplexityBar = ({ label, value, explanation, color, percentage, delay = 0 }: ComplexityBarProps) => {
  const colors = colorMap[color];

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="cursor-help rounded-xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
              <span className={`font-mono text-sm font-bold ${colors.text}`}>{value}</span>
            </div>
            {/* Animated progress bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${colors.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">{explanation}</p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs leading-relaxed">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ComplexityBar;
