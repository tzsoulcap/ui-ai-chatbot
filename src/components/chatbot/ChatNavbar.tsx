import { Button } from "@/components/ui/button";
import { Menu, X, Database, Layers, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const ChatNavbar = ({ 
  sidebarOpen, 
  toggleSidebar, 
}: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between bg-white dark:bg-gray-900 z-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <Link to="/" className="flex items-center cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
            <span className="text-white font-semibold text-sm">AI</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI Chatbot</h1>
        </Link>
      </div>
    </nav>
  );
}; 