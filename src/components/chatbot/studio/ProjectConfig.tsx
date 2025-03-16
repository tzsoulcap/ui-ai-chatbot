import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModelSelector } from "../ModelSelector";
import { Navbar } from "../Navbar";
import { useNavigate } from "react-router-dom";
import { EmbedModal } from "./EmbedModal";
import { 
  ChevronLeft, 
  Info, 
  Plus, 
  RefreshCw, 
  Folder, 
  ChevronRight,
  Send,
  Paperclip,
  ExternalLink,
  Play
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectConfigProps {
  projectId: string;
  projectTitle: string;
  projectType: string;
  onBack: () => void;
}

export const ProjectConfig = ({ 
  projectId, 
  projectTitle, 
  projectType,
  onBack 
}: ProjectConfigProps) => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studioOpen, setStudioOpen] = useState(true);
  const [knowledgeManagerOpen, setKnowledgeManagerOpen] = useState(false);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  
  // Handle model change
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    console.log(`Model changed to: ${modelId}`);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Toggle studio
  const toggleStudio = () => {
    if (studioOpen) {
      setStudioOpen(false);
      navigate('/');
    } else {
      setStudioOpen(true);
      setKnowledgeManagerOpen(false);
      navigate('/apps');
    }
  };

  // Toggle knowledge manager
  const toggleKnowledgeManager = () => {
    if (knowledgeManagerOpen) {
      setKnowledgeManagerOpen(false);
      navigate('/');
    } else {
      setKnowledgeManagerOpen(true);
      setStudioOpen(false);
      navigate('/knowledge');
    }
  };

  // Handle run app click
  const handleRunApp = () => {
    // Open in new tab instead of navigating in the same tab
    window.open(`/app/${projectId}/preview`, '_blank');
  };

  // Handle embed into site click
  const handleEmbedIntoSite = () => {
    setEmbedModalOpen(true);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900">
      {/* Embed Modal */}
      <EmbedModal 
        open={embedModalOpen}
        onOpenChange={setEmbedModalOpen}
        projectId={projectId}
        projectTitle={projectTitle}
      />
      
      {/* Navbar */}
      <Navbar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        isStudioActive={true}
      />
      
      {/* Header */}
      <header className="border-b border-purple-200 dark:border-purple-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
          >
            <ChevronLeft size={18} />
          </Button>
          <h1 className="text-xl font-semibold text-purple-700 dark:text-purple-300">{projectTitle}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
                Publish <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">LATEST PUBLISHED</div>
                <div className="text-sm mt-1">Published 3 months ago</div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Restore
                  </Button>
                </div>
                <div className="mt-2">
                  <Button variant="default" size="sm" className="w-full justify-center bg-purple-600 hover:bg-purple-700">
                    Update
                  </Button>
                </div>
              </div>
              <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between" onClick={handleRunApp}>
                <div className="flex items-center">
                  <Play size={18} className="mr-2" />
                  <span>Run App</span>
                </div>
                <ExternalLink size={16} />
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between" onClick={handleEmbedIntoSite}>
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Embed Into Site</span>
                </div>
                <ExternalLink size={16} />
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Access API Reference</span>
                </div>
                <ExternalLink size={16} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Instructions */}
        <div className="w-1/2 border-r border-purple-200 dark:border-purple-800 flex flex-col">
          <div className="p-4 border-b border-purple-200 dark:border-purple-800 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="font-medium text-purple-700 dark:text-purple-300">Instructions</h2>
              <Button variant="ghost" size="sm" className="ml-1 p-0 h-auto text-purple-500 dark:text-purple-400">
                <Info size={16} />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
            >
              Generate
            </Button>
          </div>
          
          <div className="flex-1 p-4">
            <Textarea
              placeholder="Write your prompt word here, enter '(' to insert a variable, enter '/' to insert a prompt content block."
              className="min-h-[200px] resize-none border-purple-200 dark:border-purple-800 h-full focus-visible:ring-purple-500"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          
          {/* Variables section */}
          <div className="border-t border-purple-200 dark:border-purple-800">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="p-0 h-auto text-purple-500 dark:text-purple-400">
                  <ChevronRight size={16} />
                </Button>
                <h3 className="font-medium text-purple-700 dark:text-purple-300 ml-1">Variables</h3>
                <Button variant="ghost" size="sm" className="ml-1 p-0 h-auto text-purple-500 dark:text-purple-400">
                  <Info size={16} />
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>
            
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Variables allow users to introduce prompt words or opening remarks when filling out forms. You can try entering <code>&#123;&#123;input&#125;&#125;</code> in the prompt words.
              </p>
            </div>
          </div>
          
          {/* Context section */}
          <div className="border-t border-purple-200 dark:border-purple-800">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="font-medium text-purple-700 dark:text-purple-300">Context</h3>
              </div>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  Retrieval Setting
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  <Plus size={16} className="mr-1" /> Add
                </Button>
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <div className="bg-purple-50 dark:bg-gray-800 rounded p-3 mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Folder size={16} className="text-purple-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Employee Data</span>
                </div>
                <div className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                  HQ · HYBRID
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-gray-800 rounded p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Folder size={16} className="text-purple-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">GreenTech_Qwen</span>
                </div>
                <div className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                  HQ · HYBRID
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - Debug & Preview */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b border-purple-200 dark:border-purple-800 flex items-center justify-between">
            <h2 className="font-medium text-purple-700 dark:text-purple-300">Debug & Preview</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900"
            >
              <RefreshCw size={16} className="mr-1" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="min-h-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Enter your instructions on the left panel<br />
                and test your chatbot here.
              </p>
            </div>
          </ScrollArea>
          
          {/* Chat input */}
          <div className="border-t border-purple-200 dark:border-purple-800 p-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Paperclip size={18} />
              </Button>
              
              <input 
                type="text" 
                placeholder="Talk to Bot" 
                className="w-full pl-10 pr-10 py-2 border border-purple-200 dark:border-purple-800 rounded-md bg-white dark:bg-gray-800 focus:ring-purple-500 focus:border-purple-500"
              />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 dark:text-purple-400"
              >
                <Send size={18} />
              </Button>
            </div>
            
            <div className="mt-2 flex items-center">
              <div className="flex items-center bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md px-2 py-1 text-xs">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Features Enabled
              </div>
              <Button 
                variant="link" 
                size="sm" 
                className="ml-auto text-purple-600 dark:text-purple-400"
              >
                Manage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for dropdown
const ChevronDown = ({ className }: { className?: string }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
}; 