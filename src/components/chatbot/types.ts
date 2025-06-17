// Message type definition
export interface Message {
  id: number;
  conversation_id: string;
  message_id: number;
  message_text: string;
  notes: string | null;
  chart_spec: ChartSpec | null;
  chart_notes: string | null;
  sender_type: "USER" | "BOT";
  created_at: string;
  updated_at: string;
}

export interface ChartSpec {
  data: any[];
  keys: string[];
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap';
  indexBy: string;
}

// Chat history item type
export interface ChatHistoryItem {
  conversation_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
} 