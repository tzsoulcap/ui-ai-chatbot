import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, StopCircle, Plus } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const ChatInput = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  isLoading,
  isRecording,
  startRecording,
  stopRecording
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to correctly calculate the new height
      textarea.style.height = 'auto';
      
      // Calculate the scroll height (content height)
      const scrollHeight = textarea.scrollHeight;
      
      // Set new height with a minimum of 42px and maximum of equivalent to 10 lines
      // Approximately 24px per line (normal line height)
      const maxHeight = 24 * 10; // 10 lines
      
      textarea.style.height = `${Math.min(Math.max(42, scrollHeight), maxHeight)}px`;
    }
  }, [inputValue]);

  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 p-3">
      {/* Text input area */}
      <div className="relative border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
        <textarea 
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..." 
          className="w-full p-3 bg-transparent focus:outline-none focus:ring-0 border-0 text-sm resize-none overflow-y-auto transition-height duration-150 ease-out"
          style={{ maxHeight: '240px' }} // 10 lines at approx 24px per line
        />
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          
          {/* Attachment Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-9 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <Paperclip size={18} className="text-gray-500 dark:text-gray-400" />
          </Button>
          
          {/* Mic Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className={`w-9 h-8 rounded-md ${isRecording ? 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} flex items-center justify-center`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 
              <StopCircle size={18} className="text-red-500 dark:text-red-400" /> : 
              <Mic size={18} className="text-gray-500 dark:text-gray-400" />
            }
          </Button>
          
          {/* Additional buttons can be added here */}
        </div>
        
        {/* Send Button */}
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSendMessage}
            disabled={inputValue.trim() === "" || isLoading}
            className={`w-10 h-8 rounded-full flex items-center justify-center
              ${
                inputValue.trim() === "" || isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }
            `}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
      
      {/* Status text */}
      <div className="mt-1 flex justify-end">
        <div className="text-xs text-gray-500">
          {isRecording ? 'Recording... Click stop when finished' : 'Press Enter to send, Shift+Enter for new line'}
        </div>
      </div>
    </div>
  );
}; 