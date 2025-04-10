import { User, Bot, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { TestAgentMessage } from "../types/TestAgentTypes";
import { ChartRenderer } from "./ChartRenderer";

interface ChatMessageProps {
  message: TestAgentMessage;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      key={message.id}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.role === "user"
            ? "bg-purple-100 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200 rounded-tr-none"
            : message.role === "error"
            ? "bg-red-100 dark:bg-red-900/30 text-gray-800 dark:text-gray-200 rounded-tl-none"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
        }`}
      >
        <div className="flex items-center mb-1">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
            message.role === "user"
              ? "bg-purple-600"
              : message.role === "error"
              ? "bg-red-600"
              : "bg-gray-600"
          }`}>
            {message.role === "user" ? (
              <User size={12} className="text-white" />
            ) : message.role === "error" ? (
              <AlertCircle size={12} className="text-white" />
            ) : (
              <Bot size={12} className="text-white" />
            )}
          </div>
          <span className="text-xs text-gray-500">
            {message.role === "user" 
              ? "You" 
              : message.role === "error"
              ? "Error"
              : "AI Assistant"}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">
          {message.role === "assistant" ? (
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown 
                components={{
                  code({node, inline, className, children, ...props}: {
                    node: any;
                    inline?: boolean;
                    className?: string;
                    children: React.ReactNode;
                    [key: string]: any;
                  }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <pre className="bg-gray-800 text-gray-100 rounded p-2 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-gray-200 dark:bg-gray-700 rounded px-1" {...props}>
                        {children}
                      </code>
                    );
                  },
                  ul({node, className, children, ...props}) {
                    return <ul className="list-disc pl-4 my-2" {...props}>{children}</ul>
                  },
                  ol({node, className, children, ...props}) {
                    return <ol className="list-decimal pl-4 my-2" {...props}>{children}</ol>
                  },
                  li({node, className, children, ...props}) {
                    return <li className="my-1" {...props}>{children}</li>
                  },
                  a({node, className, children, ...props}) {
                    return <a className="text-purple-600 dark:text-purple-400 underline" {...props}>{children}</a>
                  },
                  p({node, className, children, ...props}) {
                    return <p className="my-2" {...props}>{children}</p>
                  },
                  h1({node, className, children, ...props}) {
                    return <h1 className="text-xl font-bold my-2" {...props}>{children}</h1>
                  },
                  h2({node, className, children, ...props}) {
                    return <h2 className="text-lg font-bold my-2" {...props}>{children}</h2>
                  },
                  h3({node, className, children, ...props}) {
                    return <h3 className="text-md font-bold my-2" {...props}>{children}</h3>
                  },
                  table({node, className, children, ...props}) {
                    return <table className="border-collapse border border-gray-300 dark:border-gray-700 my-2" {...props}>{children}</table>
                  },
                  th({node, className, children, ...props}) {
                    return <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 bg-gray-100 dark:bg-gray-800" {...props}>{children}</th>
                  },
                  td({node, className, children, ...props}) {
                    return <td className="border border-gray-300 dark:border-gray-700 px-2 py-1" {...props}>{children}</td>
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            message.content
          )}
        </div>
        
        {/* Render chart if available */}
        {message.chartSpec && <ChartRenderer chartSpec={message.chartSpec} />}
      </div>
    </div>
  );
}; 