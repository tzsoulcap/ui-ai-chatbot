import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chatbot/ChatMessage";
import { LoadingIndicator } from "@/components/chatbot/LoadingIndicator";
import { WelcomeScreen } from "@/components/chatbot/WelcomeScreen";
import { ChatInput } from "@/components/chatbot/ChatInput";
import { Sidebar } from "@/components/chatbot/Sidebar";
import { ChatHeader } from "@/components/chatbot/ChatHeader";
import { ChatNavbar } from "@/components/chatbot/ChatNavbar";
import { Message, ChatHistoryItem } from "@/components/chatbot/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SettingsSidebar } from "@/components/chatbot/settings/SettingsSidebar";
import { KnowledgeManager } from "@/components/chatbot/knowledge/KnowledgeManager";
import { Studio } from "@/components/chatbot/studio/Studio";
import { ProjectConfig } from "@/components/chatbot/studio/ProjectConfig";
import "../styles/chatbot.css";

// Sample projects data
const sampleProjects = [
  {
    id: "1",
    title: "Knowledge Retrieval + Chatbot",
    type: "chatbot",
  },
  {
    id: "2",
    title: "Chatbot",
    type: "chatbot",
    description: "test chatbot feature",
  },
  {
    id: "3",
    title: "Customer Support Agent",
    type: "agent",
  },
  {
    id: "4",
    title: "Data Processing Workflow",
    type: "workflow",
  },
];

// Sidebar width in pixels - used for calculations
const SIDEBAR_WIDTH = 256; // 16rem = 256px
const SETTINGS_SIDEBAR_WIDTH = 320; // 20rem = 320px

interface MainChatProps {
  initialView?: "chat" | "studio" | "knowledge" | "project-config";
}

const MainChat = ({ initialView = "chat" }: MainChatProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [knowledgeManagerOpen, setKnowledgeManagerOpen] = useState(initialView === "knowledge");
  const [studioOpen, setStudioOpen] = useState(initialView === "studio");
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find project by ID if we're in project-config view
  const currentProject = projectId ? sampleProjects.find(p => p.id === projectId) : null;

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('http://192.168.50.119:5678/webhook/conversations?user_id=38137', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          mode: 'cors'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }
        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  // Log for debugging
  useEffect(() => {
    console.log("initialView:", initialView);
    console.log("projectId:", projectId);
    console.log("currentProject:", currentProject);
  }, [initialView, projectId, currentProject]);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Auto-close sidebar on mobile
      if (isMobileView) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Check initially
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // Close settings sidebar when opening chat sidebar on mobile
    if (isMobile && !sidebarOpen) {
      setSettingsSidebarOpen(false);
    }
  };

  // Toggle settings sidebar
  const toggleSettingsSidebar = () => {
    setSettingsSidebarOpen(!settingsSidebarOpen);
    // Close other panels
    if (!settingsSidebarOpen) {
      setKnowledgeManagerOpen(false);
      setStudioOpen(false);
      // Close chat sidebar when opening settings sidebar on mobile
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  // Toggle knowledge manager
  const toggleKnowledgeManager = () => {
    if (knowledgeManagerOpen) {
      setKnowledgeManagerOpen(false);
      navigate('/');
    } else {
      setKnowledgeManagerOpen(true);
      setStudioOpen(false);
      navigate('/knowledge');
      // Close chat sidebar when opening knowledge manager on mobile
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  // Toggle studio
  const toggleStudio = () => {
    if (studioOpen) {
      setStudioOpen(false);
      navigate('/');
    } else {
      setStudioOpen(true);
      setKnowledgeManagerOpen(false);
      navigate('/apps');
      // Close chat sidebar when opening studio on mobile
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  // Handle back from project config
  const handleBackFromProjectConfig = () => {
    navigate('/');
  };

  // Handle chat selection
  const handleChatSelect = async (chatId: string) => {
    setActiveChat(chatId);
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://192.168.50.119:5678/webhook/15c00507-b7de-41d8-97ca-d6e5174c2a98/conversations/${chatId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch conversation messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }

    // On mobile, close the sidebar after selecting a chat
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      conversation_id: activeChat || "",
      message_id: messages.length + 1,
      message_text: input,
      notes: null,
      chart_spec: null,
      chart_notes: null,
      sender_type: "USER",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.50.119:5678/webhook-test/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify({ chatInput: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        conversation_id: activeChat || "",
        message_id: messages.length + 2,
        message_text: data.answer,
        notes: data.notes,
        chart_spec: data.chart_spec,
        chart_notes: null,
        sender_type: "BOT",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        conversation_id: activeChat || "",
        message_id: messages.length + 2,
        message_text: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง",
        notes: null,
        chart_spec: null,
        chart_notes: null,
        sender_type: "BOT",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([]);
    setActiveChat(null);
  };

  // Start a new chat
  const handleNewChat = () => {
    setMessages([]);
    setActiveChat(null);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  // Handle project click in Studio
  const handleProjectClick = (projectId: string) => {
    navigate(`/app/${projectId}/configuration`);
  };

  // If we're in project-config view and have a valid project, show the ProjectConfig component
  if (initialView === "project-config" && currentProject) {
    return (
      <ProjectConfig 
        projectId={currentProject.id}
        projectTitle={currentProject.title}
        projectType={currentProject.type}
        onBack={handleBackFromProjectConfig}
      />
    );
  }

  // Main chat interface
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white dark:bg-gray-900">
      {/* Chat Sidebar - fixed on mobile, absolute on desktop */}
      <aside 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300 ease-in-out
          fixed md:absolute top-0 left-0 bottom-0 z-20
          bg-purple-50 dark:bg-gray-800 shadow-lg
        `}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <Sidebar 
          chatHistory={chatHistory}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          onClearChats={handleClearChat}
        />
      </aside>

      {/* Settings Sidebar - fixed on mobile, absolute on desktop */}
      <aside 
        className={`
          ${settingsSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
          transition-transform duration-300 ease-in-out
          fixed md:absolute top-0 right-0 bottom-0 z-20
          bg-white dark:bg-gray-900 shadow-lg
        `}
        style={{ width: SETTINGS_SIDEBAR_WIDTH }}
      >
        <SettingsSidebar onClose={() => setSettingsSidebarOpen(false)} />
      </aside>

      {/* Overlay for mobile */}
      {(sidebarOpen || settingsSidebarOpen) && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 overlay-fade-in"
          onClick={() => {
            setSidebarOpen(false);
            setSettingsSidebarOpen(false);
          }}
        />
      )}

      {/* Main chat area - takes full width and adjusts position based on sidebar */}
      <main 
        className="absolute inset-0 flex flex-col transition-all duration-300 ease-in-out"
        style={{ 
          left: isMobile ? 0 : (sidebarOpen ? SIDEBAR_WIDTH : 0),
          right: isMobile ? 0 : (settingsSidebarOpen ? SETTINGS_SIDEBAR_WIDTH : 0)
        }}
      >
        {/* Navbar with toggle sidebar button */}
        <ChatNavbar 
          sidebarOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* Header with model selector and action buttons */}
        <ChatHeader 
          userName="Admin"
        />

        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4 chat-scrollbar">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <ChatInput 
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default MainChat;
