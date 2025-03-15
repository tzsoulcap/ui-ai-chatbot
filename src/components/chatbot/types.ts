
// Message type definition
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Chat history item type
export interface ChatHistoryItem {
  id: string;
  title: string;
  date: Date;
}

// Document type for Knowledge Management
export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}
