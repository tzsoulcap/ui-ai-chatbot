
import { MenuIcon, Settings } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
  onMenuClick: () => void;
  onSettingsClick: () => void;
}

export const Header = ({ onMenuClick, onSettingsClick }: HeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-purple-200 dark:border-purple-800 p-4 flex justify-between items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick}
        className="md:hidden"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center ml-auto mr-auto md:ml-0 md:mr-0">
        <div className="gradient-text font-bold text-xl">AI Chatbot</div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onSettingsClick}
      >
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};
