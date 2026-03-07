import { useRef, useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
}

const CodeEditor = ({ value, onChange, placeholder, readOnly = false, minHeight = "300px" }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = value ? value.split("\n") : [""];
  const lineCount = Math.max(lines.length, 12);

  const handleTab = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const newValue = value.substring(0, start) + "    " + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 4;
        }, 0);
      }
    },
    [value, onChange]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-code-line" style={{ minHeight }}>
      <div className="flex items-center gap-1.5 border-b border-code-line bg-code-bg px-4 py-2.5">
        <div className="h-3 w-3 rounded-full bg-destructive/60 transition-colors hover:bg-destructive" />
        <div className="h-3 w-3 rounded-full bg-warning/60 transition-colors hover:bg-warning" />
        <div className="h-3 w-3 rounded-full bg-success/60 transition-colors hover:bg-success" />
        <span className="ml-3 font-mono text-xs text-code-comment">Main.java</span>
      </div>
      <div className="flex" style={{ minHeight }}>
        {/* Line numbers */}
        <div className="line-numbers flex flex-col border-r border-code-line bg-code-bg px-3 py-3 text-right text-xs leading-[1.7] select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="text-code-comment/40">
              {i + 1}
            </span>
          ))}
        </div>
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleTab}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          className="code-editor w-full resize-none border-0 p-3 outline-none"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
