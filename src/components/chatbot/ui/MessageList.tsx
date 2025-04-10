import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { TestAgentMessage } from "../types/TestAgentTypes";

interface MessageListProps {
  messages: TestAgentMessage[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 px-4 py-6 overflow-y-auto">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center min-h-[200px]">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Bot size={40} className="mx-auto mb-2 opacity-50" />
              <p>Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none">
              <div className="flex items-center mb-1">
                <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                  <Bot size={12} className="text-white" />
                </div>
                <span className="text-xs text-gray-500">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}; 