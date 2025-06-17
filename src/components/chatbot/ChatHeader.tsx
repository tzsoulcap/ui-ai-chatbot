import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ModelSelector } from "./ModelSelector";

interface HeaderProps {
  userName?: string;
}

export const ChatHeader = ({ 
  userName = "Admin"
}: HeaderProps) => {
  return (
    <header className="border-b border-purple-200 dark:border-purple-800 p-3 flex items-center justify-start sticky top-0 bg-white dark:bg-gray-900 z-10">
      <div className="flex items-center">
        <h1 className="text-lg font-medium text-purple-700 dark:text-purple-300">
          สวัสดีคุณ {userName}
        </h1>
      </div>
    </header>
  );
}; 