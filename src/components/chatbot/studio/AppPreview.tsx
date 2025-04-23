import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, ArrowLeft, Settings, ExternalLink, Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  citations?: string[];
}

interface AppPreviewProps {
  projectId: string;
  projectTitle: string;
  onBack: () => void;
}

export const AppPreview = ({ projectId, projectTitle, onBack }: AppPreviewProps) => {
  const [userParams, setUserParams] = useState<{
    userId?: string;
    userRole?: string;
    userName?: string;
  }>({});

  // Extract URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get('userId') || undefined;
    const userRole = searchParams.get('userRole') || undefined;
    const userName = searchParams.get('userName') || undefined;
    
    setUserParams({ userId, userRole, userName });
  }, []);

  // Generate greeting message based on user role
  const getGreetingMessage = () => {
    if (userParams.userRole) {
      return `Hello ${userParams.userName ? userParams.userName : ''}! I'm the ${projectTitle} assistant for ${userParams.userRole}s. How can I help you today?`;
    }
    return `Hello! I'm the ${projectTitle} assistant. How can I help you today?`;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial greeting message after URL params are loaded
  useEffect(() => {
    if (Object.keys(userParams).length > 0) {
      setMessages([
        {
          id: "1",
          content: getGreetingMessage(),
          role: "assistant",
          timestamp: new Date(),
        }
      ]);
    }
  }, [userParams, projectTitle]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      // Example response with citations for demo purposes
      let aiResponse: Message;
      
      if (input.toLowerCase().includes("สวัสดีการดำเนินงาน") || input.toLowerCase().includes("พนักงานใหม่")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: "ไม่ได้มีการกล่าวถึงสวัสดิการดำเนินงานในข้อมูลที่ให้มา แต่บริษัทมีสวัสดิการอื่นๆ เช่น ประกันสุขภาพ, โบนัส, วันลาพักร้อน, วันลาป่วย, สวัสดิการการศึกษาต่อ และกิจกรรมสันทนาการ หากคุณสนใจในสวัสดิการอื่นๆ กรุณาสอบถามเพิ่มเติมได้ครับ",
          role: "assistant",
          timestamp: new Date(),
          citations: ["TH_GreenTech_Policy_Document.docx", "EN_GreenTech_Policy_Document.docx"]
        };
      } else if (input.toLowerCase().includes("รหัส") || input.toLowerCase().includes("พนักงาน")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: "พนักงานที่มีรหัสขึ้นต้นด้วย A มีทั้งหมด 8 คน",
          role: "assistant",
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `This is a sample response from the ${projectTitle} assistant. In a real application, this would be replaced with an actual API call to get a response from the AI model.`,
          role: "assistant",
          timestamp: new Date(),
        };
      }
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{projectTitle}</h1>
          {userParams.userRole && (
            <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
              {userParams.userRole}
            </span>
          )}
        </div>
      </header>
      
      {/* Chat area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Citations section */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">CITATIONS</p>
                    <div className="flex flex-wrap gap-2">
                      {message.citations.map((citation, index) => (
                        <div 
                          key={index}
                          className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 7H17M7 12H17M7 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {citation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div 
                  className={`text-xs mt-1 ${
                    message.role === "user" 
                      ? "text-purple-200" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ml-2 flex-shrink-0 overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Paperclip size={18} />
            </Button>
            
            <textarea 
              placeholder="Type a message..." 
              className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-purple-500 focus:border-purple-500 resize-none"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 dark:text-purple-400"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}; 