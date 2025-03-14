import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start message-appear">
      <Card className="max-w-3xl p-4 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <div className="font-medium mb-1">AI Assistant</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 typing-dot"></div>
              <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 typing-dot"></div>
              <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 typing-dot"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}; 