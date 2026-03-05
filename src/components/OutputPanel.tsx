import { ReactNode } from "react";

interface OutputPanelProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  variant?: "default" | "code";
}

const OutputPanel = ({ title, icon, children, variant = "default" }: OutputPanelProps) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-card">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className={variant === "code" ? "code-editor p-4" : "p-4"}>
        {children}
      </div>
    </div>
  );
};

export default OutputPanel;
