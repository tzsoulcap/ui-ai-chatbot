import { createBrowserRouter } from "react-router-dom";
import { ChatContainer } from "./components/chatbot/ChatContainer";
import { Studio } from "./components/chatbot/studio/Studio";
import { KnowledgeManager } from "./components/chatbot/knowledge/KnowledgeManager";
import { ProjectConfig } from "./components/chatbot/studio/ProjectConfig";
import { AppPreview } from "./components/chatbot/studio/AppPreview";
import { Navbar } from "./components/chatbot/Navbar";
import { TestAgent } from "./components/chatbot/TestAgent";
import { TestNotionRAG } from "./components/chatbot/TestNotionRAG";
import { useNavigate, useParams } from "react-router-dom";

// Wrapper components for each route
const StudioPage = () => {
  const handleProjectClick = (projectId: string) => {
    window.location.href = `/app/${projectId}/configuration`;
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white dark:bg-gray-900">
      <Navbar 
        sidebarOpen={false} 
        toggleSidebar={() => {}}
        isStudioActive={true}
      />
      <div className="h-[calc(100%-56px)]">
        <Studio onProjectClick={handleProjectClick} />
      </div>
    </div>
  );
};

const KnowledgePage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white dark:bg-gray-900">
      <Navbar 
        sidebarOpen={false} 
        toggleSidebar={() => {}}
        isKnowledgeActive={true}
      />
      <div className="h-[calc(100%-56px)]">
        <KnowledgeManager />
      </div>
    </div>
  );
};

// Test Agent Page
const TestAgentPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white dark:bg-gray-900">
      <TestAgent />
    </div>
  );
};

// Test Notion RAG Page
const TestNotionRAGPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white dark:bg-gray-900">
      <TestNotionRAG />
    </div>
  );
};

// Wrapper component for AppPreview
const AppPreviewPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // Sample projects data - in a real app, this would come from an API or context
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
  
  // Find project by ID
  const currentProject = sampleProjects.find(p => p.id === projectId);
  
  // Handle back button click
  const handleBack = () => {
    navigate(`/app/${projectId}/configuration`);
  };
  
  if (!currentProject) {
    return <div>Project not found</div>;
  }
  
  return (
    <AppPreview 
      projectId={currentProject.id}
      projectTitle={currentProject.title}
      onBack={handleBack}
    />
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatContainer initialView="chat" />,
  },
  {
    path: "/apps",
    element: <StudioPage />,
  },
  {
    path: "/knowledge",
    element: <KnowledgePage />,
  },
  {
    path: "/test-agent",
    element: <TestAgentPage />,
  },
  {
    path: "/test-notion-rag",
    element: <TestNotionRAGPage />,
  },
  {
    path: "/app/:projectId/configuration",
    element: <ChatContainer initialView="project-config" />,
  },
  {
    path: "/app/:projectId/preview",
    element: <AppPreviewPage />,
  },
]); 