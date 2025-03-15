import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from "lucide-react";
import { ModelSelector } from "./ModelSelector";

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  title?: string;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  settingsSidebarOpen?: boolean;
  toggleSettingsSidebar?: () => void;
}

export const Header = ({ 
  sidebarOpen, 
  toggleSidebar, 
  title = "AI Chatbot",
  selectedModel,
  onModelChange,
  settingsSidebarOpen,
  toggleSettingsSidebar
}: HeaderProps) => {
  return (
    <header className="border-b border-purple-200 dark:border-purple-800 p-3 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
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
        <h1 className="text-lg font-semibold text-purple-700 dark:text-purple-300">{title}</h1>
      </div>
      
      <div className="flex items-center">
        {/* Model Selector */}
        <ModelSelector 
          selectedModel={selectedModel} 
          onModelChange={onModelChange} 
        />
        
        {/* Settings Button */}
        {toggleSettingsSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSettingsSidebar}
            className="ml-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
            aria-label={settingsSidebarOpen ? "Close settings" : "Open settings"}
          >
            <Settings size={20} />
          </Button>
        )}
      </div>
    </header>
  );
}; 