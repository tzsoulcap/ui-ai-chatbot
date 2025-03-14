import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ input, setInput, onSendMessage, isLoading }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="border-t border-purple-200 dark:border-purple-800 p-4 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="resize-none pr-12 min-h-[56px] max-h-[200px] border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500 purple-focus"
          onKeyDown={handleKeyDown}
        />
        <Button
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white send-button-glow"
          onClick={onSendMessage}
          disabled={!input.trim() || isLoading}
        >
          <Send size={16} />
        </Button>
      </div>
      <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
        Press Enter to send, Shift+Enter for a new line
      </div>
    </div>
  );
}; 