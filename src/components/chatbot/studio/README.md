# Studio Components

This document provides detailed information about the Studio components in the AI Chatbot application. These components are responsible for creating, configuring, and previewing chatbot projects.

## Overview

The Studio section allows users to:
1. Create and manage chatbot projects
2. Configure project settings, instructions, and context
3. Preview chatbots in action
4. Get embed code for integrating chatbots into websites

## Components

### `Studio.tsx`

The main component for the Studio page, displaying a list of projects.

**Props:**
```typescript
interface StudioProps {
  onProjectClick: (projectId: string) => void;
}
```

**Key Features:**
- Project listing with filtering by type (chatbot, agent, workflow)
- Search functionality for finding projects
- Project creation with different templates
- Responsive grid layout for project cards

**Example:**
```jsx
<Studio onProjectClick={(projectId) => navigate(`/app/${projectId}`)} />
```

**Internal State:**
- `activeTab`: Tracks the currently selected project type filter
- `searchQuery`: Stores the current search term
- `projects`: Array of project data (typically would come from an API)

### `ProjectConfig.tsx`

Component for configuring a chatbot project.

**Props:**
```typescript
interface ProjectConfigProps {
  projectId: string;
  onBack: () => void;
}
```

**Key Features:**
- Project title and description editing
- Instructions configuration for the chatbot
- Context management for providing background information
- Publishing options with embed functionality
- Model selection for the chatbot

**Example:**
```jsx
<ProjectConfig 
  projectId="project-123"
  onBack={() => navigate('/apps')}
/>
```

**Internal State:**
- `project`: Object containing all project configuration
- `activeTab`: Tracks the currently selected configuration tab
- `instructions`: Text content for the chatbot instructions
- `context`: Text content for the chatbot context
- `embedModalOpen`: Controls the visibility of the embed modal

**Usage Notes:**
- The "Publish" button provides options for running the app, embedding, and sharing
- Changes are automatically saved (in a real implementation, this would call an API)
- The back button returns to the Studio project list

### `AppPreview.tsx`

Component for previewing a chatbot application.

**Props:**
```typescript
interface AppPreviewProps {
  projectId: string;
}
```

**Key Features:**
- Live preview of the chatbot in action
- Test conversation functionality
- User and bot message display with proper styling
- Loading indicator during bot "thinking"
- Citations display for referenced information

**Example:**
```jsx
<AppPreview projectId="project-123" />
```

**Internal State:**
- `messages`: Array of chat messages in the current conversation
- `inputValue`: Current value of the chat input
- `isLoading`: Boolean indicating if the bot is "thinking"

**Usage Notes:**
- This component simulates a real chatbot conversation
- In a production environment, it would connect to an actual AI backend
- The interface mimics the final embedded chatbot experience

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

**Key Features:**
- Multiple embedding options:
  - Full page: Displays the chatbot as a full-page website
  - Sidebar: Displays the chatbot as a sidebar on the right
  - Widget: Displays the chatbot as a floating button in the corner
- Code snippets for each option
- Copy to clipboard functionality
- Visual examples of each embedding style

**Example:**
```jsx
<EmbedModal 
  open={embedModalOpen}
  onOpenChange={setEmbedModalOpen}
  projectId="project-123"
  projectTitle="Customer Support Bot"
/>
```

**Internal State:**
- `selectedOption`: Tracks the currently selected embedding option (0, 1, or 2)
- `copiedCode`: Boolean indicating if code has been copied to clipboard
- `widgetOption`: For widget embedding, tracks whether to use external or inline script

**Usage Notes:**
- The "Copy" button copies the code snippet to the clipboard
- For the widget option, there are two sub-options:
  - External script: References an external JS file
  - Inline script: Includes all code directly in the HTML

## Component Relationships

```
Studio
└── (click on project) → ProjectConfig
    ├── (click "Run App") → AppPreview
    └── (click "Embed Into Site") → EmbedModal
```

## Best Practices

1. **Project Configuration**: When configuring a project in `ProjectConfig.tsx`, provide clear instructions and context to improve the chatbot's responses.

2. **Testing**: Use the `AppPreview.tsx` component to thoroughly test your chatbot before publishing.

3. **Embedding**: Choose the appropriate embedding option based on your website's needs:
   - Full page: For dedicated chatbot pages
   - Sidebar: For persistent help alongside content
   - Widget: For non-intrusive assistance available on demand

4. **Customization**: When embedding, use the provided data attributes to customize the appearance and behavior of the chatbot.

5. **Mobile Considerations**: Remember that the widget option is mobile-friendly by default, automatically adjusting its size on smaller screens.

## Example Workflow

1. Create a new project in the Studio
2. Configure the project with appropriate instructions and context
3. Test the chatbot using the AppPreview
4. Publish the chatbot and get the embed code
5. Integrate the chatbot into your website using the provided code

## API Integration

In a production environment, these components would interact with backend APIs for:
- Saving project configuration
- Processing chat messages with an AI model
- Managing knowledge sources
- Tracking usage analytics

The current implementation uses mock data and simulated responses for demonstration purposes. 