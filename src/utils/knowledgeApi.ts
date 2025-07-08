// Mock API for Knowledge Management
// In a real application, this would be replaced with actual API calls

export interface KnowledgeItem {
  id: string;
  pageId: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'processing';
  createdAt: Date;
  updatedAt: Date;
  documentCount?: number;
  wordCount?: number;
}

// Mock data storage
let mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    pageId: 'notion-page-1',
    title: 'Employee Handbook',
    description: 'Company policies and procedures for employees',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    documentCount: 5,
    wordCount: 2500
  },
  {
    id: '2',
    pageId: 'notion-page-2',
    title: 'Product Documentation',
    description: 'Technical documentation for our products',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    documentCount: 3,
    wordCount: 1800
  },
  {
    id: '3',
    pageId: 'notion-page-3',
    title: 'Customer Support Guide',
    description: 'FAQ and troubleshooting guides',
    status: 'processing',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    documentCount: 0,
    wordCount: 0
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all knowledge items
export const getKnowledgeItems = async (): Promise<KnowledgeItem[]> => {
  await delay(500); // Simulate network delay
  return [...mockKnowledgeItems];
};

// Add new knowledge item
export const addKnowledgeItem = async (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeItem> => {
  await delay(800); // Simulate processing time
  
  const newItem: KnowledgeItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockKnowledgeItems.unshift(newItem);
  return newItem;
};

// Delete knowledge item
export const deleteKnowledgeItem = async (id: string): Promise<boolean> => {
  await delay(300);
  
  const index = mockKnowledgeItems.findIndex(item => item.id === id);
  if (index !== -1) {
    mockKnowledgeItems.splice(index, 1);
    return true;
  }
  return false;
};

// Update knowledge item
export const updateKnowledgeItem = async (id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem | null> => {
  await delay(500);
  
  const index = mockKnowledgeItems.findIndex(item => item.id === id);
  if (index !== -1) {
    mockKnowledgeItems[index] = {
      ...mockKnowledgeItems[index],
      ...updates,
      updatedAt: new Date()
    };
    return mockKnowledgeItems[index];
  }
  return null;
};

// Validate Notion page ID format
export const validateNotionPageId = (pageId: string): boolean => {
  // Basic validation for Notion page ID format
  // Notion page IDs are typically 32 characters long and contain alphanumeric characters and hyphens
  const notionPageIdRegex = /^[a-zA-Z0-9-]{20,}$/;
  return notionPageIdRegex.test(pageId);
};

// Simulate processing status updates
export const simulateProcessing = async (id: string): Promise<void> => {
  // Simulate the processing of a knowledge item
  await delay(2000);
  
  const item = mockKnowledgeItems.find(item => item.id === id);
  if (item && item.status === 'processing') {
    await updateKnowledgeItem(id, {
      status: 'active',
      documentCount: Math.floor(Math.random() * 10) + 1,
      wordCount: Math.floor(Math.random() * 5000) + 500
    });
  }
}; 