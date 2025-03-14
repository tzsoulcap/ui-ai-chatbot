import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  const suggestions = [
    "Explain quantum computing",
    "Write a poem about AI",
    "Help me debug my code",
    "Summarize a complex topic"
  ];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full inline-block">
          <Bot size={32} className="text-purple-600 dark:text-purple-300" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          How can I help you today?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Ask me anything or start a conversation. I'm here to assist you!
        </p>
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto mt-4">
          {suggestions.map((suggestion, i) => (
            <Button 
              key={i}
              variant="outline"
              className="text-sm text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}; 