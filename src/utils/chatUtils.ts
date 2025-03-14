
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'bot';
  timestamp: Date;
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export const simulateResponse = async (message: string): Promise<string> => {
  // This is a placeholder for an actual API call to a language model
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
  
  const responses = [
    "I'm an AI assistant here to help you. How can I assist you today?",
    "That's an interesting question. Let me think about that for a moment...",
    "I understand what you're asking. Here's what I know about that topic.",
    "I'm designed to provide helpful and accurate information. Based on your question, I'd say...",
    "Thanks for your message! I'm processing that request now."
  ];
  
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};
