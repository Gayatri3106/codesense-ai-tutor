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
  const lineCount = Math.max(lines.length, 10);

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
    <div className="overflow-hidden rounded-lg border border-code-line" style={{ minHeight }}>
      <div className="flex items-center gap-1.5 border-b border-code-line bg-code-bg px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="ml-3 font-mono text-xs text-code-comment">Main.java</span>
      </div>
      <div className="flex" style={{ minHeight }}>
        {/* Line numbers */}
        <div className="line-numbers flex flex-col border-r border-code-line bg-code-bg px-3 py-3 text-right text-xs leading-[1.7]">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="text-code-comment/50 select-none">
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
