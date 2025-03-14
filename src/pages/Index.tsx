
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import MessageLoader from '../components/Chat/MessageLoader';
import Navbar from '../components/Layout/Navbar';
import AppSidebar from '../components/Layout/AppSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Message, generateId, simulateResponse } from '../utils/chatUtils';
import { AIModel } from '../components/Navbar/ModelSelector';

// Sample models
const availableModels: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient for most tasks'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most powerful model for complex tasks',
    isAdvanced: true
  }
];

// Sample conversations
const sampleConversations = [
  {
    id: generateId(),
    title: 'Travel recommendations',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: generateId(),
    title: 'Coding help',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: generateId(),
    title: 'Recipe ideas',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      content: "Hi there! I'm your AI assistant. How can I help you today?",
      role: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(availableModels[0].id);
  const [conversations, setConversations] = useState(sampleConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(undefined);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response
    try {
      const response = await simulateResponse(content);
      
      // Slight delay to make the loader visible
      setTimeout(() => {
        const botMessage: Message = {
          id: generateId(),
          content: response,
          role: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error getting response:', error);
      setIsLoading(false);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    // In a real app, you would load conversation messages here
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: generateId(),
        content: "Hi there! I'm your AI assistant. How can I help you today?",
        role: 'bot',
        timestamp: new Date()
      }
    ]);
    setCurrentConversationId(undefined);
  };
  
  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar 
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          activeConversationId={currentConversationId}
        />
        <SidebarInset className="flex flex-col bg-gradient-to-br from-purple-50 to-white">
          <div className="container mx-auto max-w-4xl flex-1 flex flex-col p-4 md:p-8">
            <Navbar 
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              models={availableModels}
            />
            
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto px-2 py-4 subtle-scroll">
                <div className="flex flex-col space-y-2">
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && <MessageLoader />}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="mt-4">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Index;
