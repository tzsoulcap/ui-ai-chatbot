
import { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { Header } from "./Header";
import { WelcomeScreen } from "./WelcomeScreen";
import { ModelSelector } from "./ModelSelector";
import { SettingsSidebar } from "./settings/SettingsSidebar";
import { Button } from "../ui/button";
import { Message, ChatHistoryItem } from "./types";

export const ChatContainer = () => {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);

  // Message handlers
  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${content}"`,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };
  
  // Chat history handlers
  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: "New Conversation",
      date: new Date(),
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChat(newChatId);
    setMessages([]);
    setSidebarOpen(false);
  };
  
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    // In a real app, you would load messages for this chat
    setMessages([]);
    setSidebarOpen(false);
  };
  
  const handleClearChats = () => {
    setChatHistory([]);
    setActiveChat(null);
    setMessages([]);
  };
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleSettingsSidebar = () => {
    setSettingsSidebarOpen(prev => !prev);
    setSidebarOpen(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      <Header 
        onMenuClick={toggleSidebar} 
        onSettingsClick={toggleSettingsSidebar}
      />
      
      <div className="flex-grow flex overflow-hidden relative">
        {/* Chat history sidebar */}
        <div 
          className={`absolute z-10 inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
            sidebarOpen ? 'w-64' : 'w-0 md:w-64'
          }`}
        >
          <Sidebar
            chatHistory={chatHistory}
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            onClearChats={handleClearChats}
          />
        </div>
        
        {/* Settings sidebar */}
        <div 
          className={`absolute z-10 inset-y-0 right-0 transform ${
            settingsSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out md:relative ${
            settingsSidebarOpen ? 'w-80' : 'w-0'
          }`}
        >
          <SettingsSidebar onClose={() => setSettingsSidebarOpen(false)} />
        </div>
        
        {/* Main chat area */}
        <div className={`flex-grow flex flex-col relative ${
          (sidebarOpen ? 'md:ml-64' : '') || (settingsSidebarOpen ? 'md:mr-80' : '')
        }`}>
          {/* Mobile backdrop overlay */}
          {(sidebarOpen || settingsSidebarOpen) && (
            <div 
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
              onClick={() => {
                setSidebarOpen(false);
                setSettingsSidebarOpen(false);
              }}
            />
          )}
          
          {/* Chat content */}
          <div className="flex-grow overflow-y-auto p-4 chat-scrollbar">
            {messages.length === 0 ? (
              <WelcomeScreen />
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </div>
          
          {/* Chat input and model selector */}
          <div className="p-4 border-t border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900">
            <ModelSelector />
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
