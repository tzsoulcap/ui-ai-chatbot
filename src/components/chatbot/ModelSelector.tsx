import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// รายการ models ที่สามารถเลือกได้
const AI_MODELS = [
  { id: "gpt-4", name: "GPT-4", description: "Most powerful model for complex tasks" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and efficient for most tasks" },
  { id: "claude-3", name: "Claude 3", description: "Balanced performance with strong reasoning" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Google's advanced AI model" },
  { id: "llama-3", name: "Llama 3", description: "Open source model with good performance" },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  // หา model ที่เลือกอยู่ปัจจุบัน
  const currentModel = AI_MODELS.find(model => model.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center justify-between gap-2 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-700"
          >
            <span className="text-sm font-medium">{currentModel.name}</span>
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          {AI_MODELS.map((model) => (
            <DropdownMenuItem
              key={model.id}
              className={`flex items-start gap-2 p-2 cursor-pointer ${
                model.id === selectedModel ? "bg-purple-50 dark:bg-gray-700" : ""
              }`}
              onClick={() => onModelChange(model.id)}
            >
              <div className="h-5 w-5 flex items-center justify-center mt-0.5">
                {model.id === selectedModel && <Check size={16} className="text-purple-600 dark:text-purple-400" />}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{model.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{model.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 