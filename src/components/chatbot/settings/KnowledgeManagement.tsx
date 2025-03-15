
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Upload, FileText, FilePlus, FileSearch, FileX } from "lucide-react";
import { useState } from "react";

type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
};

export const KnowledgeManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", name: "sales_data.pdf", type: "PDF", size: "2.3 MB", date: "2023-10-12" },
    { id: "2", name: "product_manual.docx", type: "DOCX", size: "1.5 MB", date: "2023-09-28" },
    { id: "3", name: "customer_feedback.csv", type: "CSV", size: "4.7 MB", date: "2023-11-05" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  
  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };
  
  const handleAddDocument = () => {
    if (newFileName.trim()) {
      const fileExtension = newFileName.split('.').pop() || "";
      const fileType = fileExtension.toUpperCase();
      
      const newDocument: Document = {
        id: Date.now().toString(),
        name: newFileName,
        type: fileType,
        size: "0.0 MB",
        date: new Date().toISOString().split('T')[0],
      };
      
      setDocuments([...documents, newDocument]);
      setNewFileName("");
      setOpenDialog(false);
    }
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-md font-semibold">Knowledge Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your RAG (Retrieval-Augmented Generation) documents
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <FileSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Enter the name of your document. You can upload the actual file later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  placeholder="document_name.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDocument}>
                Add Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-purple-600" />
                    {doc.name}
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <FileX className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="rounded-md border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Upload Documents</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Drag and drop your documents here, or click to browse files
          </p>
          <Button variant="outline">Browse Files</Button>
        </div>
      </div>
    </div>
  );
};
