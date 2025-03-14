
import React from 'react';
import { Bot } from 'lucide-react';
import ModelSelector, { AIModel } from '../Navbar/ModelSelector';

interface NavbarProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  models: AIModel[];
}

const Navbar: React.FC<NavbarProps> = ({ selectedModel, onModelChange, models }) => {
  return (
    <header className="glass-card rounded-2xl py-3 px-6 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-2 bg-primary rounded-full p-1">
          <Bot size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          AI Assistant
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <ModelSelector 
          models={models}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
        
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
