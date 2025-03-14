# AI Chatbot UI

A modern, responsive UI for an AI chatbot inspired by ChatGPT, built with React, TypeScript, and Tailwind CSS. The UI features a purple and white color theme.

## Features

- Clean, modern interface inspired by ChatGPT
- Purple and white color theme
- Responsive design that works on desktop and mobile
- Real-time chat with typing indicators
- Code block formatting with syntax highlighting
- Copy code functionality
- Chat history sidebar
- Dark mode support
- Animated message transitions
- Suggestion buttons for quick prompts

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Lucide React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ui-ai-chatbot
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `src/pages/Index.tsx` - Main chatbot interface
- `src/styles/chatbot.css` - Custom CSS for the chatbot
- `src/components/ui/` - Reusable UI components

## Customization

### Changing Colors

The UI uses a purple and white color theme. You can modify the colors by:

1. Editing the Tailwind classes in `src/pages/Index.tsx`
2. Modifying the CSS variables in `src/styles/chatbot.css`

### Adding Features

To extend the chatbot functionality:

1. Implement actual API calls to an AI service in the `handleSendMessage` function
2. Add authentication if needed
3. Implement persistent chat history storage

## License

[MIT](LICENSE)

## Acknowledgements

- Design inspired by ChatGPT
- Icons from [Lucide React](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
