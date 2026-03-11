import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  context?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: "Request failed" }));
    onError(body.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) {
    onError("No response body");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

const AIChatPanel = ({ context }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm **CodeSense AI**. Ask me anything about your Java code — I'll explain the logic, analyze complexity, and suggest improvements.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userContent = context
      ? `[Code in editor]:\n\`\`\`java\n${context}\n\`\`\`\n\nUser question: ${input.trim()}`
      : input.trim();

    const userMsg: Message = { role: "user", content: userContent };
    const displayMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, displayMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const apiMessages = [
      ...messages.filter((m) => m.role === "assistant" || m.role === "user"),
      userMsg,
    ];

    try {
      await streamChat({
        messages: apiMessages,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && prev.length > 1 && assistantSoFar.startsWith(chunk) === false) {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
            }
            if (last?.role === "user") {
              return [...prev, { role: "assistant", content: assistantSoFar }];
            }
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          });
        },
        onDone: () => setIsLoading(false),
        onError: (err) => {
          setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${err}` }]);
          setIsLoading(false);
        },
      });
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Failed to connect to AI. Please try again." }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card shadow-card">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
          <Bot className="h-4 w-4 text-accent" />
        </div>
        <span className="text-sm font-semibold">CodeSense AI</span>
        <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          Powered by AI
        </span>
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
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1 prose-headings:my-2">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              {msg.role === "user" && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
            placeholder="Ask about your Java code..."
            disabled={isLoading}
            className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
