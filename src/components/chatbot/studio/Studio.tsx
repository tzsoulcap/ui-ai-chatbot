import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Search, Database, Bot, GitBranch, Layers, Plus } from "lucide-react";
import { ProjectConfig } from "./ProjectConfig";

// Define project types
type ProjectType = "all" | "chatbot" | "agent" | "workflow";

interface Project {
  id: string;
  title: string;
  type: Exclude<ProjectType, "all">;
  description?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
}

interface StudioProps {
  onProjectClick: (projectId: string) => void;
}

export const Studio = ({ onProjectClick }: StudioProps) => {
  const [activeTab, setActiveTab] = useState<ProjectType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample projects data
  const projects: Project[] = [
    {
      id: "1",
      title: "Knowledge Retrieval + Chatbot",
      type: "chatbot",
      icon: <Database size={20} className="text-white" />,
      iconBgColor: "bg-purple-600",
    },
    {
      id: "2",
      title: "Chatbot",
      type: "chatbot",
      description: "test chatbot feature",
      icon: <Bot size={20} className="text-white" />,
      iconBgColor: "bg-purple-600",
    },
    {
      id: "3",
      title: "Customer Support Agent",
      type: "agent",
      icon: <GitBranch size={20} className="text-white" />,
      iconBgColor: "bg-blue-600",
    },
    {
      id: "4",
      title: "Data Processing Workflow",
      type: "workflow",
      icon: <Layers size={20} className="text-white" />,
      iconBgColor: "bg-green-600",
    },
  ];

  // Filter projects based on active tab and search query
  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === "all" || project.type === activeTab;
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  // Handle project card click
  const handleProjectClick = (project: Project) => {
    onProjectClick(project.id);
  };

  return (
    <div className="h-full w-full overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 pt-0">
        <div className="flex flex-col items-center justify-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Studio</h1>
          
          <div className="flex items-center gap-2 w-full justify-end">
            <Button 
              variant="outline" 
              className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700"
            >
              All Tags <ChevronDown size={16} className="ml-2" />
            </Button>
            
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search" 
                className="pl-10 w-full md:w-[240px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveTab(value as ProjectType)}>
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-md">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              <Layers size={16} className="mr-2" /> All
            </TabsTrigger>
            <TabsTrigger 
              value="chatbot" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              <Bot size={16} className="mr-2" /> Chatbot
            </TabsTrigger>
            <TabsTrigger 
              value="agent" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              <GitBranch size={16} className="mr-2" /> Agent
            </TabsTrigger>
            <TabsTrigger 
              value="workflow" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              <Layers size={16} className="mr-2" /> Workflow
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create App Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">CREATE APP</h2>
            
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus size={18} className="mr-2" />
                Create from Blank
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus size={18} className="mr-2" />
                Create from Template
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus size={18} className="mr-2" />
                Import DSL file
              </Button>
            </div>
          </div>
          
          {/* Project Cards */}
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleProjectClick(project)}
            >
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full ${project.iconBgColor} flex items-center justify-center mr-2`}>
                  {project.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{project.title}</h2>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 px-2 py-1 rounded uppercase font-semibold inline-block w-fit mb-3">
                {project.type}
              </div>
              
              {project.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 