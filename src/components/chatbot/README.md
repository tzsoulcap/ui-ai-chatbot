# Chatbot Components

This document provides detailed information about the chatbot components in the AI Chatbot application. These components are responsible for the core functionality of the chatbot interface.

## Main Components

### `ChatContainer.tsx`

The main container component that orchestrates the entire chatbot interface.

**Key Features:**
- Manages chat history and active conversations
- Handles message sending and receiving
- Controls navigation between different views (Chat, Studio, Knowledge)
- Manages sidebar and settings panel visibility

**State Management:**
- `messages`: Array of chat messages in the current conversation
- `chatHistory`: Array of previous chat sessions
- `sidebarOpen`: Boolean to control sidebar visibility
- `settingsOpen`: Boolean to control settings panel visibility

**Example:**
```jsx
// In router.tsx or App.tsx
<ChatContainer />
```

### `Navbar.tsx`

Navigation bar component that appears at the top of the application.

**Props:**
```typescript
interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isStudioActive?: boolean;
  isKnowledgeActive?: boolean;
}
```

**Usage Notes:**
- Use `isStudioActive` and `isKnowledgeActive` to highlight the active section
- The component uses React Router's `Link` for navigation

**Example:**
```jsx
<Navbar 
  sidebarOpen={sidebarOpen} 
  toggleSidebar={toggleSidebar}
  isStudioActive={true}
  isKnowledgeActive={false}
/>
```

### `Header.tsx`

Header component that displays the title and actions for the current view.

**Props:**
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

**Example:**
```jsx
<Header 
  title="AI Chatbot" 
  subtitle="Powered by Claude" 
  actions={
    <Button variant="outline" onClick={handleNewChat}>
      New Chat
    </Button>
  }
/>
```

### `Sidebar.tsx`

Sidebar component that displays chat history and other navigation options.

**Props:**
```typescript
interface SidebarProps {
  chatHistory: ChatHistoryItem[];
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
}
```

**Example:**
```jsx
<Sidebar 
  chatHistory={chatHistory}
  onChatSelect={handleChatSelect}
  onNewChat={handleNewChat}
  isOpen={sidebarOpen}
/>
```

### `ChatMessage.tsx`

Component for rendering individual chat messages.

**Props:**
```typescript
interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}
```

**Message Interface:**
```typescript
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

interface Citation {
  text: string;
  source: string;
}
```

**Example:**
```jsx
<ChatMessage 
  message={{
    id: "msg1",
    role: "assistant",
    content: "Hello! How can I help you today?",
    timestamp: new Date(),
    citations: [
      { text: "Company policy", source: "Employee Handbook p.42" }
    ]
  }}
  isLastMessage={true}
/>
```

### `ChatInput.tsx`

Input component for sending messages to the chatbot.

**Props:**
```typescript
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}
```

**Features:**
- Text input with send button
- Handles Enter key for sending messages
- Disabled state during loading

**Example:**
```jsx
<ChatInput 
  onSendMessage={handleSendMessage}
  disabled={isLoading}
/>
```

### `LoadingIndicator.tsx`

Component that displays a loading animation while waiting for a response.

**Props:**
```typescript
interface LoadingIndicatorProps {
  text?: string;
}
```

**Example:**
```jsx
<LoadingIndicator text="AI is thinking..." />
```

### `WelcomeScreen.tsx`

Welcome screen component displayed when no chat is active.

**Props:**
```typescript
interface WelcomeScreenProps {
  onNewChat: () => void;
}
```

**Example:**
```jsx
<WelcomeScreen onNewChat={handleNewChat} />
```

### `ModelSelector.tsx`

Component for selecting the AI model to use for the chat.

**Props:**
```typescript
interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}
```

**Example:**
```jsx
<ModelSelector 
  selectedModel="claude-3-opus"
  onModelChange={handleModelChange}
/>
```

## Studio Components

The Studio components are located in the `chatbot/studio` directory and are used for creating and managing chatbot projects.

### `Studio.tsx`

Main component for the Studio page, displaying a list of projects.

**Props:**
```typescript
interface StudioProps {
  onProjectClick: (projectId: string) => void;
}
```

**Features:**
- Project listing with filtering by type
- Search functionality
- Project creation

**Example:**
```jsx
<Studio onProjectClick={handleProjectClick} />
```

### `ProjectConfig.tsx`

Component for configuring a chatbot project.

**Props:**
```typescript
interface ProjectConfigProps {
  projectId: string;
  onBack: () => void;
}
```

**Features:**
- Project title and description editing
- Instructions configuration
- Context management
- Publishing options

**Example:**
```jsx
<ProjectConfig 
  projectId="project-123"
  onBack={handleBackToStudio}
/>
```

### `AppPreview.tsx`

Component for previewing a chatbot application.

**Props:**
```typescript
interface AppPreviewProps {
  projectId: string;
}
```

**Features:**
- Live preview of the chatbot
- Test conversation functionality
- User and bot message display

**Example:**
```jsx
<AppPreview projectId="project-123" />
```

### `EmbedModal.tsx`

Modal component for displaying embed options for a chatbot.

**Props:**
```typescript
interface EmbedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}
```

**Features:**
- Multiple embedding options (full page, sidebar, widget)
- Code snippets for each option
- Copy to clipboard functionality

**Example:**
```jsx
<EmbedModal 
  open={embedModalOpen}
  onOpenChange={setEmbedModalOpen}
  projectId="project-123"
  projectTitle="Customer Support Bot"
/>
```

## Knowledge Components

The Knowledge components are located in the `chatbot/knowledge` directory and are used for managing knowledge documents for the chatbot.

### `KnowledgeManager.tsx`

Component for managing knowledge documents for the chatbot.

**Features:**
- Document listing and search
- Document upload
- Document linking to chatbot projects
- Document metadata display

**Example:**
```jsx
<KnowledgeManager />
```

## Settings Components

The Settings components are located in the `chatbot/settings` directory and are used for configuring chatbot settings.

### `SettingsSidebar.tsx`

Sidebar component for configuring chatbot settings.

**Props:**
```typescript
interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Features:**
- Model selection
- Theme configuration
- API key management
- Language settings

**Example:**
```jsx
<SettingsSidebar 
  isOpen={settingsOpen}
  onClose={handleCloseSettings}
/>
```

## Best Practices

1. **Component Composition**: Always use components in their intended hierarchy. For example, `ChatMessage` components should be used within a `ChatContainer`.

2. **State Management**: Most components manage their own state, but some require props for configuration. Make sure to provide all required props.

3. **Error Handling**: Implement proper error handling for API calls and user interactions.

4. **Accessibility**: Ensure all components are accessible by using appropriate ARIA attributes and keyboard navigation.

5. **Responsive Design**: Test components on different screen sizes to ensure they are responsive.

6. **Performance**: Avoid unnecessary re-renders by using React.memo or useMemo where appropriate.

7. **Styling**: Use the provided Tailwind CSS classes for consistent styling. Custom styles can be added through className props. 