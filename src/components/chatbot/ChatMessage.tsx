import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bot, User, Copy, Check, AlertCircle } from "lucide-react";
import { Message } from "./types";
import { ChartRenderer } from "./ChartRenderer";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import { Resizable } from 're-resizable';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const isUser = message.sender_type === "USER";
  const Icon = isUser ? User : Bot;
  const [chartSize, setChartSize] = useState({ width: 600, height: 400 });

  // Reset copied state after 2 seconds
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  // Custom components for react-markdown
  const markdownComponents = {
    // Code blocks
    pre: ({ children, ...props }: any) => {
      const codeElement = children?.props?.children;
      const language = children?.props?.className?.replace('language-', '') || 'text';
      const codeId = `${message.id}-code-${Math.random()}`;
      
      return (
        <div className="code-block mb-4">
          <div className="code-block-header">
            <span>{language}</span>
            <button 
              className="copy-button"
              onClick={() => handleCopyCode(codeElement, codeId)}
            >
              {copied === codeId ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <pre {...props} className="p-4 overflow-x-auto">
            {children}
          </pre>
        </div>
      );
    },
    // Inline code
    code: ({ children, className, ...props }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      return <code className={className} {...props}>{children}</code>;
    },
    // Headers
    h1: ({ children, ...props }: any) => (
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100" {...props}>
        {children}
      </h3>
    ),
    // Lists
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </li>
    ),
    // Links
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-purple-600 dark:text-purple-400 hover:underline"
        {...props}
      >
        {children}
      </a>
    ),
    // Paragraphs
    p: ({ children, ...props }: any) => (
      <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    // Strong/Bold
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-gray-900 dark:text-gray-100" {...props}>
        {children}
      </strong>
    ),
    // Emphasis/Italic
    em: ({ children, ...props }: any) => (
      <em className="italic text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </em>
    ),
    // Blockquotes
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-purple-400 pl-4 py-2 mb-4 bg-purple-50 dark:bg-purple-900/20 italic" {...props}>
        {children}
      </blockquote>
    ),
    // Tables
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300 dark:border-gray-600" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-gray-50 dark:bg-gray-700" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="px-4 py-2 text-left font-semibold border-b border-gray-300 dark:border-gray-600" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-600" {...props}>
        {children}
      </td>
    ),
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'bg-purple-100 dark:bg-purple-900' : 'bg-white dark:bg-gray-800'} rounded-lg p-4 shadow-sm`}>
        <div className="prose dark:prose-invert max-w-none mb-2">
          <ReactMarkdown>{message.message_text}</ReactMarkdown>
        </div>
        
        {message.notes && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <ReactMarkdown>{message.notes}</ReactMarkdown>
          </div>
        )}

        {message.chart_spec && (
          <Resizable
            size={chartSize}
            minWidth={300}
            minHeight={300}
            maxWidth={900}
            maxHeight={900}
            style={{ margin: '0 auto' }}
            onResizeStop={(e, direction, ref, d) => {
              setChartSize({
                width: chartSize.width + d.width,
                height: chartSize.height + d.height,
              });
            }}
            handleComponent={{
              bottomRight: (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    cursor: 'nwse-resize',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    background: 'rgba(120,120,120,0.10)'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: 16,
                    height: 16,
                    margin: 2
                  }}>
                    {/* ขีดแนวนอน */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: 12,
                      height: 4,
                      background: '#888',
                      borderRadius: 0
                    }} />
                    {/* ขีดแนวตั้ง */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 4,
                      height: 12,
                      background: '#888',
                      borderRadius: 0
                    }} />
                  </div>
                </div>
              )
            }}
          >
            <ChartRenderer
              type={message.chart_spec.type}
              data={message.chart_spec.data}
              keys={message.chart_spec.keys}
              indexBy={message.chart_spec.indexBy}
              width={chartSize.width}
              height={chartSize.height}
            />
          </Resizable>
        )}

        {message.chart_notes && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <ReactMarkdown>{message.chart_notes}</ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
        </div>
      )}
    </div>
  );
}; 