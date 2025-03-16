import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, FileText, Plus, Search, ExternalLink, Upload } from "lucide-react";

// Knowledge document type
interface KnowledgeDocument {
  id: string;
  title: string;
  docCount: number;
  wordCount: number;
  linkedApps: number;
  description: string;
  date: Date;
}

export const KnowledgeManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([
    {
      id: "1",
      title: "Employee Data",
      docCount: 1,
      wordCount: 0,
      linkedApps: 1,
      description: "useful for when you want to answer queries about the Data for RAG.csv",
      date: new Date()
    },
    {
      id: "2",
      title: "GreenTech_Qwen",
      docCount: 3,
      wordCount: 5000,
      linkedApps: 1,
      description: "useful for when you want to answer queries about the EN_GreenTech_Policy_Document.docx",
      date: new Date()
    },
    {
      id: "3",
      title: "GreenTech_Nomic",
      docCount: 2,
      wordCount: 5000,
      linkedApps: 0,
      description: "useful for when you want to answer queries about the TH_GreenTech_Policy_Document.docx",
      date: new Date()
    },
    {
      id: "4",
      title: "GreenTech_Policy_D...",
      docCount: 2,
      wordCount: 5000,
      linkedApps: 0,
      description: "useful for when you want to answer queries about the GreenTech_Policy_Document.docx",
      date: new Date()
    }
  ]);

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create new knowledge base
  const handleCreateKnowledge = () => {
    alert("Create new knowledge base functionality would be implemented here");
  };

  // Handle connect to external knowledge base
  const handleConnectExternal = () => {
    alert("Connect to external knowledge base functionality would be implemented here");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 p-6 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 pt-0">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Knowledge Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your knowledge bases to enhance AI responses with specific information
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="knowledge" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4">
          <TabsList className="h-10">
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20">
              KNOWLEDGE
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20">
              API ACCESS
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="knowledge" className="flex-1 p-4 space-y-4">
          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
              <Button 
                onClick={handleCreateKnowledge}
                variant="outline" 
                className="mb-4 h-10 w-10 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <h3 className="font-medium">Create Knowledge</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Import your own text data or write data in real-time via Webhook for LLM context enhancement.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
              <Button 
                onClick={handleConnectExternal}
                variant="outline" 
                className="mb-4 h-10 w-10 rounded-full"
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
              <h3 className="font-medium">Connect to an External Knowledge Base</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Connect to third-party knowledge sources to enhance your AI's capabilities.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search knowledge bases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Knowledge list */}
          <div className="flex-1">
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                        <Folder className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{doc.title}</h3>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{doc.docCount} docs</span>
                          <span className="mx-1">•</span>
                          <span>{doc.wordCount} words</span>
                          <span className="mx-1">•</span>
                          <span>{doc.linkedApps} linked apps</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                      {doc.description}
                    </p>
                  </div>
                ))}
              </div>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No knowledge bases found</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="api" className="flex-1 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium mb-4">API Access</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Access your knowledge bases programmatically using our API. Generate an API key to get started.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium">External Knowledge API</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Access your knowledge bases via REST API
                  </p>
                </div>
                <Button variant="outline">Generate API Key</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium">Webhook Integration</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set up webhooks for real-time updates
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 