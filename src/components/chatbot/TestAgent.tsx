import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { RefreshCw, Bot } from "lucide-react";
import axios from "axios";
import { MessageList } from "./ui/MessageList";
import { ChatInput } from "./ui/ChatInput";
import { TestAgentMessage, ApiResponse } from "./types/TestAgentTypes";

// Define SpeechRecognition types for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const TestAgent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<TestAgentMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef<any>(null);

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
    const userMessage: TestAgentMessage = {
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
      
      const aiMessage: TestAgentMessage = {
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
      const errorMessage: TestAgentMessage = {
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

  // Clear all messages
  const handleClearMessages = () => {
    setMessages([]);
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

          {/* Message List */}
          <MessageList 
            messages={messages}
            isLoading={isLoading}
          />

          {/* Chat Input */}
          <ChatInput 
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        </div>
      </div>
    </div>
  );
};