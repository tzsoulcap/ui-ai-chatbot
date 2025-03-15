import { useState } from "react";
import { X, User, Settings as SettingsIcon, FileText, Upload, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SettingsSidebarProps {
  onClose: () => void;
}

export const SettingsSidebar = ({ onClose }: SettingsSidebarProps) => {
  // Profile state
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  
  // Model settings
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [streamResponse, setStreamResponse] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  
  // RAG documents state
  const [documents, setDocuments] = useState([
    { id: "1", name: "product_manual.pdf", size: "2.4 MB", date: "2023-05-15" },
    { id: "2", name: "technical_specs.docx", size: "1.8 MB", date: "2023-06-22" },
    { id: "3", name: "research_paper.pdf", size: "3.7 MB", date: "2023-04-10" },
  ]);
  
  // File upload handler (mock)
  const handleFileUpload = () => {
    // In a real app, this would handle file upload to server
    alert("File upload functionality would be implemented here");
  };
  
  // Delete document handler
  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-l border-purple-200 dark:border-purple-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-purple-200 dark:border-purple-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="profile" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 p-2 mx-4 mt-2">
          <TabsTrigger value="profile" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="controls" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Controls
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900">
            <Database className="h-4 w-4 mr-2" />
            RAG
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          {/* Profile Tab */}
          <TabsContent value="profile" className="p-4">
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full bg-purple-600 hover:bg-purple-700"
                  >
                    Edit
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                  />
                </div>
                
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Save Profile
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Controls Tab */}
          <TabsContent value="controls" className="p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
                </div>
                <Slider 
                  id="temperature"
                  min={0} 
                  max={1} 
                  step={0.1} 
                  value={[temperature]} 
                  onValueChange={(value) => setTemperature(value[0])}
                  className="py-4"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Controls randomness: Lower values are more deterministic, higher values are more creative.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                </div>
                <Slider 
                  id="max-tokens"
                  min={256} 
                  max={4096} 
                  step={256} 
                  value={[maxTokens]} 
                  onValueChange={(value) => setMaxTokens(value[0])}
                  className="py-4"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Maximum length of the generated response.
                </p>
              </div>
              
              <Separator className="my-4 bg-purple-200 dark:bg-purple-800" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stream-response">Stream Response</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show responses as they're being generated
                  </p>
                </div>
                <Switch 
                  id="stream-response" 
                  checked={streamResponse} 
                  onCheckedChange={setStreamResponse}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Save Chat History</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Save conversations for future reference
                  </p>
                </div>
                <Switch 
                  id="save-history" 
                  checked={saveHistory} 
                  onCheckedChange={setSaveHistory}
                />
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-4">
                Apply Settings
              </Button>
            </div>
          </TabsContent>
          
          {/* Documents Tab for RAG */}
          <TabsContent value="documents" className="p-4">
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium text-purple-700 dark:text-purple-300 flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Retrieval-Augmented Generation (RAG)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Upload documents to enhance AI responses with specific knowledge from your files.
                </p>
              </div>
              
              <div className="border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-purple-500 dark:text-purple-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Drag and drop files here, or click to select files
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                  onClick={handleFileUpload}
                >
                  Upload Document
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Your Documents</h3>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {doc.size} • Uploaded on {doc.date}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                    No documents uploaded yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}; 