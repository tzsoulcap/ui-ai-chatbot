
import React from 'react';
import { Message, formatTime } from '../../utils/chatUtils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex items-end mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
        <div className="flex flex-col">
          <p className="text-sm">{message.content}</p>
          <span className={`text-xs mt-1 self-end ${isUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
