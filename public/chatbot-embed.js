/**
 * Simple Chatbot Widget Embed Script
 * 
 * HOW TO USE:
 * 1. Add this script to your website:
 *    <script src="https://your-domain.com/chatbot-embed.js" id="chatbot-embed" data-chatbot-url="http://localhost:8080/app/2/preview"></script>
 * 
 * 2. Customize with data attributes:
 *    data-chatbot-url: URL of your chatbot (required)
 *    data-button-color: Color of the chat button (default: #7c3aed)
 *    data-button-size: Size of the chat button (default: 60px)
 *    data-position: Position of the widget (default: right, options: right, left)
 *    data-bottom-offset: Distance from bottom (default: 20px)
 *    data-side-offset: Distance from side (default: 20px)
 *    data-widget-width: Width of chat window (default: 350px)
 *    data-widget-height: Height of chat window (default: 600px)
 *    data-hide-on-mobile: Hide on mobile devices (default: false)
 */

(function() {
  // Get script element
  const scriptElement = document.getElementById('chatbot-embed');
  
  if (!scriptElement) {
    console.error('Chatbot embed script must have id="chatbot-embed"');
    return;
  }
  
  // Get configuration from data attributes
  const config = {
    chatbotUrl: scriptElement.getAttribute('data-chatbot-url'),
    buttonColor: scriptElement.getAttribute('data-button-color') || '#7c3aed',
    buttonSize: scriptElement.getAttribute('data-button-size') || '60px',
    position: scriptElement.getAttribute('data-position') || 'right',
    bottomOffset: scriptElement.getAttribute('data-bottom-offset') || '20px',
    sideOffset: scriptElement.getAttribute('data-side-offset') || '20px',
    widgetWidth: scriptElement.getAttribute('data-widget-width') || '350px',
    widgetHeight: scriptElement.getAttribute('data-widget-height') || '600px',
    hideOnMobile: scriptElement.getAttribute('data-hide-on-mobile') === 'true',
    buttonIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };
  
  // Validate required configuration
  if (!config.chatbotUrl) {
    console.error('Chatbot URL is required. Add data-chatbot-url attribute to the script tag.');
    return;
  }
  
  // Check if we should hide on mobile
  if (config.hideOnMobile && window.innerWidth < 768) {
    return;
  }
  
  // Create styles
  const styles = document.createElement('style');
  styles.innerHTML = `
    .chatbot-widget-container {
      position: fixed;
      bottom: ${config.bottomOffset};
      ${config.position}: ${config.sideOffset};
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .chatbot-widget-button {
      width: ${config.buttonSize};
      height: ${config.buttonSize};
      border-radius: 50%;
      background-color: ${config.buttonColor};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .chatbot-widget-button:hover {
      transform: scale(1.05);
    }
    
    .chatbot-widget-iframe-container {
      position: absolute;
      bottom: calc(${config.buttonSize} + 10px);
      ${config.position}: 0;
      width: ${config.widgetWidth};
      height: ${config.widgetHeight};
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
    
    .chatbot-widget-iframe-container.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    
    .chatbot-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    @media (max-width: 768px) {
      .chatbot-widget-iframe-container {
        width: calc(100vw - 40px);
        ${config.position}: -${config.sideOffset};
        max-width: ${config.widgetWidth};
      }
    }
  `;
  document.head.appendChild(styles);

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.className = 'chatbot-widget-container';

  // Create chat button
  const chatButton = document.createElement('div');
  chatButton.className = 'chatbot-widget-button';
  chatButton.innerHTML = config.buttonIcon;
  
  // Create iframe container
  const iframeContainer = document.createElement('div');
  iframeContainer.className = 'chatbot-widget-iframe-container';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.className = 'chatbot-widget-iframe';
  iframe.src = config.chatbotUrl;
  iframe.allow = 'microphone';
  iframe.title = 'Chat Widget';
  
  // Append elements
  iframeContainer.appendChild(iframe);
  widgetContainer.appendChild(iframeContainer);
  widgetContainer.appendChild(chatButton);
  document.body.appendChild(widgetContainer);
  
  // Toggle chat window
  let isOpen = false;
  chatButton.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframeContainer.classList.add('active');
    } else {
      iframeContainer.classList.remove('active');
    }
  });
  
  // Close chat when clicking outside
  document.addEventListener('click', (event) => {
    if (isOpen && !widgetContainer.contains(event.target)) {
      isOpen = false;
      iframeContainer.classList.remove('active');
    }
  });
  
  // Expose API
  window.ChatbotWidget = {
    open: () => {
      isOpen = true;
      iframeContainer.classList.add('active');
    },
    close: () => {
      isOpen = false;
      iframeContainer.classList.remove('active');
    },
    toggle: () => {
      chatButton.click();
    }
  };
})(); 