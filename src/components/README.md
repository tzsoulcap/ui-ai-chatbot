# Components Documentation

This document provides an overview of the components used in the AI Chatbot application. It serves as a guide for developers to understand the structure and usage of each component.

## Table of Contents

1. [Chatbot Components](#chatbot-components)
   - [Main Components](#main-components)
   - [Studio Components](#studio-components)
   - [Knowledge Components](#knowledge-components)
   - [Settings Components](#settings-components)
2. [Component Usage Guidelines](#component-usage-guidelines)
3. [Component Hierarchy](#component-hierarchy)

## Chatbot Components

### Main Components

#### `ChatContainer.tsx`

The main container component that orchestrates the entire chatbot interface.

**Props**: None (uses internal state and React Router)

**Usage**:
```jsx
<ChatContainer />
```

**Features**:
- Manages chat history and messages
- Handles navigation between different views (Chat, Studio, Knowledge)
- Controls sidebar visibility
- Manages settings panel

#### `Navbar.tsx`

Navigation bar component that appears at the top of the application.

**Props**:
```typescript
interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isStudioActive?: boolean;
  isKnowledgeActive?: boolean;
}
```

**Usage**:
```jsx
<Navbar 
  sidebarOpen={sidebarOpen} 
  toggleSidebar={toggleSidebar}
  isStudioActive={true}
  isKnowledgeActive={false}
/>
```

#### `Header.tsx`

Header component that displays the title and actions for the current view.

**Props**:
```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

**Usage**:
```jsx
<Header 
  title="AI Chatbot" 
  subtitle="Powered by Claude" 
  actions={<Button>New Chat</Button>}
/>
```

#### `Sidebar.tsx`

Sidebar component that displays chat history and other navigation options.

**Props**:
```typescript
interface SidebarProps {
  chatHistory: ChatHistoryItem[];
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
}
```

**Usage**:
```jsx
<Sidebar 
  chatHistory={chatHistory}
  onChatSelect={handleChatSelect}
  onNewChat={handleNewChat}
  isOpen={sidebarOpen}
/>
```

#### `ChatMessage.tsx`

Component for rendering individual chat messages.

**Props**:
```typescript
interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}
```

**Usage**:
```jsx
<ChatMessage 
  message={message}
  isLastMessage={index === messages.length - 1}
/>
```

#### `ChatInput.tsx`

Input component for sending messages to the chatbot.

**Props**:
```typescript
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}
```

**Usage**:
```jsx
<ChatInput 
  onSendMessage={handleSendMessage}
  disabled={isLoading}
/>
```

#### `LoadingIndicator.tsx`

Component that displays a loading animation while waiting for a response.

**Props**:
```typescript
interface LoadingIndicatorProps {
  text?: string;
}
```

**Usage**:
```jsx
<LoadingIndicator text="AI is thinking..." />
```

#### `WelcomeScreen.tsx`

Welcome screen component displayed when no chat is active.

**Props**:
```typescript
interface WelcomeScreenProps {
  onNewChat: () => void;
}
```

**Usage**:
```jsx
<WelcomeScreen onNewChat={handleNewChat} />
```

#### `ModelSelector.tsx`

Component for selecting the AI model to use for the chat.

**Props**:
```typescript
interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}
```

**Usage**:
```jsx
<ModelSelector 
  selectedModel={model}
  onModelChange={handleModelChange}
/>
```

### Studio Components

#### `Studio.tsx`

Main component for the Studio page, displaying a list of projects.

**Props**:
```typescript
interface StudioProps {
  onProjectClick: (projectId: string) => void;
}
```

**Usage**:
```jsx
<Studio onProjectClick={handleProjectClick} />
```

#### `ProjectConfig.tsx`

Component for configuring a chatbot project.

**Props**:
```typescript
interface ProjectConfigProps {
  projectId: string;
  onBack: () => void;
}
```

**Usage**:
```jsx
<ProjectConfig 
  projectId="project-123"
  onBack={handleBackToStudio}
/>
```

#### `AppPreview.tsx`

Component for previewing a chatbot application.

**Props**:
```typescript
interface AppPreviewProps {
  projectId: string;
}
```

**Usage**:
```jsx
<AppPreview projectId="project-123" />
```

#### `EmbedModal.tsx`

Modal component for displaying embed options for a chatbot.

**Props**:
```typescript
interface EmbedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}
```

**Usage**:
```jsx
<EmbedModal 
  open={embedModalOpen}
  onOpenChange={setEmbedModalOpen}
  projectId="project-123"
  projectTitle="Customer Support Bot"
/>
```

### Knowledge Components

#### `KnowledgeManager.tsx`

Component for managing knowledge documents for the chatbot.

**Props**: None (uses internal state)

**Usage**:
```jsx
<KnowledgeManager />
```

### Settings Components

#### `SettingsSidebar.tsx`

Sidebar component for configuring chatbot settings.

**Props**:
```typescript
interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Usage**:
```jsx
<SettingsSidebar 
  isOpen={settingsOpen}
  onClose={handleCloseSettings}
/>
```

## Component Usage Guidelines

1. **Component Composition**: Always use components in their intended hierarchy. For example, `ChatMessage` components should be used within a `ChatContainer`.

2. **State Management**: Most components manage their own state, but some require props for configuration. Make sure to provide all required props.

3. **Styling**: Components use Tailwind CSS for styling. Custom styles can be added through className props.

4. **Responsiveness**: All components are designed to be responsive. No additional configuration is needed for mobile views.

5. **Accessibility**: Components include appropriate ARIA attributes. Ensure these are preserved when customizing components.

## Component Hierarchy

```
ChatContainer
├── Navbar
├── Header
├── Sidebar
│   └── ChatHistoryItem(s)
├── ChatMessage(s)
├── ChatInput
├── LoadingIndicator
├── WelcomeScreen
├── ModelSelector
├── SettingsSidebar
├── Studio
│   └── ProjectConfig
│       ├── AppPreview
│       └── EmbedModal
└── KnowledgeManager
```

This hierarchy represents the typical nesting of components in the application. Some components (like Studio and KnowledgeManager) are rendered conditionally based on the current view. 