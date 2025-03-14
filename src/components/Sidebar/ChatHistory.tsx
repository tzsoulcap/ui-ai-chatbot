
import React from 'react';
import { ArchiveIcon, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from '@/components/ui/sidebar';

interface ChatHistoryProps {
  conversations: {
    id: string;
    title: string;
    date: Date;
  }[];
  onSelectConversation: (id: string) => void;
  activeConversationId?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  conversations, 
  onSelectConversation,
  activeConversationId
}) => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {conversations.length > 0 ? (
              conversations.map((convo) => (
                <SidebarMenuItem key={convo.id}>
                  <SidebarMenuButton 
                    isActive={activeConversationId === convo.id}
                    onClick={() => onSelectConversation(convo.id)}
                    tooltip="View conversation"
                  >
                    <MessageSquare size={18} />
                    <span>{convo.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                No recent conversations
              </div>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel>Actions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="View all history">
                <Clock size={18} />
                <span>All History</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Archived conversations">
                <ArchiveIcon size={18} />
                <span>Archived</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Trash">
                <Trash2 size={18} />
                <span>Trash</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default ChatHistory;
