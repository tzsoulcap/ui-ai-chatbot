import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ChatHistoryItem } from "./types";

interface SidebarProps {
  chatHistory: ChatHistoryItem[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onClearChats: () => void;
}

export const Sidebar = ({
  chatHistory,
  activeChat,
  onChatSelect,
  onNewChat,
  onClearChats
}: SidebarProps) => {
  return (
    <div className="w-64 h-full bg-purple-50 dark:bg-purple-950 border-r border-purple-200 dark:border-purple-800 p-4 flex flex-col shadow-lg md:shadow-none">
      {/* <div className="purple-gradient text-white p-3 rounded-lg mb-6 text-center font-bold">
        AI Chatbot
      </div> */}
      
      <Button 
        variant="outline" 
        className="mb-6 bg-white dark:bg-purple-900 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-100 flex items-center gap-2"
        onClick={onNewChat}
      >
        <Plus size={16} />
        New Chat
      </Button>
      
      <div className="flex-grow overflow-y-auto chat-scrollbar">
        <h3 className="text-xs font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-2 px-2">
          Recent Conversations
        </h3>
        {chatHistory.map((chat) => (
          <div 
            key={chat.id}
            className={`p-2 mb-1 cursor-pointer chat-history-item ${activeChat === chat.id ? 'active' : ''}`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {chat.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {chat.date.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        className="mt-auto text-purple-700 dark:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-800 flex items-center gap-2"
        onClick={onClearChats}
      >
        <Trash2 size={16} />
        Clear conversations
      </Button>
    </div>
  );
}; 