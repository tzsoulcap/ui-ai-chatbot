/**
 * Advanced Chatbot Widget Embed Script
 * Version: 2.0.1 (Production ready - console.log removed)
 * 
 * HOW TO USE:
 * 1. Add this script to your website:
 *    <script src="https://your-domain.com/chatbot-widget.js" id="chatbot-widget" data-api-url="http://192.168.50.119:5678/webhook" data-user-id="38137"></script>
 * 
 * 2. Customize with data attributes:
 *    data-api-url: Base URL for API endpoints (required)
 *    data-user-id: User ID for API calls (optional - see multiple ways below)
 *    data-button-color: Color of the chat button (default: #7c3aed)
 *    data-button-size: Size of the chat button (default: 60px)
 *    data-position: Position of the widget (default: right, options: right, left)
 *    data-bottom-offset: Distance from bottom (default: 20px)
 *    data-side-offset: Distance from side (default: 20px)
 *    data-widget-width: Width of chat window (default: 400px)
 *    data-widget-height: Height of chat window (default: 600px)
 *    data-hide-on-mobile: Hide on mobile devices (default: false)
 *    data-notion-rag: Enable Notion RAG by default (default: false) - DEPRECATED, use data-chat-mode instead
 *    data-chat-mode: Set default chat mode (default: database, options: manual, database, document)
 * 
 * MULTIPLE WAYS TO SET USER ID (in order of priority and security):
 * 1. data-user-id attribute (highest priority, secure for server-side rendering)
 * 2. localStorage: chatbot_user_id, user_id, or uid (secure, persistent)
 * 3. sessionStorage: chatbot_user_id, user_id, or uid (secure, session-only)
 * 4. Global variable: window.CHATBOT_USER_ID (secure if set before script load)
 * 5. Meta tag: <meta name="chatbot-user-id" content="123"> (secure for server-side rendering)
 * 6. postMessage API: window.postMessage({type: 'SET_USER_ID', userId: '123'}, '*') (secure)
 * 7. JavaScript API: window.ChatbotWidget.setUserId('123') (secure)
 * 8. URL parameters: ?userId=123 (NOT SECURE - requires data-allow-url-params="true")
 * 
 * EXAMPLES:
 * 
 * SECURE METHODS (Recommended):
 * 
 * localStorage (persistent across sessions):
 * localStorage.setItem('chatbot_user_id', '38137');
 * 
 * sessionStorage (cleared when tab closes):
 * sessionStorage.setItem('chatbot_user_id', '38137');
 * 
 * Global Variable (set before script loads):
 * window.CHATBOT_USER_ID = '38137';
 * 
 * Meta Tag (server-side rendering):
 * <meta name="chatbot-user-id" content="38137">
 * 
 * postMessage API (dynamic):
 * window.postMessage({type: 'SET_USER_ID', userId: '38137'}, '*');
 * 
 * JavaScript API (dynamic):
 * window.ChatbotWidget.setUserId('38137');
 * 
 * NOT SECURE (Development/Testing only):
 * URL Parameters (requires data-allow-url-params="true"):
 * https://yoursite.com?userId=38137
 * 
 * SECURITY WARNING: URL parameters are visible in:
 * - Browser history
 * - Server logs
 * - Referrer headers
 * - Network inspection tools
 * - Browser developer tools
 * 
 * Set Multiple Config:
 * window.postMessage({
 *   type: 'SET_CONFIG', 
 *   config: {
 *     userId: '38137',
 *     buttonColor: '#ff0000',
 *     position: 'left'
 *   }
 * }, '*');
 * 
 * Or via JavaScript API:
 * window.ChatbotWidget.setConfig({
 *   userId: '38137',
 *   buttonColor: '#ff0000',
 *   position: 'left'
 * });
 * 
 * CHAT MODE API:
 * window.ChatbotWidget.setChatMode('manual'); // 'manual', 'database', 'document'
 * window.ChatbotWidget.getChatMode(); // Returns current chat mode
 * 
 * DOCUMENT MODE:
 * - Requires PDF file upload before sending message
 * - Sends data to: /webhook-test/ask-docs
 * - Data includes: chatInput, user_id, conversation_id, file, file_type
 */

(function() {
  'use strict';

  // Get script element
  const scriptElement = document.getElementById('chatbot-widget');
  
  if (!scriptElement) {
    console.error('Chatbot widget script must have id="chatbot-widget"');
    return;
  }
  
  // Get configuration from data attributes
  const config = {
    apiUrl: scriptElement.getAttribute('data-api-url'),
    userId: null, // Will be determined by multiple methods
    buttonColor: scriptElement.getAttribute('data-button-color') || '#7c3aed',
    buttonSize: scriptElement.getAttribute('data-button-size') || '60px',
    position: scriptElement.getAttribute('data-position') || 'right',
    bottomOffset: scriptElement.getAttribute('data-bottom-offset') || '20px',
    sideOffset: scriptElement.getAttribute('data-side-offset') || '20px',
    widgetWidth: scriptElement.getAttribute('data-widget-width') || '400px',
    widgetHeight: scriptElement.getAttribute('data-widget-height') || '600px',
    hideOnMobile: scriptElement.getAttribute('data-hide-on-mobile') === 'true',
    notionRag: scriptElement.getAttribute('data-notion-rag') === 'true',
    defaultChatMode: scriptElement.getAttribute('data-chat-mode') || 'document',
    buttonIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    closeIcon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    sendIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };
  
  // Function to get userId from multiple sources
  const getUserId = () => {
    // 1. Check data attribute first (highest priority)
    let userId = scriptElement.getAttribute('data-user-id');
    
    if (userId) {
      // console.log('User ID from data attribute:', userId);
      return userId;
    }
    
    // 2. Check localStorage (more secure than URL params)
    userId = localStorage.getItem('chatbot_user_id') || 
             localStorage.getItem('user_id') || 
             localStorage.getItem('uid');
    
    if (userId) {
      // console.log('User ID from localStorage:', userId);
      return userId;
    }
    
    // 3. Check sessionStorage (more secure than URL params)
    userId = sessionStorage.getItem('chatbot_user_id') || 
             sessionStorage.getItem('user_id') || 
             sessionStorage.getItem('uid');
    
    if (userId) {
      // console.log('User ID from sessionStorage:', userId);
      return userId;
    }
    
    // 4. Check global variable
    if (window.CHATBOT_USER_ID) {
      // console.log('User ID from global variable:', window.CHATBOT_USER_ID);
      return window.CHATBOT_USER_ID;
    }
    
    // 5. Check meta tag
    const metaTag = document.querySelector('meta[name="chatbot-user-id"]');
    if (metaTag && metaTag.getAttribute('content')) {
      // console.log('User ID from meta tag:', metaTag.getAttribute('content'));
      return metaTag.getAttribute('content');
    }
    
    // 6. Check URL parameters (least secure - only if explicitly enabled)
    const allowUrlParams = scriptElement.getAttribute('data-allow-url-params') === 'true';
    if (allowUrlParams) {
      const urlParams = new URLSearchParams(window.location.search);
      userId = urlParams.get('userId') || urlParams.get('user_id') || urlParams.get('uid');
      
      if (userId) {
        console.warn('⚠️ SECURITY WARNING: User ID from URL parameters is not secure!');
        console.warn('URL parameters can be seen in browser history, logs, and referrer headers.');
        console.warn('Consider using localStorage, sessionStorage, or server-side authentication instead.');
        // console.log('User ID from URL parameters:', userId);
        return userId;
      }
    } else {
      // Check if URL params exist but are disabled
      const urlParams = new URLSearchParams(window.location.search);
      const hasUrlParams = urlParams.get('userId') || urlParams.get('user_id') || urlParams.get('uid');
      if (hasUrlParams) {
        console.warn('⚠️ URL parameters for userId are disabled for security reasons.');
        console.warn('To enable URL parameters, add data-allow-url-params="true" to the script tag.');
        console.warn('However, this is NOT RECOMMENDED for production use.');
      }
    }
    
    return null;
  };
  
  // Set userId from multiple sources
  config.userId = getUserId();
  
  // Validate required configuration
  if (!config.apiUrl) {
    console.error('API URL is required. Add data-api-url attribute to the script tag.');
    return;
  }
  
  if (!config.userId) {
    console.warn('⚠️ No User ID found. Widget will wait for userId via postMessage or API call.');
    console.warn('You can set userId via:');
    console.warn('- data-user-id attribute');
    console.warn('- localStorage.setItem("chatbot_user_id", "your-id")');
    console.warn('- window.postMessage({type: "SET_USER_ID", userId: "your-id"}, "*")');
    console.warn('- window.ChatbotWidget.setUserId("your-id")');
    
    // Don't return, let the widget load and wait for userId
    // The widget will show a message asking for userId when user tries to send a message
  }
  
  // Check if we should hide on mobile
  if (config.hideOnMobile && window.innerWidth < 768) {
    return;
  }

  // State management
  let isOpen = false;
  let messages = [];
  let chatHistory = [];
  let activeChat = null;
  let isLoading = false;
  let chatMode = config.defaultChatMode; // 'manual', 'database', 'document'
  let inputValue = '';
  let isHistoryView = false;

  // PostMessage handler
  const handlePostMessage = (event) => {
    // Handle ERROR_MESSAGE from main-app
    if (event.data && event.data.source === 'main-app' && event.data.type === 'ERROR_MESSAGE') {
      const errorData = event.data.data;
      
      // เปิด widget ถ้ายังไม่ได้เปิด
      if (!isOpen) {
        isOpen = true;
        chatWindow.classList.add('active');
        if (messages.length === 0) {
          showWelcome();
        }
      }
      
      // ใส่ข้อความ error ใน input
      textarea.value = `System Error: ${errorData.message}`;
      resizeTextarea();
      updateSendButton();
      
      // แสดง notification หรือ highlight input
      textarea.style.borderColor = '#ef4444';
      textarea.style.backgroundColor = '#fef2f2';
      
      // กลับเป็นปกติหลังจาก 3 วินาที
      setTimeout(() => {
        textarea.style.borderColor = '';
        textarea.style.backgroundColor = '';
      }, 3000);
      
      // Focus ที่ input
      textarea.focus();
    }
    
    // Handle SET_USER_ID message
    if (event.data && event.data.type === 'SET_USER_ID') {
      const newUserId = event.data.userId;
      if (newUserId) {
        config.userId = newUserId;
        // console.log('User ID updated via postMessage:', newUserId);
        
        // Store in localStorage for persistence
        localStorage.setItem('chatbot_user_id', newUserId);
        
        // If widget was waiting for userId, now it can work properly
        if (messages.length === 0 && isOpen) {
          showWelcome();
        }
      }
    }
    
    // Handle SET_CONFIG message for multiple settings
    if (event.data && event.data.type === 'SET_CONFIG') {
      const newConfig = event.data.config;
      if (newConfig) {
        // Update config with new values
        Object.keys(newConfig).forEach(key => {
          if (config.hasOwnProperty(key)) {
            config[key] = newConfig[key];
            // console.log(`Config updated: ${key} = ${newConfig[key]}`);
          }
        });
        
        // Store userId in localStorage if provided
        if (newConfig.userId) {
          localStorage.setItem('chatbot_user_id', newConfig.userId);
        }
      }
    }
    
  };

  // API functions
  const api = {
    async fetchChatHistory() {
      try {
        const response = await fetch(`${config.apiUrl}/conversations?user_id=${config.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          mode: 'cors'
        });
        if (!response.ok) throw new Error('Failed to fetch chat history');
        return await response.json();
      } catch (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }
    },

    async fetchConversationMessages(chatId) {
      try {
        const response = await fetch(`${config.apiUrl}/15c00507-b7de-41d8-97ca-d6e5174c2a98/conversations/${chatId}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          mode: 'cors'
        });
        if (!response.ok) throw new Error('Failed to fetch conversation messages');
        return await response.json();
      } catch (error) {
        console.error('Error fetching conversation messages:', error);
        return [];
      }
    },

    async createConversation(title) {
      try {
        const response = await fetch(`${config.apiUrl}/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          mode: 'cors',
          body: JSON.stringify({ title, user_id: config.userId }),
        });
        if (!response.ok) throw new Error('Failed to create conversation');
        return await response.json();
      } catch (error) {
        console.error('Error creating conversation:', error);
        return null;
      }
    },

    async sendMessage(chatInput, conversationId) {
      try {
        let endpoint = 'ask-view';
        let requestBody = { 
          chatInput, 
          user_id: config.userId, 
          conversation_id: conversationId 
        };

        if (chatMode === 'manual') {
          endpoint = 'ask-notion';
        } else if (chatMode === 'database') {
          endpoint = 'ask-view';
        } else if (chatMode === 'document') {
          endpoint = 'ask-docs';
          
          // Get uploaded file
          const uploadedFile = fileInput.files[0];
          if (uploadedFile) {
            // console.log('Uploading file:', uploadedFile.name, 'Size:', uploadedFile.size);
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('chatInput', chatInput);
            formData.append('user_id', config.userId);
            formData.append('conversation_id', conversationId);
            formData.append('file', uploadedFile);
            formData.append('file_type', 'pdf');
            
            // console.log('Sending to endpoint:', `http://192.168.50.119:5678/webhook/${endpoint}`);
            
            let response;
            try {
              // Try the direct endpoint first
              response = await fetch(`http://192.168.50.119:5678/webhook/${endpoint}`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json'
                },
                mode: 'cors',
                body: formData
              });
            } catch (error) {
              console.warn('Direct endpoint failed, trying with config.apiUrl:', error);
              // Fallback to using config.apiUrl
              response = await fetch(`${config.apiUrl}/webhook/${endpoint}`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json'
                },
                mode: 'cors',
                body: formData
              });
            }
            
            if (!response.ok) throw new Error('Failed to get response from AI');
            return await response.json();
          } else {
            // No file uploaded, send error message
            return {
              message_text: 'กรุณาอัพโหลดไฟล์ PDF ก่อนส่งคำถาม',
              notes: null,
              chart_spec: null,
              chart_notes: null
            };
          }
        }
        
        // For manual and database modes, use JSON request
        const response = await fetch(`http://192.168.50.119:5678/webhook/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          mode: 'cors',
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) throw new Error('Failed to get response from AI');
        return await response.json();
      } catch (error) {
        console.error('Error sending message:', error);
        return null;
      }
    }
  };

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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }
    
    .chatbot-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    .chatbot-widget-window {
      position: absolute;
      bottom: calc(${config.buttonSize} + 10px);
      ${config.position}: 0;
      width: ${config.widgetWidth};
      height: ${config.widgetHeight};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      background: white;
      display: flex;
      flex-direction: column;
    }
    
    .chatbot-widget-window.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }
    
    .chatbot-widget-header {
      background: ${config.buttonColor};
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 16px;
    }
    
    .chatbot-widget-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .chatbot-widget-history-toggle {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 6px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chatbot-widget-history-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .chatbot-widget-history-toggle.active {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .chatbot-widget-history-toggle svg {
      width: 20px;
      height: 20px;
    }
    
    .chatbot-widget-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    
    .chatbot-widget-close:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .chatbot-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f8fafc;
    }
    
    .chatbot-widget-message {
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
    }
    
    .chatbot-widget-message.user {
      justify-content: flex-end;
    }
    
    .chatbot-widget-message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }
    
    .chatbot-widget-message-avatar.bot {
      background: ${config.buttonColor};
      color: white;
    }
    
    .chatbot-widget-message-avatar.user {
      background: #e2e8f0;
      color: #64748b;
    }
    
    .chatbot-widget-message-content {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .chatbot-widget-message-content.bot {
      background: white;
      color: #1e293b;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .chatbot-widget-message-content.user {
      background: ${config.buttonColor};
      color: white;
    }
    
    .chatbot-widget-content-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 70%;
    }
    
    /* Markdown styles */
    .chatbot-widget-message-content strong {
      font-weight: 600;
    }
    
    .chatbot-widget-message-content em {
      font-style: italic;
    }
    
    .chatbot-widget-message-content code {
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
      color: #dc2626;
    }
    
    .chatbot-widget-message-content pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      margin: 8px 0;
      overflow-x: auto;
    }
    
    .chatbot-widget-message-content pre code {
      background: none;
      padding: 0;
      color: #1e293b;
      font-size: 0.9em;
    }
    
    .chatbot-widget-message-content a {
      color: ${config.buttonColor};
      text-decoration: none;
    }
    
    .chatbot-widget-message-content a:hover {
      text-decoration: underline;
    }
    
    /* Chart styles */
    .chatbot-widget-chart-container {
      margin: 16px 0;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      position: relative;
    }
    
    .chatbot-widget-chart-container:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
    
    .chatbot-widget-chart-container svg {
      display: block;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
    }
    
    /* Chart animations */
    .chatbot-widget-chart-container svg rect,
    .chatbot-widget-chart-container svg path,
    .chatbot-widget-chart-container svg circle {
      transition: all 0.3s ease;
    }
    
    /* Chart tooltips */
    .chatbot-widget-chart-container .bar-group:hover rect,
    .chatbot-widget-chart-container .line-series:hover path,
    .chatbot-widget-chart-container .pie-slice:hover path {
      filter: brightness(1.1) !important;
    }
    
    /* Legend styles */
    .chatbot-widget-chart-container .legend-item {
      transition: opacity 0.3s ease;
    }
    
    .chatbot-widget-chart-container .legend-item:hover {
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .chatbot-widget-chart-container {
        max-width: 380px;
        height: 280px;
        margin: 12px 0;
      }
      
      .chatbot-widget-chart-container svg {
        font-size: 10px;
      }
      
      .chatbot-widget-chart-container .legend {
        font-size: 9px;
      }
    }
    
    @media (max-width: 480px) {
      .chatbot-widget-chart-container {
        max-width: 320px;
        height: 240px;
        margin: 8px 0;
      }
    }
    
    .chatbot-widget-chart-notes {
      margin-top: 8px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 6px;
      font-size: 12px;
      color: #64748b;
      border-left: 3px solid ${config.buttonColor};
    }
    
    .chatbot-widget-chart-notes strong {
      font-weight: 600;
      color: #1e293b;
    }
    
    .chatbot-widget-chart-notes em {
      font-style: italic;
    }
    
    .chatbot-widget-chart-notes code {
      background: #f1f5f9;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.9em;
      color: #dc2626;
    }
    
    .chatbot-widget-input-container {
      padding: 16px;
      background: white;
      border-top: 1px solid #e2e8f0;
    }
    
    .chatbot-widget-input-wrapper {
      position: relative;
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }
    
    .chatbot-widget-textarea {
      flex: 1;
      min-height: 44px;
      max-height: 120px;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      outline: none;
      transition: border-color 0.2s ease;
    }
    
    .chatbot-widget-textarea:focus {
      border-color: ${config.buttonColor};
    }
    
    .chatbot-widget-send {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: ${config.buttonColor};
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
      flex-shrink: 0;
    }
    
    .chatbot-widget-send:hover:not(:disabled) {
      background: ${config.buttonColor}dd;
    }
    
    .chatbot-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .chatbot-widget-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      color: #64748b;
      font-size: 14px;
    }
    
    .chatbot-widget-loading-dots {
      display: flex;
      gap: 4px;
    }
    
    .chatbot-widget-loading-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #64748b;
      animation: chatbot-loading 1.4s infinite ease-in-out;
    }
    
    .chatbot-widget-loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .chatbot-widget-loading-dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes chatbot-loading {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    
    /* Typing indicator styles */
    .chatbot-widget-typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: #f1f5f9;
      border-radius: 18px;
      width: fit-content;
      max-width: 60px;
    }
    
    .chatbot-widget-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94a3b8;
      animation: chatbot-typing 1.4s infinite ease-in-out;
    }
    
    .chatbot-widget-typing-dot:nth-child(1) { 
      animation-delay: -0.32s; 
    }
    
    .chatbot-widget-typing-dot:nth-child(2) { 
      animation-delay: -0.16s; 
    }
    
    .chatbot-widget-typing-dot:nth-child(3) { 
      animation-delay: 0s; 
    }
    
    @keyframes chatbot-typing {
      0%, 60%, 100% { 
        transform: translateY(0);
        opacity: 0.4;
      }
      30% { 
        transform: translateY(-10px);
        opacity: 1;
      }
    }
    
    .chatbot-widget-controls-row {
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .chatbot-widget-mode-selector {
      position: relative;
      display: inline-block;
      width: auto;
      min-width: 140px;
    }
    
    .chatbot-widget-mode-select {
      width: auto;
      min-width: 140px;
      padding: 6px 10px;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 6px center;
      background-size: 14px;
      padding-right: 28px;
      color: #374151;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .chatbot-widget-mode-select:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .chatbot-widget-mode-select:focus {
      outline: none;
      border-color: ${config.buttonColor};
      box-shadow: 0 0 0 3px ${config.buttonColor}15;
      background-color: #ffffff;
    }
    
    .chatbot-widget-upload-container {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    
    .chatbot-widget-upload-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: ${config.buttonColor};
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    
    .chatbot-widget-upload-btn:hover {
      background: ${config.buttonColor}dd;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .chatbot-widget-upload-btn:active {
      transform: translateY(0);
    }
    
    .chatbot-widget-file-name {
      font-size: 10px;
      color: #64748b;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .chatbot-widget-welcome {
      text-align: center;
      padding: 32px 16px;
      color: #64748b;
    }
    
    .chatbot-widget-welcome h3 {
      margin: 0 0 8px 0;
      color: #1e293b;
      font-size: 18px;
      font-weight: 600;
    }
    
    .chatbot-widget-welcome p {
      margin: 0 0 16px 0;
      font-size: 14px;
    }
    
    .chatbot-widget-suggestions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .chatbot-widget-suggestion {
      padding: 8px 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    
    .chatbot-widget-suggestion:hover {
      background: #f8fafc;
      border-color: ${config.buttonColor};
    }
    
    .chatbot-widget-history-header {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .chatbot-widget-history-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .chatbot-widget-new-chat {
      background: ${config.buttonColor};
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .chatbot-widget-new-chat:hover {
      background: ${config.buttonColor}dd;
    }
    
    .chatbot-widget-history-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .chatbot-widget-history-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }
    
    .chatbot-widget-history-item:hover {
      background: #f8fafc;
      border-left-color: ${config.buttonColor}40;
    }
    
    .chatbot-widget-history-item.active {
      background: #e0e7ff;
      border-left-color: ${config.buttonColor};
    }
    
    .chatbot-widget-history-content {
      flex: 1;
      min-width: 0;
    }
    
    .chatbot-widget-history-title {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .chatbot-widget-history-date {
      font-size: 12px;
      color: #64748b;
    }
    
    .chatbot-widget-history-actions {
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .chatbot-widget-history-item:hover .chatbot-widget-history-actions {
      opacity: 1;
    }
    
    .chatbot-widget-history-delete {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    .chatbot-widget-history-delete:hover {
      background: #fee2e2;
    }
    
    @media (max-width: 768px) {
      .chatbot-widget-window {
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
  const chatButton = document.createElement('button');
  chatButton.className = 'chatbot-widget-button';
  chatButton.innerHTML = config.buttonIcon;
  
  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.className = 'chatbot-widget-window';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'chatbot-widget-header';
  header.innerHTML = `
    <div class="chatbot-widget-header-left">
      <button class="chatbot-widget-history-toggle" title="Toggle Chat History">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span>AI Assistant</span>
    </div>
    <button class="chatbot-widget-close">${config.closeIcon}</button>
  `;
  
  // Create messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'chatbot-widget-messages';
  
  // Create input container
  const inputContainer = document.createElement('div');
  inputContainer.className = 'chatbot-widget-input-container';
  inputContainer.innerHTML = `
    <div class="chatbot-widget-input-wrapper">
      <textarea 
        class="chatbot-widget-textarea" 
        placeholder="Type your message here..."
        rows="1"
      ></textarea>
      <button class="chatbot-widget-send" disabled>${config.sendIcon}</button>
    </div>
          <div class="chatbot-widget-controls-row">
        <div class="chatbot-widget-mode-selector">
          <select class="chatbot-widget-mode-select">
            <option value="manual" ${chatMode === 'manual' ? 'selected' : ''} disabled>สอบถามคู่มือ (ปิดใช้งาน)</option>
            <option value="database" ${chatMode === 'database' ? 'selected' : ''} disabled>แชทกับฐานข้อมูล (ปิดใช้งาน)</option>
            <option value="document" ${chatMode === 'document' ? 'selected' : ''}>แชทกับเอกสาร</option>
          </select>
        </div>
      <div class="chatbot-widget-upload-container" style="display: none;">
        <input type="file" id="chatbot-widget-file-input" accept=".pdf" style="display: none;">
        <button class="chatbot-widget-upload-btn" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          อัพโหลด PDF
        </button>
        <span class="chatbot-widget-file-name"></span>
      </div>
    </div>
  `;
  
  // Append elements
  chatWindow.appendChild(header);
  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputContainer);
  widgetContainer.appendChild(chatWindow);
  widgetContainer.appendChild(chatButton);
  document.body.appendChild(widgetContainer);
  
  // Get references to elements
  const closeButton = header.querySelector('.chatbot-widget-close');
  const historyToggleButton = header.querySelector('.chatbot-widget-history-toggle');
  const textarea = inputContainer.querySelector('.chatbot-widget-textarea');
  const sendButton = inputContainer.querySelector('.chatbot-widget-send');
  const modeSelect = inputContainer.querySelector('.chatbot-widget-mode-select');
  const uploadContainer = inputContainer.querySelector('.chatbot-widget-upload-container');
  const fileInput = inputContainer.querySelector('#chatbot-widget-file-input');
  const uploadBtn = inputContainer.querySelector('.chatbot-widget-upload-btn');
  const fileName = inputContainer.querySelector('.chatbot-widget-file-name');
  
  // Auto-resize textarea
  const resizeTextarea = () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };
  
  textarea.addEventListener('input', resizeTextarea);
  
  // Update send button state
  const updateSendButton = () => {
    sendButton.disabled = !textarea.value.trim() || isLoading;
  };
  
  textarea.addEventListener('input', updateSendButton);
  
  // Function to toggle upload container visibility
  const toggleUploadContainer = () => {
    if (chatMode === 'document') {
      uploadContainer.style.display = 'flex';
    } else {
      uploadContainer.style.display = 'none';
      // Clear file input when switching away from document mode
      fileInput.value = '';
      fileName.textContent = '';
    }
  };

  // Initialize upload container visibility
  toggleUploadContainer();
  
  // Show welcome screen
  const showWelcome = () => {
    // Switch back to chat view and remove toggle highlight
    isHistoryView = false;
    historyToggleButton.classList.remove('active');
    
    messagesContainer.innerHTML = `
      <div class="chatbot-widget-welcome">
        <h3>Welcome to AI Assistant</h3>
        <p>Ask me anything! I'm here to help.</p>
        <div class="chatbot-widget-suggestions">
          <button class="chatbot-widget-suggestion">How can you help me?</button>
          <button class="chatbot-widget-suggestion">What are your capabilities?</button>
          <button class="chatbot-widget-suggestion">Tell me a joke</button>
        </div>
      </div>
    `;
    
    // Add event listeners to suggestions
    const suggestions = messagesContainer.querySelectorAll('.chatbot-widget-suggestion');
    suggestions.forEach(suggestion => {
      suggestion.addEventListener('click', () => {
        textarea.value = suggestion.textContent;
        resizeTextarea();
        updateSendButton();
        sendMessage();
      });
    });
  };

  // Show chat history
  const showChatHistory = () => {
    if (chatHistory.length === 0) {
      messagesContainer.innerHTML = `
        <div class="chatbot-widget-welcome">
          <h3>No Chat History</h3>
          <p>Start a new conversation to see it here.</p>
          <button class="chatbot-widget-new-chat">Start New Chat</button>
        </div>
      `;
      
      const newChatButton = messagesContainer.querySelector('.chatbot-widget-new-chat');
      newChatButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent widget from closing
        showWelcome();
      });
      return;
    }

    const historyHTML = chatHistory.map((chat, index) => {
      const date = new Date(chat.created_at || chat.updated_at || Date.now());
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      return `
        <div class="chatbot-widget-history-item ${chat.conversation_id === activeChat ? 'active' : ''}" 
             data-chat-id="${chat.conversation_id}">
          <div class="chatbot-widget-history-content">
            <div class="chatbot-widget-history-title">${chat.title || 'Untitled Chat'}</div>
            <div class="chatbot-widget-history-date">${formattedDate}</div>
          </div>
          <div class="chatbot-widget-history-actions">
            <button class="chatbot-widget-history-delete" title="Delete this chat">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    messagesContainer.innerHTML = `
      <div class="chatbot-widget-history-header">
        <h3>Chat History</h3>
        <button class="chatbot-widget-new-chat">New Chat</button>
      </div>
      <div class="chatbot-widget-history-list">
        ${historyHTML}
      </div>
    `;

    // Add event listeners
    const historyItems = messagesContainer.querySelectorAll('.chatbot-widget-history-item');
    historyItems.forEach(item => {
      const chatId = item.dataset.chatId;
      const deleteButton = item.querySelector('.chatbot-widget-history-delete');

      // Click on item to load chat history
      item.addEventListener('click', (e) => {
        // Don't trigger if clicking on delete button
        if (e.target.closest('.chatbot-widget-history-delete')) {
          return;
        }
        loadChatHistory(chatId);
      });

      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering item click
        deleteChatHistory(chatId);
      });
    });

    const newChatButton = messagesContainer.querySelector('.chatbot-widget-new-chat');
    newChatButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent widget from closing
      showWelcome();
    });
  };

  // Load chat history
  const loadChatHistory = async (chatId) => {
    if (!config.userId) {
      console.warn('User ID not set, cannot load chat history');
      return;
    }

    try {
      const response = await api.fetchConversationMessages(chatId);
      if (response && response.length > 0) {
        messages.length = 0; // Clear current messages
        messages.push(...response);
        activeChat = chatId;
        
        // Clear and add all messages
        messagesContainer.innerHTML = '';
        messages.forEach(message => {
          addMessage(message);
        });
        
        // Switch back to chat view and remove toggle highlight
        isHistoryView = false;
        historyToggleButton.classList.remove('active');
        
        // console.log('Chat history loaded:', chatId);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Delete chat history
  const deleteChatHistory = async (chatId) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      try {
        // Remove from local array
        chatHistory = chatHistory.filter(chat => chat.conversation_id !== chatId);
        
        // If this was the active chat, clear it
        if (activeChat === chatId) {
          activeChat = null;
          messages.length = 0;
          showWelcome();
        } else {
          // Refresh history view
          showChatHistory();
        }
        
        // console.log('Chat deleted:', chatId);
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };
  
  // Simple markdown parser
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    return text
      // Bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      
      // Italic: *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      
      // Code: `code`
      .replace(/`(.*?)`/g, '<code>$1</code>')
      
      // Code blocks: ```code```
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  // Simple chart renderer for widget
  const renderChart = (chartSpec) => {
    // console.log('Rendering chart with spec:', chartSpec);
    // console.log('Chart spec type:', typeof chartSpec);
    // console.log('Chart spec keys:', Object.keys(chartSpec || {}));
    
    if (!chartSpec) {
      // console.log('Chart spec is null/undefined');
      return null;
    }
    
    if (!chartSpec.data) {
      // console.log('Chart spec missing data:', chartSpec);
      return null;
    }
    
    // Check if it's Nivo format (has data with 'value' property)
    const isNivoFormat = chartSpec.data && chartSpec.data.length > 0 && chartSpec.data[0].hasOwnProperty('value');
    
    if (!isNivoFormat) {
      // Only check keys and indexBy for non-Nivo format
      if (!chartSpec.keys) {
        // console.log('Chart spec missing keys (non-Nivo format):', chartSpec);
        return null;
      }
      
      if (!chartSpec.indexBy) {
        // console.log('Chart spec missing indexBy (non-Nivo format):', chartSpec);
        return null;
      }
    } else {
      // console.log('Detected Nivo format, skipping keys/indexBy validation');
    }
    
    // console.log('Chart spec validation passed');

    const chartId = 'chart-' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chatbot-widget-chart-container';
    chartContainer.id = chartId;
    chartContainer.style.cssText = `
      width: 100%;
      max-width: 450px;
      height: 280px;
      margin: 16px 0;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #64748b;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
    `;
    
    // Simple chart visualization based on type
    let chartHTML = '';
    const { type, data } = chartSpec;
    
    // Handle both Nivo format and original format
    let keys = chartSpec.keys;
    let indexBy = chartSpec.indexBy;
    
    // If it's Nivo format, extract keys and indexBy from data
    if (data && data.length > 0 && data[0].hasOwnProperty('value')) {
      // Nivo format - data has 'value' property
      keys = ['value'];
      indexBy = 'id';
      // console.log('Detected Nivo format, using keys:', keys, 'indexBy:', indexBy);
    } else {
      // Original format
      keys = chartSpec.keys;
      indexBy = chartSpec.indexBy;
      // console.log('Using original format, keys:', keys, 'indexBy:', indexBy);
    }
    
    // console.log('Chart type:', type, 'Data:', data, 'Keys:', keys, 'IndexBy:', indexBy);
    
    switch (type) {
      case 'bar':
        chartHTML = renderBarChart(data, keys, indexBy);
        break;
      case 'line':
        chartHTML = renderLineChart(data, keys, indexBy);
        break;
      case 'pie':
        chartHTML = renderPieChart(data, keys, indexBy);
        break;
      default:
        chartHTML = renderBarChart(data, keys, indexBy);
    }
    
    // console.log('Generated chart HTML:', chartHTML);
    chartContainer.innerHTML = chartHTML;
    return chartContainer;
  };

  const renderBarChart = (data, keys, indexBy) => {
    if (!data || data.length === 0) {
      return '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px;">No data available</div>';
    }
    
    try {
      const maxValue = Math.max(...data.map(d => Math.max(...keys.map(key => d[key] || 0))));
      
      if (maxValue <= 0) {
        return '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px;">No valid data</div>';
      }
      
      const chartHeight = 200;
      const chartWidth = Math.max(350, data.length * 60);
      const padding = { top: 30, right: 20, bottom: 50, left: 60 };
      const barWidth = 30;
      const barSpacing = 10;
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
      
      let svg = `<svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="barGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="barGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="barGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="barGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="barGradient5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#00000020"/>
          </filter>
        </defs>
        
        <!-- Grid lines -->
        <g class="grid">
          ${Array.from({length: 5}, (_, i) => {
            const y = padding.top + (i * (chartHeight - padding.top - padding.bottom) / 4);
            return `<line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>`;
          }).join('')}
        </g>
        
        <!-- Y-axis labels -->
        <g class="y-axis">
          ${Array.from({length: 5}, (_, i) => {
            const y = padding.top + (i * (chartHeight - padding.top - padding.bottom) / 4);
            const value = Math.round(maxValue * (1 - i / 4));
            return `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="#64748b">${value}</text>`;
          }).join('')}
        </g>
        
        <!-- Bars -->
        <g class="bars">`;
      
      data.forEach((item, index) => {
        const x = padding.left + index * (barWidth + barSpacing);
        keys.forEach((key, keyIndex) => {
          const value = item[key] || 0;
          const height = (value / maxValue) * (chartHeight - padding.top - padding.bottom);
          const y = chartHeight - padding.bottom - height;
          const gradientId = `barGradient${(keyIndex % 5) + 1}`;
          
          svg += `
            <g class="bar-group" data-index="${index}" data-key="${key}" data-value="${value}">
              <rect 
                x="${x + keyIndex * 5}" 
                y="${y}" 
                width="${barWidth - 8}" 
                height="${height}" 
                fill="url(#${gradientId})" 
                rx="4" 
                ry="4"
                filter="url(#shadow)"
                style="transition: all 0.3s ease; cursor: pointer;"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.filter='url(#shadow) drop-shadow(0 4px 8px rgba(0,0,0,0.3))'"
                onmouseout="this.style.transform='translateY(0)'; this.style.filter='url(#shadow)'"
              />
              <text 
                x="${x + (barWidth - 8) / 2 + keyIndex * 5}" 
                y="${y - 5}" 
                text-anchor="middle" 
                font-size="10" 
                fill="#374151" 
                font-weight="600"
                opacity="0"
                style="transition: opacity 0.3s ease;"
                onmouseover="this.style.opacity='1'"
                onmouseout="this.style.opacity='0'"
              >${value}</text>
            </g>`;
        });
        
        // X-axis labels
        svg += `<text 
          x="${x + (barWidth + barSpacing) / 2}" 
          y="${chartHeight - padding.bottom + 15}" 
          text-anchor="middle" 
          font-size="10" 
          fill="#64748b"
          transform="rotate(-45 ${x + (barWidth + barSpacing) / 2} ${chartHeight - padding.bottom + 15})"
        >${item[indexBy]}</text>`;
      });
      
      svg += `
        </g>
        
        <!-- Legend -->
        <g class="legend" transform="translate(${chartWidth - 100}, 10)">
          ${keys.map((key, index) => {
            const color = colors[index % colors.length];
            return `
              <g class="legend-item">
                <rect x="0" y="${index * 20}" width="12" height="12" fill="${color}" rx="2"/>
                <text x="18" y="${index * 20 + 9}" font-size="10" fill="#374151">${key}</text>
              </g>`;
          }).join('')}
        </g>
      </svg>`;
      
      return svg;
    } catch (error) {
      console.error('Error rendering bar chart:', error);
      return '<div style="padding: 20px; text-align: center; color: #ef4444; font-size: 12px;">Error rendering chart</div>';
    }
  };

  const renderLineChart = (data, keys, indexBy) => {
    if (!data || data.length === 0) {
      return '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px;">No data available</div>';
    }
    
    try {
      const chartHeight = 200;
      const chartWidth = Math.max(350, data.length * 60);
      const padding = { top: 30, right: 80, bottom: 50, left: 60 };
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
      
      let svg = `<svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:0.8" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:0.8" />
          </linearGradient>
          <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#059669;stop-opacity:0.8" />
          </linearGradient>
          <linearGradient id="lineGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:0.8" />
          </linearGradient>
          <linearGradient id="lineGradient5" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0.8" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Grid lines -->
        <g class="grid">
          ${Array.from({length: 5}, (_, i) => {
            const y = padding.top + (i * (chartHeight - padding.top - padding.bottom) / 4);
            return `<line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>`;
          }).join('')}
        </g>
        
        <!-- Y-axis labels -->
        <g class="y-axis">
          ${Array.from({length: 5}, (_, i) => {
            const y = padding.top + (i * (chartHeight - padding.top - padding.bottom) / 4);
            const maxValue = Math.max(...data.map(d => Math.max(...keys.map(key => d[key] || 0))));
            const value = Math.round(maxValue * (1 - i / 4));
            return `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="#64748b">${value}</text>`;
          }).join('')}
        </g>`;
      
      keys.forEach((key, keyIndex) => {
        const color = colors[keyIndex % colors.length];
        const gradientId = `lineGradient${(keyIndex % 5) + 1}`;
        const maxValue = Math.max(...data.map(d => d[key] || 0));
        
        // Create path for line
        const points = data.map((item, index) => {
          const x = padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right);
          const y = chartHeight - padding.bottom - ((item[key] || 0) / maxValue) * (chartHeight - padding.top - padding.bottom);
          return `${x},${y}`;
        });
        
        const pathData = `M ${points.join(' L ')}`;
        
        // Create area path for fill
        const areaPoints = [
          `${padding.left},${chartHeight - padding.bottom}`,
          ...points,
          `${chartWidth - padding.right},${chartHeight - padding.bottom}`
        ];
        const areaPathData = `M ${areaPoints.join(' L ')} Z`;
        
        svg += `
          <g class="line-series" data-key="${key}">
            <!-- Area fill -->
            <path 
              d="${areaPathData}" 
              fill="url(#${gradientId})" 
              opacity="0.1"
              style="transition: opacity 0.3s ease;"
              onmouseover="this.style.opacity='0.2'"
              onmouseout="this.style.opacity='0.1'"
            />
            
            <!-- Line -->
            <path 
              d="${pathData}" 
              fill="none" 
              stroke="url(#${gradientId})" 
              stroke-width="3" 
              stroke-linecap="round"
              stroke-linejoin="round"
              filter="url(#glow)"
              style="transition: all 0.3s ease; cursor: pointer;"
              onmouseover="this.style.strokeWidth='4'; this.style.filter='url(#glow) brightness(1.2)'"
              onmouseout="this.style.strokeWidth='3'; this.style.filter='url(#glow)'"
            />
            
            <!-- Data points -->
            ${data.map((item, index) => {
              const x = padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right);
              const y = chartHeight - padding.bottom - ((item[key] || 0) / maxValue) * (chartHeight - padding.top - padding.bottom);
              const value = item[key] || 0;
              
              return `
                <circle 
                  cx="${x}" 
                  cy="${y}" 
                  r="4" 
                  fill="${color}" 
                  stroke="white" 
                  stroke-width="2"
                  style="transition: all 0.3s ease; cursor: pointer;"
                  onmouseover="this.style.r='6'; this.style.strokeWidth='3'"
                  onmouseout="this.style.r='4'; this.style.strokeWidth='2'"
                />
                <text 
                  x="${x}" 
                  y="${y - 10}" 
                  text-anchor="middle" 
                  font-size="10" 
                  fill="#374151" 
                  font-weight="600"
                  opacity="0"
                  style="transition: opacity 0.3s ease;"
                  onmouseover="this.style.opacity='1'"
                  onmouseout="this.style.opacity='0'"
                >${value}</text>`;
            }).join('')}
          </g>`;
      });
      
      // X-axis labels
      data.forEach((item, index) => {
        const x = padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right);
        svg += `<text 
          x="${x}" 
          y="${chartHeight - padding.bottom + 15}" 
          text-anchor="middle" 
          font-size="10" 
          fill="#64748b"
          transform="rotate(-45 ${x} ${chartHeight - padding.bottom + 15})"
        >${item[indexBy]}</text>`;
      });
      
      svg += `
        <!-- Legend -->
        <g class="legend" transform="translate(${chartWidth - 70}, 10)">
          ${keys.map((key, index) => {
            const color = colors[index % colors.length];
            return `
              <g class="legend-item">
                <line x1="0" y1="${index * 20 + 6}" x2="15" y2="${index * 20 + 6}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
                <text x="20" y="${index * 20 + 9}" font-size="10" fill="#374151">${key}</text>
              </g>`;
          }).join('')}
        </g>
      </svg>`;
      
      return svg;
    } catch (error) {
      console.error('Error rendering line chart:', error);
      return '<div style="padding: 20px; text-align: center; color: #ef4444; font-size: 12px;">Error rendering chart</div>';
    }
  };

  const renderPieChart = (data, keys, indexBy) => {
    if (!data || data.length === 0) {
      return '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px;">No data available</div>';
    }
    
    try {
      const chartSize = 170;
      const radius = chartSize / 2 - 32;
      const centerX = chartSize / 2;
      const centerY = chartSize / 2;
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
      
      let svg = `<svg width="100%" height="100%" viewBox="0 0 ${chartSize + 120} ${chartSize}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="pieShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#00000030"/>
          </filter>
          <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>`;
      
      // Check if data is in Nivo format (has 'value' property)
      const isNivoFormat = data[0] && data[0].hasOwnProperty('value');
      
      let total, currentAngle = 0;
      
      if (isNivoFormat) {
        // Nivo format: data has 'value' property
        total = data.reduce((sum, item) => sum + (item.value || 0), 0);
        
        data.forEach((item, index) => {
          const value = item.value || 0;
          const angle = (value / total) * 2 * Math.PI;
          const color = item.color || colors[index % colors.length];
          const label = item.label || item.id || `Item ${index}`;
          const percentage = ((value / total) * 100).toFixed(1);
          
          const x1 = centerX + radius * Math.cos(currentAngle);
          const y1 = centerY + radius * Math.sin(currentAngle);
          const x2 = centerX + radius * Math.cos(currentAngle + angle);
          const y2 = centerY + radius * Math.sin(currentAngle + angle);
          
          const largeArcFlag = angle > Math.PI ? 1 : 0;
          
          svg += `
            <g class="pie-slice" data-index="${index}" data-value="${value}" data-percentage="${percentage}">
              <path 
                d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z" 
                fill="${color}"
                filter="url(#pieShadow)"
                style="transition: all 0.3s ease; cursor: pointer;"
                onmouseover="this.style.transform='scale(1.05)'; this.style.filter='url(#pieGlow)'"
                onmouseout="this.style.transform='scale(1)'; this.style.filter='url(#pieShadow)'"
              />
              
              <!-- Percentage label -->
              <text 
                x="${centerX + (radius * 0.7) * Math.cos(currentAngle + angle / 2)}" 
                y="${centerY + (radius * 0.7) * Math.sin(currentAngle + angle / 2)}" 
                text-anchor="middle" 
                font-size="12" 
                fill="white" 
                font-weight="600"
                style="pointer-events: none;"
              >${percentage}%</text>
            </g>`;
          
          currentAngle += angle;
        });
        
        // Add legend on the right side
        svg += `<g class="legend" transform="translate(${chartSize + 15}, 10)">`;
        data.forEach((item, index) => {
          const color = item.color || colors[index % colors.length];
          const label = item.label || item.id || `Item ${index}`;
          const value = item.value || 0;
          
          svg += `
            <g class="legend-item" transform="translate(0, ${index * 18})">
              <rect x="0" y="0" width="11" height="11" fill="${color}" rx="2" ry="2"/>
              <text x="16" y="9" font-size="9" fill="#374151">${label}</text>
              <text x="16" y="17" font-size="8" fill="#64748b">${value} (${((value / total) * 100).toFixed(1)}%)</text>
            </g>`;
        });
        svg += `</g>`;
        
      } else {
        // Original format: data has keys property
        total = data.reduce((sum, item) => sum + (item[keys[0]] || 0), 0);
        
        data.forEach((item, index) => {
          const value = item[keys[0]] || 0;
          const angle = (value / total) * 2 * Math.PI;
          const color = colors[index % colors.length];
          const label = item[indexBy] || `Item ${index}`;
          const percentage = ((value / total) * 100).toFixed(1);
          
          const x1 = centerX + radius * Math.cos(currentAngle);
          const y1 = centerY + radius * Math.sin(currentAngle);
          const x2 = centerX + radius * Math.cos(currentAngle + angle);
          const y2 = centerY + radius * Math.sin(currentAngle + angle);
          
          const largeArcFlag = angle > Math.PI ? 1 : 0;
          
          svg += `
            <g class="pie-slice" data-index="${index}" data-value="${value}" data-percentage="${percentage}">
              <path 
                d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z" 
                fill="${color}"
                filter="url(#pieShadow)"
                style="transition: all 0.3s ease; cursor: pointer;"
                onmouseover="this.style.transform='scale(1.05)'; this.style.filter='url(#pieGlow)'"
                onmouseout="this.style.transform='scale(1)'; this.style.filter='url(#pieShadow)'"
              />
              
              <!-- Percentage label -->
              <text 
                x="${centerX + (radius * 0.7) * Math.cos(currentAngle + angle / 2)}" 
                y="${centerY + (radius * 0.7) * Math.sin(currentAngle + angle / 2)}" 
                text-anchor="middle" 
                font-size="12" 
                fill="white" 
                font-weight="600"
                style="pointer-events: none;"
              >${percentage}%</text>
            </g>`;
          
          currentAngle += angle;
        });
        
        // Add legend on the right side
        svg += `<g class="legend" transform="translate(${chartSize + 15}, 10)">`;
        data.forEach((item, index) => {
          const color = colors[index % colors.length];
          const label = item[indexBy] || `Item ${index}`;
          const value = item[keys[0]] || 0;
          
          svg += `
            <g class="legend-item" transform="translate(0, ${index * 18})">
              <rect x="0" y="0" width="11" height="11" fill="${color}" rx="2" ry="2"/>
              <text x="16" y="9" font-size="9" fill="#374151">${label}</text>
              <text x="16" y="17" font-size="8" fill="#64748b">${value} (${((value / total) * 100).toFixed(1)}%)</text>
            </g>`;
        });
        svg += `</g>`;
      }
      
      svg += '</svg>';
      return svg;
    } catch (error) {
      console.error('Error rendering pie chart:', error);
      return '<div style="padding: 20px; text-align: center; color: #ef4444; font-size: 12px;">Error rendering pie chart</div>';
    }
  };

  // Add message to UI
  const addMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-widget-message ${message.sender_type.toLowerCase()}`;
    
    const avatar = document.createElement('div');
    avatar.className = `chatbot-widget-message-avatar ${message.sender_type.toLowerCase()}`;
    avatar.textContent = message.sender_type === 'USER' ? 'U' : 'AI';
    
    const content = document.createElement('div');
    content.className = `chatbot-widget-message-content ${message.sender_type.toLowerCase()}`;
    
    // Parse markdown for BOT messages only
    if (message.sender_type === 'BOT') {
      content.innerHTML = parseMarkdown(message.message_text);
    } else {
      content.textContent = message.message_text;
    }
    
    if (message.sender_type === 'USER') {
      messageElement.appendChild(content);
      messageElement.appendChild(avatar);
    } else {
      messageElement.appendChild(avatar);
      
      // Create a container for all content (text, chart, notes)
      const contentContainer = document.createElement('div');
      contentContainer.className = 'chatbot-widget-content-container';
      
      // Add text content
      contentContainer.appendChild(content);
      
      // Add chart if available (only for BOT messages) - AFTER content
      if (message.chart_spec) {
        // console.log('Adding chart to message:', message.chart_spec);
        const chartElement = renderChart(message.chart_spec);
        // console.log('Chart element created:', chartElement);
        if (chartElement) {
          contentContainer.appendChild(chartElement);
          // console.log('Chart element added to container');
        } else {
          // console.log('Failed to create chart element');
        }
      }
      
      // Add chart notes if available - AFTER chart
      if (message.chart_notes) {
        const notesElement = document.createElement('div');
        notesElement.className = 'chatbot-widget-chart-notes';
        notesElement.innerHTML = parseMarkdown(message.chart_notes);
        contentContainer.appendChild(notesElement);
      }
      
      messageElement.appendChild(contentContainer);
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };
  
  // Show loading indicator
  const showLoading = () => {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'chatbot-widget-message bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'chatbot-widget-message-avatar bot';
    avatar.textContent = 'AI';
    
    const content = document.createElement('div');
    content.className = 'chatbot-widget-message-content bot';
    content.innerHTML = `
      <div class="chatbot-widget-typing-indicator">
        <div class="chatbot-widget-typing-dot"></div>
        <div class="chatbot-widget-typing-dot"></div>
        <div class="chatbot-widget-typing-dot"></div>
      </div>
    `;
    
    loadingElement.appendChild(avatar);
    loadingElement.appendChild(content);
    messagesContainer.appendChild(loadingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return loadingElement;
  };
  
  // Send message function
  const sendMessage = async () => {
    const input = textarea.value.trim();
    if (!input || isLoading) return;
    
    // Check if userId is set
    if (!config.userId) {
      const errorMessage = {
        id: Date.now(),
        conversation_id: '',
        message_id: messages.length + 1,
        message_text: '⚠️ User ID is not set. Please set userId before sending messages.\n\nYou can set it via:\n• localStorage.setItem("chatbot_user_id", "your-id")\n• window.postMessage({type: "SET_USER_ID", userId: "your-id"}, "*")\n• window.ChatbotWidget.setUserId("your-id")',
        notes: null,
        chart_spec: null,
        chart_notes: null,
        sender_type: 'BOT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      messages.push(errorMessage);
      addMessage(errorMessage);
      return;
    }
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      conversation_id: activeChat || '',
      message_id: messages.length + 1,
      message_text: input,
      notes: null,
      chart_spec: null,
      chart_notes: null,
      sender_type: 'USER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    messages.push(userMessage);
    addMessage(userMessage);
    
    // Clear input
    textarea.value = '';
    resizeTextarea();
    updateSendButton();
    
    // Show loading
    isLoading = true;
    const loadingElement = showLoading();
    
    try {
      let conversationId = activeChat;
      
      // Create conversation if needed
      if (!conversationId) {
        const newConversation = await api.createConversation(input);
        if (newConversation) {
          if (Array.isArray(newConversation) && newConversation.length > 0) {
            conversationId = newConversation[0].conversation_id;
            chatHistory.unshift(newConversation[0]);
          } else if (newConversation.conversation_id) {
            conversationId = newConversation.conversation_id;
            chatHistory.unshift(newConversation);
          }
          activeChat = conversationId;
          
          // Update history view if currently showing
          if (isHistoryView) {
            showChatHistory();
          }
        }
      }
      
      // Send message to AI
      const response = await api.sendMessage(input, conversationId);
      
      if (response) {
        // console.log('API Response:', response);
        // console.log('Chart spec from API:', response.chart_spec);
        
        const aiMessage = {
          id: Date.now() + 1,
          conversation_id: conversationId || '',
          message_id: messages.length + 1,
          message_text: response.message_text || 'Sorry, I encountered an error.',
          notes: response.notes || null,
          chart_spec: response.chart_spec || null,
          chart_notes: response.chart_notes || null,
          sender_type: 'BOT',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // console.log('Created AI message:', aiMessage);
        messages.push(aiMessage);
        addMessage(aiMessage);
      } else {
        // Show error message
        const errorMessage = {
          id: Date.now() + 1,
          conversation_id: conversationId || '',
          message_id: messages.length + 1,
          message_text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง',
          notes: null,
          chart_spec: null,
          chart_notes: null,
          sender_type: 'BOT',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        messages.push(errorMessage);
        addMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        conversation_id: activeChat || '',
        message_id: messages.length + 1,
        message_text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง',
        notes: null,
        chart_spec: null,
        chart_notes: null,
        sender_type: 'BOT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      messages.push(errorMessage);
      addMessage(errorMessage);
    } finally {
      isLoading = false;
      if (loadingElement) {
        loadingElement.remove();
      }
    }
  };
  
  // Event listeners
  chatButton.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.classList.add('active');
      if (messages.length === 0) {
        showWelcome();
      }
    } else {
      chatWindow.classList.remove('active');
    }
  });
  
  closeButton.addEventListener('click', () => {
    isOpen = false;
    chatWindow.classList.remove('active');
  });
  
  sendButton.addEventListener('click', sendMessage);
  
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  modeSelect.addEventListener('change', () => {
    chatMode = modeSelect.value;
    toggleUploadContainer();
  });

  // File upload handlers
  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        fileName.textContent = file.name;
        // You can add file upload logic here
        // console.log('PDF file selected:', file.name);
      } else {
        alert('กรุณาเลือกไฟล์ PDF เท่านั้น');
        fileInput.value = '';
        fileName.textContent = '';
      }
    }
  });
  
  // History toggle event listener
  historyToggleButton.addEventListener('click', () => {
    isHistoryView = !isHistoryView;
    historyToggleButton.classList.toggle('active', isHistoryView);
    
    if (isHistoryView) {
      showChatHistory();
    } else {
      if (messages.length === 0) {
        showWelcome();
      } else {
        // Show current messages
        messagesContainer.innerHTML = '';
        messages.forEach(message => {
          addMessage(message);
        });
      }
    }
  });
  
  // Close chat when clicking outside
  document.addEventListener('click', (event) => {
    if (isOpen && !widgetContainer.contains(event.target)) {
      isOpen = false;
      chatWindow.classList.remove('active');
    }
  });
  
  // Load chat history on init
  const initWidget = async () => {
    if (config.userId) {
      try {
        chatHistory = await api.fetchChatHistory();
        // console.log('Chat history loaded:', chatHistory.length, 'conversations');
      } catch (error) {
        console.error('Error loading chat history:', error);
        chatHistory = [];
      }
    } else {
      console.warn('User ID not set, skipping chat history load');
      chatHistory = [];
    }
  };
  
  initWidget();
  
  // Add postMessage event listener
  window.addEventListener('message', handlePostMessage);
  
  // Expose API
  window.ChatbotWidget = {
    open: () => {
      isOpen = true;
      chatWindow.classList.add('active');
      if (messages.length === 0) {
        showWelcome();
      }
    },
    close: () => {
      isOpen = false;
      chatWindow.classList.remove('active');
    },
    toggle: () => {
      chatButton.click();
    },
    sendMessage: (text) => {
      textarea.value = text;
      resizeTextarea();
      updateSendButton();
      sendMessage();
    },
    setChatMode: (mode) => {
      chatMode = mode;
      if (modeSelect) {
        modeSelect.value = mode;
      }
    },
    getChatMode: () => {
      return chatMode;
    },
    // File upload methods
    uploadFile: (file) => {
      if (file && file.type === 'application/pdf') {
        fileName.textContent = file.name;
        console.log('PDF file uploaded:', file.name);
        return true;
      } else {
        console.error('Invalid file type. Only PDF files are allowed.');
        return false;
      }
    },
    getUploadedFile: () => {
      return fileInput.files[0] || null;
    },
    clearUploadedFile: () => {
      fileInput.value = '';
      fileName.textContent = '';
    },
    // Set userId dynamically
    setUserId: (userId) => {
      if (userId) {
        config.userId = userId;
        localStorage.setItem('chatbot_user_id', userId);
        // console.log('User ID set via API:', userId);
      }
    },
    // Get current userId
    getUserId: () => {
      return config.userId;
    },
    // Set multiple config options
    setConfig: (newConfig) => {
      Object.keys(newConfig).forEach(key => {
        if (config.hasOwnProperty(key)) {
          config[key] = newConfig[key];
          // console.log(`Config updated: ${key} = ${newConfig[key]}`);
        }
      });
      
      // Store userId in localStorage if provided
      if (newConfig.userId) {
        localStorage.setItem('chatbot_user_id', newConfig.userId);
      }
    },
    // Get current config
    getConfig: () => {
      return { ...config };
    },
    // Method to handle external messages
    handleExternalMessage: (messageData) => {
      if (messageData && messageData.source === 'main-app' && messageData.type === 'ERROR_MESSAGE') {
        const errorData = messageData.data;
        
        // เปิด widget ถ้ายังไม่ได้เปิด
        if (!isOpen) {
          isOpen = true;
          chatWindow.classList.add('active');
          if (messages.length === 0) {
            showWelcome();
          }
        }
        
        // ใส่ข้อความ error ใน input
        textarea.value = `System Error: ${errorData.message}`;
        resizeTextarea();
        updateSendButton();
        
        // แสดง notification หรือ highlight input
        textarea.style.borderColor = '#ef4444';
        textarea.style.backgroundColor = '#fef2f2';
        
        // กลับเป็นปกติหลังจาก 3 วินาที
        setTimeout(() => {
          textarea.style.borderColor = '';
          textarea.style.backgroundColor = '';
        }, 3000);
        
        // Focus ที่ input
        textarea.focus();
      }
    }
  };
})(); 