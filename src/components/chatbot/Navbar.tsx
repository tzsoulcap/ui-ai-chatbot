import { Button } from "@/components/ui/button";
import { Menu, X, Database, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isStudioActive?: boolean;
  isKnowledgeActive?: boolean;
}

export const Navbar = ({ 
  sidebarOpen, 
  toggleSidebar, 
  isStudioActive = false,
  isKnowledgeActive = false
}: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-purple-200 dark:border-purple-800 p-3 flex items-center justify-between bg-white dark:bg-gray-900 z-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <Link to="/" className="flex items-center cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
            <span className="text-white font-semibold text-sm">AI</span>
          </div>
          <h1 className="text-lg font-semibold text-purple-700 dark:text-purple-300">AI Chatbot</h1>
        </Link>
      </div>

      <div className="flex items-center">
        {/* Studio Button */}
        <Button
          variant={isStudioActive ? "default" : "ghost"}
          size="sm"
          onClick={() => navigate("/apps")}
          className={`mr-2 flex items-center ${
            isStudioActive 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
          }`}
          aria-label="Open Studio"
        >
          <Layers size={18} className="mr-1" />
          <span>Studio</span>
        </Button>
        
        {/* Knowledge Manager Button */}
        <Button
          variant={isKnowledgeActive ? "default" : "ghost"}
          size="sm"
          onClick={() => navigate("/knowledge")}
          className={`flex items-center ${
            isKnowledgeActive 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
          }`}
          aria-label="Open Knowledge Manager"
        >
          <Database size={18} className="mr-1" />
          <span>Knowledge</span>
        </Button>
      </div>
    </nav>
  );
}; 