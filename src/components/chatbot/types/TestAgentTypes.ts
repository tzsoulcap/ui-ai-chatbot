export interface TestAgentMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
  chartSpec?: ChartSpec;
}

export interface ChartSpec {
  chart_type: string;
  title: string;
  x_axis_label: string;
  y_axis_label: string;
  data: any;
  options: any;
  nivo_type?: string;
  nivo_data?: any;
  nivo_margin?: any;
  nivo_color_scheme?: string;
  nivo_keys?: string[];
  nivo_index_by?: string;
}

export interface ApiResponse {
  result: string;
  chart_spec?: ChartSpec;
  execution_time: number;
  sql_query?: string;
} 