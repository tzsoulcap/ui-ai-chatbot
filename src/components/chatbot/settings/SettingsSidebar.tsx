
import { useState } from "react";
import { X, User, Settings, FileText, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "./ProfileSettings";
import { ControlSettings } from "./ControlSettings";
import { KnowledgeManagement } from "./KnowledgeManagement";

interface SettingsSidebarProps {
  onClose: () => void;
}

export const SettingsSidebar = ({ onClose }: SettingsSidebarProps) => {
  return (
    <div className="h-full bg-white dark:bg-gray-900 border-l border-purple-200 dark:border-purple-800 shadow-lg flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-purple-200 dark:border-purple-800">
        <h2 className="text-lg font-bold text-purple-800 dark:text-purple-300">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs defaultValue="control" className="flex-grow flex flex-col">
        <TabsList className="flex justify-between px-2 py-2 border-b border-purple-200 dark:border-purple-800 bg-transparent">
          <TabsTrigger value="control" className="flex-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-200">
            <Settings className="mr-2 h-4 w-4" />
            Control
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-200">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-200">
            <FileText className="mr-2 h-4 w-4" />
            Knowledge
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-grow overflow-y-auto p-4 chat-scrollbar">
          <TabsContent value="control" className="mt-0">
            <ControlSettings />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="knowledge" className="mt-0">
            <KnowledgeManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
