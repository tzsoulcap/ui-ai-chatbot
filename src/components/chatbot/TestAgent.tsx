import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navbar } from "./Navbar";
import { Send, RefreshCw, Bot, User, Paperclip, AlertCircle, Mic, StopCircle } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

// Define SpeechRecognition types for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
  chartSpec?: ChartSpec;
}

interface ChartSpec {
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

interface ApiResponse {
  result: string;
  chart_spec?: ChartSpec;
  execution_time: number;
  sql_query?: string;
}

export const TestAgent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'th-TH'; // ตั้งค่าภาษาเป็นไทย

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputValue(transcript);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognition.current && isRecording) {
        recognition.current.stop();
      }
    };
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call the API to get AI response
  const getAIResponse = async (question: string) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/combined/ask', {
        question
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: false,
      });

      const data: ApiResponse = response.data;
      return data;
    } catch (error) {
      console.error("Error calling API:", error);
      throw error;
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call API to get AI response
      const aiResponse = await getAIResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse.result,
        timestamp: new Date(),
        chartSpec: aiResponse.chart_spec,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in API response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "error",
        content: "Sorry, there was an error processing your request. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear all messages
  const handleClearMessages = () => {
    setMessages([]);
  };

  // Render chart based on chart spec
  const renderChart = (chartSpec: ChartSpec) => {
    if (!chartSpec || !chartSpec.chart_type) return null;

    // ใช้ข้อมูล Nivo ถ้ามี
    if (chartSpec.nivo_type && chartSpec.nivo_data) {
      const commonProps = {
        data: chartSpec.nivo_data,
        margin: chartSpec.nivo_margin || { top: 50, right: 130, bottom: 50, left: 60 },
        colors: { scheme: 'nivo' },
        animate: true,
        enableSlices: 'x',
        labelSkipWidth: 12,
        labelSkipHeight: 12,
        labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] }
      } as any;

      switch (chartSpec.nivo_type) {
        case 'bar':
          return (
            <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
              <div className="h-[300px]">
                <ResponsiveBar
                  {...commonProps}
                  keys={chartSpec.nivo_keys || ['value']}
                  indexBy={chartSpec.nivo_index_by || 'category'}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: chartSpec.x_axis_label,
                    legendPosition: 'middle',
                    legendOffset: 32
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: chartSpec.y_axis_label,
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                />
              </div>
            </div>
          );
        case 'pie':
          return (
            <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
              <div className="h-[300px]">
                <ResponsivePie
                  {...commonProps}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#999',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: '#000'
                          }
                        }
                      ]
                    }
                  ]}
                />
              </div>
            </div>
          );
        case 'line':
          return (
            <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
              <div className="h-[300px]">
                <ResponsiveLine
                  {...commonProps}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: chartSpec.x_axis_label,
                    legendOffset: 36,
                    legendPosition: 'middle'
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: chartSpec.y_axis_label,
                    legendOffset: -40,
                    legendPosition: 'middle'
                  }}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                />
              </div>
            </div>
          );
        case 'scatter':
          return (
            <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
              <div className="h-[300px]">
                <ResponsiveScatterPlot
                  {...commonProps}
                  xScale={{ type: 'linear', min: 0, max: 'auto' }}
                  yScale={{ type: 'linear', min: 0, max: 'auto' }}
                  blendMode="multiply"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: chartSpec.x_axis_label,
                    legendPosition: 'middle',
                    legendOffset: 46
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: chartSpec.y_axis_label,
                    legendPosition: 'middle',
                    legendOffset: -60
                  }}
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 130,
                      translateY: 0,
                      itemWidth: 100,
                      itemHeight: 12,
                      itemsSpacing: 5,
                      itemDirection: 'left-to-right',
                      symbolSize: 12,
                      symbolShape: 'circle',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                />
              </div>
            </div>
          );
        default:
          return (
            <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {`Chart type: ${chartSpec.chart_type}`}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {`X-axis: ${chartSpec.x_axis_label || "N/A"}`}
                {chartSpec.y_axis_label ? `, Y-axis: ${chartSpec.y_axis_label}` : ""}
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <pre className="text-xs overflow-auto">{JSON.stringify(chartSpec.data, null, 2)}</pre>
              </div>
            </div>
          );
      }
    }

    // ถ้าไม่มีข้อมูล Nivo ให้แสดงผลแบบเดิม
    return (
      <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
        <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {`Chart type: ${chartSpec.chart_type}`}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {`X-axis: ${chartSpec.x_axis_label || "N/A"}`}
          {chartSpec.y_axis_label ? `, Y-axis: ${chartSpec.y_axis_label}` : ""}
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <pre className="text-xs overflow-auto">{JSON.stringify(chartSpec.data, null, 2)}</pre>
        </div>
      </div>
    );
  };

  // Start recording
  const startRecording = () => {
    if (!recognition.current) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }

    try {
      recognition.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900">
      <Navbar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        isTestAgentActive={true}
      />

      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col">
          {/* Header */}
          <header className="border-b border-gray-100 dark:border-gray-800 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">Test Agent</h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearMessages}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs"
            >
              <RefreshCw size={14} className="mr-1" /> Clear Chat
            </Button>
          </header>

          {/* Chat area */}
          <ScrollArea className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center min-h-[200px]">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Bot size={40} className="mx-auto mb-2 opacity-50" />
                    <p>Send a message to start the conversation</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200 rounded-tr-none"
                          : message.role === "error"
                          ? "bg-red-100 dark:bg-red-900/30 text-gray-800 dark:text-gray-200 rounded-tl-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                          message.role === "user"
                            ? "bg-purple-600"
                            : message.role === "error"
                            ? "bg-red-600"
                            : "bg-gray-600"
                        }`}>
                          {message.role === "user" ? (
                            <User size={12} className="text-white" />
                          ) : message.role === "error" ? (
                            <AlertCircle size={12} className="text-white" />
                          ) : (
                            <Bot size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {message.role === "user" 
                            ? "You" 
                            : message.role === "error"
                            ? "Error"
                            : "AI Assistant"}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        {message.role === "assistant" ? (
                          <div className="prose dark:prose-invert prose-sm max-w-none">
                            <ReactMarkdown 
                              components={{
                                code({node, inline, className, children, ...props}: {
                                  node: any;
                                  inline?: boolean;
                                  className?: string;
                                  children: React.ReactNode;
                                  [key: string]: any;
                                }) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline ? (
                                    <pre className="bg-gray-800 text-gray-100 rounded p-2 overflow-x-auto">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  ) : (
                                    <code className="bg-gray-200 dark:bg-gray-700 rounded px-1" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                ul({node, className, children, ...props}) {
                                  return <ul className="list-disc pl-4 my-2" {...props}>{children}</ul>
                                },
                                ol({node, className, children, ...props}) {
                                  return <ol className="list-decimal pl-4 my-2" {...props}>{children}</ol>
                                },
                                li({node, className, children, ...props}) {
                                  return <li className="my-1" {...props}>{children}</li>
                                },
                                a({node, className, children, ...props}) {
                                  return <a className="text-purple-600 dark:text-purple-400 underline" {...props}>{children}</a>
                                },
                                p({node, className, children, ...props}) {
                                  return <p className="my-2" {...props}>{children}</p>
                                },
                                h1({node, className, children, ...props}) {
                                  return <h1 className="text-xl font-bold my-2" {...props}>{children}</h1>
                                },
                                h2({node, className, children, ...props}) {
                                  return <h2 className="text-lg font-bold my-2" {...props}>{children}</h2>
                                },
                                h3({node, className, children, ...props}) {
                                  return <h3 className="text-md font-bold my-2" {...props}>{children}</h3>
                                },
                                table({node, className, children, ...props}) {
                                  return <table className="border-collapse border border-gray-300 dark:border-gray-700 my-2" {...props}>{children}</table>
                                },
                                th({node, className, children, ...props}) {
                                  return <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 bg-gray-100 dark:bg-gray-800" {...props}>{children}</th>
                                },
                                td({node, className, children, ...props}) {
                                  return <td className="border border-gray-300 dark:border-gray-700 px-2 py-1" {...props}>{children}</td>
                                }
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      
                      {/* Render chart if available */}
                      {message.chartSpec && renderChart(message.chartSpec)}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none">
                    <div className="flex items-center mb-1">
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                        <Bot size={12} className="text-white" />
                      </div>
                      <span className="text-xs text-gray-500">AI Assistant</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-3">
            <div className="relative">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 p-0"
                >
                  <Paperclip size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-0 ${isRecording ? 'text-red-500' : 'text-gray-400'}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <StopCircle size={16} /> : <Mic size={16} />}
                </Button>
              </div>
              
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..." 
                className="w-full pl-16 pr-12 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none min-h-[42px] max-h-[120px] overflow-y-auto"
                rows={1}
              />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSendMessage}
                disabled={inputValue.trim() === "" || isLoading}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-0
                  ${
                    inputValue.trim() === "" || isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-purple-600 dark:text-purple-400 cursor-pointer"
                  }
                `}
              >
                <Send size={16} />
              </Button>
            </div>
            
            <div className="mt-2 flex justify-end">
              <div className="text-xs text-gray-500">
                {isRecording ? 'Recording... Click stop when finished' : 'Press Enter to send, Shift+Enter for new line'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};