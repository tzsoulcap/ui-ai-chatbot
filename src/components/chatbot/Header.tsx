import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ModelSelector } from "./ModelSelector";

interface HeaderProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  settingsSidebarOpen?: boolean;
  toggleSettingsSidebar?: () => void;
}

export const Header = ({ 
  selectedModel,
  onModelChange,
  settingsSidebarOpen,
  toggleSettingsSidebar
}: HeaderProps) => {
  return (
    <header className="border-b border-purple-200 dark:border-purple-800 p-3 flex items-center justify-end sticky top-0 bg-white dark:bg-gray-900 z-10">
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