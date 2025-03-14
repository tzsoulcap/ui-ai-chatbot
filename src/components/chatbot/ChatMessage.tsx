import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bot, User, Copy, Check } from "lucide-react";
import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  // Reset copied state after 2 seconds
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  // Format message content with code blocks
  const formatMessageContent = (content: string, messageId: string) => {
    if (!content.includes("```")) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    const parts = content.split(/```([\s\S]*?)```/);
    return (
      <div>
        {parts.map((part, index) => {
          if (index % 2 === 0) {
            return part ? <div key={index} className="whitespace-pre-wrap mb-2">{part}</div> : null;
          } else {
            const codeId = `${messageId}-code-${index}`;
            const language = part.split("\n")[0];
            const code = part.replace(language + "\n", "");
            
            return (
              <div key={index} className="code-block mb-4">
                <div className="code-block-header">
                  <span>{language || "code"}</span>
                  <button 
                    className="copy-button"
                    onClick={() => handleCopyCode(code, codeId)}
                  >
                    {copied === codeId ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto">{code}</pre>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } message-appear`}
    >
      <Card className={`max-w-3xl p-4 ${
        message.role === "user" 
          ? "bg-purple-600 text-white" 
          : "bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800"
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.role === "user" 
              ? "bg-purple-500" 
              : "bg-purple-100 dark:bg-purple-900"
          }`}>
            {message.role === "user" ? (
              <User size={16} className="text-white" />
            ) : (
              <Bot size={16} className="text-purple-600 dark:text-purple-300" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium mb-1">
              {message.role === "user" ? "You" : "AI Assistant"}
            </div>
            {formatMessageContent(message.content, message.id)}
          </div>
        </div>
      </Card>
    </div>
  );
}; 