
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import MessageLoader from '../components/Chat/MessageLoader';
import Header from '../components/Layout/Header';
import { Message, generateId, simulateResponse } from '../utils/chatUtils';

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
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white p-4 md:p-8">
      <div className="container mx-auto max-w-4xl flex-1 flex flex-col">
        <Header />
        
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
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
