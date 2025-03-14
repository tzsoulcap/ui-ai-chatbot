
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Sparkles } from 'lucide-react';

export type AIModel = {
  id: string;
  name: string;
  description: string;
  isAdvanced?: boolean;
};

interface ModelSelectorProps {
  models: AIModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  models, 
  selectedModel, 
  onModelChange 
}) => {
  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-[180px] bg-white/80 border-purple-100">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map(model => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-2">
              {model.isAdvanced ? <Sparkles size={14} className="text-purple-500" /> : <Bot size={14} className="text-purple-400" />}
              <span>{model.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;
