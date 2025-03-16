import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Copy, X, Check } from "lucide-react";

interface EmbedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

export const EmbedModal = ({ open, onOpenChange, projectId, projectTitle }: EmbedModalProps) => {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  
  // Generate a unique ID for the chatbot
  const chatbotId = `${projectId}-${Math.random().toString(36).substring(2, 8)}`;
  
  // Embed code for iframe
  const embedCode = `<iframe
  src="http://localhost/chatbot/${chatbotId}"
  style="width: 100%; height: 100%; min-height: 700px"
  frameborder="0"
  allow="microphone">
</iframe>`;
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Options for embedding
  const options = [
    {
      id: 0,
      title: "Full page",
      image: (
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
          <div className="w-20 h-16 bg-white dark:bg-gray-700 rounded-md border flex flex-col p-1">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-sm mb-1"></div>
            <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Sidebar",
      image: (
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-end">
          <div className="w-8 h-20 bg-white dark:bg-gray-700 rounded-md border flex flex-col p-1">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-sm mb-1"></div>
            <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-600 rounded-sm"></div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Widget",
      image: (
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-end justify-end p-2">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Embed on website</DialogTitle>
            {/* <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X size={18} />
              </Button>
            </DialogClose> */}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Choose the way to embed chat app to your website
          </p>
        </DialogHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {options.map((option) => (
              <div 
                key={option.id}
                className={`cursor-pointer ${selectedOption === option.id ? 'ring-2 ring-purple-600 dark:ring-purple-500' : 'border border-gray-200 dark:border-gray-700'} rounded-md overflow-hidden`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="p-4">
                  {option.image}
                </div>
                <p className="text-sm text-center pb-2">{option.title}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <p className="text-sm mb-4">
              To add the chat app any where on your website, add this iframe to your html code.
            </p>
            
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                <code>{embedCode}</code>
              </pre>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={handleCopy}
              >
                {copiedCode ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 