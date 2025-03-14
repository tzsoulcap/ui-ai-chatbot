
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  useEffect(() => {
    // Auto-focus the input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-adjust textarea height
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="glass-card rounded-2xl p-2 flex items-end gap-2"
    >
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message AI..."
        disabled={isLoading}
        className="flex-1 bg-transparent border-0 focus:ring-0 resize-none p-2 max-h-[150px] subtle-scroll overflow-y-auto"
        rows={1}
      />
      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={`rounded-xl p-2 transition-all duration-200 ${
          message.trim() && !isLoading
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        <Send size={20} className="text-current" />
      </button>
    </form>
  );
};

export default ChatInput;
