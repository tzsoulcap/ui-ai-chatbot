
import React from 'react';

const MessageLoader: React.FC = () => {
  return (
    <div className="chat-bubble chat-bubble-bot flex items-center justify-center">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default MessageLoader;
