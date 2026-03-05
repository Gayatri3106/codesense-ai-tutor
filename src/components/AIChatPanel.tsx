import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  context?: string;
}

const AIChatPanel = ({ context }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI code assistant. Paste Java code or ask me anything about programming concepts, complexity analysis, or debugging.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const simulateResponse = (userMsg: string) => {
    setIsTyping(true);
    const lower = userMsg.toLowerCase();

    let response = "I can help with Java code analysis, complexity estimation, and debugging. Could you share some code or ask a specific question?";

    if (lower.includes("complexity") || lower.includes("big o")) {
      response =
        "**Complexity Analysis:**\n\nTo determine time complexity, I look at:\n- **Loops**: Single loop → O(n), nested loops → O(n²)\n- **Recursion**: Analyze recurrence relations\n- **Data structures**: HashMap operations are O(1) avg, TreeMap is O(log n)\n\nPaste your code and I'll analyze it in detail!";
    } else if (lower.includes("sort") || lower.includes("sorting")) {
      response =
        "**Sorting Algorithms Comparison:**\n\n| Algorithm | Time (Best) | Time (Worst) | Space |\n|-----------|------------|-------------|-------|\n| Bubble Sort | O(n) | O(n²) | O(1) |\n| Merge Sort | O(n log n) | O(n log n) | O(n) |\n| Quick Sort | O(n log n) | O(n²) | O(log n) |\n\nFor most cases, **Arrays.sort()** in Java uses TimSort (O(n log n)).";
    } else if (lower.includes("error") || lower.includes("debug") || lower.includes("fix")) {
      response =
        "**Common Java Errors:**\n\n1. `NullPointerException` — Check for null before accessing objects\n2. `ArrayIndexOutOfBoundsException` — Verify array bounds\n3. `ClassCastException` — Use `instanceof` before casting\n\nShare the error message and code, and I'll help you debug it!";
    } else if (context && (lower.includes("explain") || lower.includes("code") || lower.includes("analyze"))) {
      response = `**Code Analysis:**\n\nI can see you have code in the editor. Here's what I notice:\n\n- The code structure follows standard Java conventions\n- Consider checking for edge cases and null values\n- I'd recommend adding proper exception handling\n\nWould you like me to explain any specific part in detail?`;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    simulateResponse(userMsg);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card shadow-card">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Bot className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold">AI Assistant</span>
        <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">Online</span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: "400px" }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Bot className="h-3.5 w-3.5 text-accent" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
              <Bot className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="flex gap-1 rounded-lg bg-muted px-3 py-2">
              <div className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <div className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <div className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about Java code..."
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
