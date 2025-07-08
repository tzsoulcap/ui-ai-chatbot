import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText, ExternalLink, AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getKnowledgeItems, 
  addKnowledgeItem, 
  deleteKnowledgeItem, 
  validateNotionPageId,
  simulateProcessing,
  type KnowledgeItem 
} from "@/utils/knowledgeApi";

export default function KnowledgeManagement() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    pageId: '',
    title: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KnowledgeItem | null>(null);
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Load knowledge items on component mount
  useEffect(() => {
    loadKnowledgeItems();
  }, []);

  // Monitor processing items and update their status
  useEffect(() => {
    const processingItemsArray = knowledgeItems.filter(item => item.status === 'processing');
    
    processingItemsArray.forEach(item => {
      if (!processingItems.has(item.id)) {
        setProcessingItems(prev => new Set(prev).add(item.id));
        
        // Simulate processing completion
        simulateProcessing(item.id).then(() => {
          loadKnowledgeItems(); // Reload to get updated status
          setProcessingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
        });
      }
    });
  }, [knowledgeItems, processingItems]);

  // Load knowledge items from API
  const loadKnowledgeItems = async () => {
    setIsLoading(true);
    try {
      const data = await getKnowledgeItems();
      setKnowledgeItems(data);
    } catch (error) {
      console.error('Error loading knowledge items:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new knowledge
  const handleAddKnowledge = async () => {
    if (!newKnowledge.pageId.trim() || !newKnowledge.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Page ID and Title are required",
        variant: "destructive",
      });
      return;
    }

    // Validate Notion page ID format
    if (!validateNotionPageId(newKnowledge.pageId)) {
      toast({
        title: "Invalid Page ID",
        description: "Please enter a valid Notion page ID format",
        variant: "destructive",
      });
      return;
    }

    setIsAddingKnowledge(true);
    try {
      const newItem = await addKnowledgeItem({
        pageId: newKnowledge.pageId,
        title: newKnowledge.title,
        description: newKnowledge.description,
        status: 'processing'
      });

      setKnowledgeItems(prev => [newItem, ...prev]);
      setNewKnowledge({ pageId: '', title: '', description: '' });
      
      toast({
        title: "Success",
        description: "Knowledge added successfully and is being processed",
      });
    } catch (error) {
      console.error('Error adding knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to add knowledge",
        variant: "destructive",
      });
    } finally {
      setIsAddingKnowledge(false);
    }
  };

  // Delete knowledge
  const handleDeleteKnowledge = async () => {
    if (!itemToDelete) return;

    try {
      const success = await deleteKnowledgeItem(itemToDelete.id);
      
      if (success) {
        setKnowledgeItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        toast({
          title: "Success",
          description: "Knowledge deleted successfully",
        });
      } else {
        throw new Error('Failed to delete knowledge');
      }
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to delete knowledge",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Refresh knowledge items
  const handleRefresh = () => {
    loadKnowledgeItems();
  };

  // Filter knowledge items based on search query
  const filteredItems = knowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pageId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get status badge variant
  const getStatusBadge = (status: KnowledgeItem['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processing
        </Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">
          Inactive
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Knowledge Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your Notion knowledge bases for RAG (Retrieval-Augmented Generation)
          </p>
        </div>

        {/* Add Knowledge Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Knowledge
            </CardTitle>
            <CardDescription>
              Add a new Notion page to your knowledge base by providing the page ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pageId">Notion Page ID *</Label>
                <Input
                  id="pageId"
                  placeholder="Enter Notion page ID (e.g., 12345678-1234-1234-1234-123456789abc)"
                  value={newKnowledge.pageId}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, pageId: e.target.value }))}
                />
                <p className="text-xs text-gray-500">
                  You can find the page ID in the URL of your Notion page
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={newKnowledge.title}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this knowledge base contains..."
                value={newKnowledge.description}
                onChange={(e) => setNewKnowledge(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <Button 
              onClick={handleAddKnowledge}
              disabled={isAddingKnowledge || !newKnowledge.pageId.trim() || !newKnowledge.title.trim()}
              className="w-full md:w-auto"
            >
              {isAddingKnowledge ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Knowledge
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Input
            placeholder="Search knowledge bases by title, page ID, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Knowledge List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading knowledge bases...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No knowledge bases found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first knowledge base'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {item.title}
                            </h3>
                            {getStatusBadge(item.status)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              Page ID: {item.pageId}
                            </span>
                            {item.documentCount !== undefined && (
                              <span>{item.documentCount} documents</span>
                            )}
                            {item.wordCount !== undefined && (
                              <span>{item.wordCount.toLocaleString()} words</span>
                            )}
                          </div>
                          
                          {item.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Created: {item.createdAt.toLocaleDateString()}</span>
                            <span>Updated: {item.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Open Notion page in new tab
                              window.open(`https://notion.so/${item.pageId}`, '_blank');
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setItemToDelete(item);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Knowledge Base</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteKnowledge}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 