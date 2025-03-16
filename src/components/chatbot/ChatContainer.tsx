import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { LoadingIndicator } from "./LoadingIndicator";
import { WelcomeScreen } from "./WelcomeScreen";
import { ChatInput } from "./ChatInput";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { Message, ChatHistoryItem } from "./types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SettingsSidebar } from "./settings/SettingsSidebar";
import { KnowledgeManager } from "./knowledge/KnowledgeManager";
import { Studio } from "./studio/Studio";
import { ProjectConfig } from "./studio/ProjectConfig";
import "../../styles/chatbot.css";

// Sample chat history
const sampleChatHistory: ChatHistoryItem[] = [
  { id: "1", title: "Introduction to AI", date: new Date() },
  { id: "2", title: "Help with coding", date: new Date(Date.now() - 86400000) },
  { id: "3", title: "Data analysis questions", date: new Date(Date.now() - 172800000) },
];

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

interface ChatContainerProps {
  initialView?: "chat" | "studio" | "knowledge" | "project-config";
}

export const ChatContainer = ({ initialView = "chat" }: ChatContainerProps) => {
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
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo"); // Default model
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find project by ID if we're in project-config view
  const currentProject = projectId ? sampleProjects.find(p => p.id === projectId) : null;

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

  // Handle model change
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    // ในกรณีจริง อาจมีการเรียก API หรือทำการตั้งค่าอื่นๆ เมื่อเปลี่ยน model
    console.log(`Model changed to: ${modelId}`);
  };

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
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `[Using ${selectedModel}] This is a sample response from the AI assistant. In a real application, this would be replaced with an actual API call to get a response from the AI model.\n\nHere's a code example:\n\`\`\`javascript\nconst greeting = 'Hello, World!';\nconsole.log(greeting);\n\`\`\``,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
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

  // Handle chat selection
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    // In a real app, you would load the messages for this chat
    // For now, we'll just clear the current messages
    setMessages([]);
    // On mobile, close the sidebar after selecting a chat
    if (isMobile) {
      setSidebarOpen(false);
    }
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
          chatHistory={sampleChatHistory}
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
        <Navbar 
          sidebarOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          isStudioActive={studioOpen}
          isKnowledgeActive={knowledgeManagerOpen}
        />
        
        {/* Header with model selector and action buttons */}
        <Header 
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          settingsSidebarOpen={settingsSidebarOpen}
          toggleSettingsSidebar={toggleSettingsSidebar}
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