
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarInput,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatHistory from '../Sidebar/ChatHistory';

interface AppSidebarProps {
  conversations: {
    id: string;
    title: string;
    date: Date;
  }[];
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  activeConversationId?: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  conversations,
  onSelectConversation,
  onNewChat,
  activeConversationId
}) => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Button 
          onClick={onNewChat}
          variant="outline" 
          className="w-full justify-start gap-2 border-dashed border-purple-200 hover:border-purple-400"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
        <SidebarInput placeholder="Search conversations..." />
      </SidebarHeader>
      
      <SidebarContent>
        <ChatHistory 
          conversations={conversations}
          onSelectConversation={onSelectConversation}
          activeConversationId={activeConversationId}
        />
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarSeparator />
        <Button variant="ghost" size="sm" className="gap-2 w-full justify-start hover:bg-sidebar-accent">
          <Settings size={16} />
          <span>Settings</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
