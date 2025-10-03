import { useEffect, useState } from 'react';
import { MessageSquarePlus, Search, Send, Menu, User, Settings, LogOut, MoreVertical, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getConversations, addMessageToConversation, startNewConversation } from '../apiCalls/conversationsApiCall';
import { logout } from '../apiCalls/authApiCalls';
import { updateLanguage } from '../apiCalls/userApiCalls';

const translations = {
  en: {
    newChat: 'New Chat',
    searchPlaceholder: 'Search conversations...',
    noMessages: 'No messages yet. Start the conversation!',
    inputPlaceholder: 'Message AIChatbot...',
    disclaimer: 'AI Chatbot can make mistakes. Check important info.',
    userProfile: 'The User',
    download: 'Download PDF',
    downloading: 'Downloading...',
    selectModel: 'Select Model',
  },
  ar: {
    newChat: 'محادثة جديدة',
    searchPlaceholder: 'ابحث في المحادثات...',
    noMessages: 'لا توجد رسائل بعد. ابدأ المحادثة!',
    inputPlaceholder: 'اكتب رسالة لـ AI Chatbot...',
    disclaimer: 'قد يخطئ AI Chatbot. تحقق من المعلومات المهمة.',
    userProfile: 'المستخدم',
    download: 'تحميل PDF',
    downloading: 'جاري التحميل...',
    selectModel: 'اختر النموذج',
  },
};

// Define available models - you can modify these later
const AVAILABLE_MODELS = [
  { id: 'model-1', name: 'x-ai/grok-4-fast:free', description: 'Most capable model' },
  { id: 'model-2', name: 'mistralai/mistral-small-3.2-24b-instruct:free', description: 'Balanced performance' },
  { id: 'model-3', name: 'x-ai/grok-4-turbo:free', description: 'Fast and efficient' },
];

// Custom Markdown components for better styling
const MarkdownComponents = {
  // Headers
  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-3 text-gray-800" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-4 mb-2 text-gray-800" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-3 mb-2 text-gray-800" {...props} />,
  h4: ({node, ...props}) => <h4 className="text-base font-bold mt-3 mb-1 text-gray-800" {...props} />,
  h5: ({node, ...props}) => <h5 className="text-sm font-bold mt-2 mb-1 text-gray-800" {...props} />,
  h6: ({node, ...props}) => <h6 className="text-sm font-semibold mt-2 mb-1 text-gray-700" {...props} />,
  
  // Paragraph
  p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-gray-800" {...props} />,
  
  // Lists
  ul: ({node, ...props}) => <ul className="mb-3 ml-4 list-disc space-y-1" {...props} />,
  ol: ({node, ...props}) => <ol className="mb-3 ml-4 list-decimal space-y-1" {...props} />,
  li: ({node, ...props}) => <li className="text-gray-800" {...props} />,
  
  // Code blocks
  code: ({node, inline, ...props}) => {
    if (inline) {
      return <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 border" {...props} />;
    }
    return (
      <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3 border">
        <code className="text-sm font-mono text-gray-800 block" {...props} />
      </pre>
    );
  },
  
  // Blockquotes
  blockquote: ({node, ...props}) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-3 italic text-gray-600 bg-blue-50 py-2 rounded-r" {...props} />
  ),
  
  // Links
  a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />,
  
  // Strong/Bold
  strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
  
  // Emphasis/Italic
  em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
  
  // Horizontal Rule
  hr: ({node, ...props}) => <hr className="my-4 border-gray-300" {...props} />,
  
  // Table
  table: ({node, ...props}) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border border-gray-300 rounded-lg" {...props} />
    </div>
  ),
  thead: ({node, ...props}) => <thead className="bg-gray-100" {...props} />,
  tbody: ({node, ...props}) => <tbody {...props} />,
  tr: ({node, ...props}) => <tr className="border-b border-gray-300" {...props} />,
  th: ({node, ...props}) => <th className="px-4 py-2 text-left font-semibold text-gray-800 border-r border-gray-300 last:border-r-0" {...props} />,
  td: ({node, ...props}) => <td className="px-4 py-2 text-gray-800 border-r border-gray-300 last:border-r-0" {...props} />,
};

function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationsList, setConversationsList] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newChatLoading, setNewChatLoading] = useState(false);
  const [lang, setLang] = useState('en'); // EN/AR switch
  const [downloading, setDownloading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id); // Default to first model
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleLogout = () => logout();
  const handleLanguageUpdate = () => {
    if (!user?.user?.id) return;

    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang); // update state for UI

    updateLanguage(user.user.id, newLang, user.token)
      .then(success => {
        if (success) {
          setUser(prev => ({ ...prev, user: { ...prev.user, language: newLang } }));
          localStorage.setItem('user', JSON.stringify({ ...user, user: { ...user.user, language: newLang } }));
        }
      })
      .catch(err => console.error('Error updating language:', err));
  };

  // Handle model selection
  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    setShowModelDropdown(false);
    console.log('Selected model:', modelId);
  };

  // PDF Download Function
  const downloadConversationAsPDF = async () => {
    if (!activeConversation) return;
    
    const conversation = conversationsList.find(c => c.id === activeConversation);
    if (!conversation?.messages?.length) return;

    setDownloading(true);
    
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download PDF');
        return;
      }

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <meta charset="UTF-8">
          <title>${conversation.summary || 'Chat Conversation'}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: white;
            }
            ${lang === 'ar' ? `
              body { font-family: 'Segoe UI', 'Arial', sans-serif; }
            ` : ''}
            .header {
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              color: #1f2937;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .metadata {
              color: #6b7280;
              font-size: 14px;
            }
            .message {
              margin-bottom: 25px;
              padding: 15px;
              border-radius: 10px;
              border-left: 4px solid;
            }
            .user-message {
              background: #f8fafc;
              border-left-color: #3b82f6;
              margin-${lang === 'ar' ? 'right' : 'left'}: 50px;
            }
            .assistant-message {
              background: #f0fdf4;
              border-left-color: #10b981;
              margin-${lang === 'ar' ? 'left' : 'right'}: 50px;
            }
            .role {
              font-weight: bold;
              margin-bottom: 8px;
              color: #374151;
            }
            .content {
              white-space: pre-wrap;
              margin-bottom: 5px;
            }
            .timestamp {
              font-size: 12px;
              color: #9ca3af;
              text-align: ${lang === 'ar' ? 'left' : 'right'};
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${conversation.summary || 'Chat Conversation'}</h1>
            <div class="metadata">
              ${formatDate(conversation.createdAt)} • ${conversation.messages.length} messages
            </div>
          </div>

          <div class="messages">
            ${conversation.messages.map((message, index) => `
              <div class="message ${message.role === 'user' ? 'user-message' : 'assistant-message'}">
                <div class="role">${message.role === 'user' ? (lang === 'ar' ? 'المستخدم' : 'User') : 'AI Assistant'}</div>
                <div class="content">${message.content}</div>
                <div class="timestamp">${formatDate(message.createdAt)}</div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>${lang === 'ar' ? 'تم إنشاء هذا المستند تلقائياً' : 'This document was generated automatically'}</p>
            <p>${new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</p>
          </div>

          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            ">
              ${lang === 'ar' ? 'اطبع المستند' : 'Print Document'}
            </button>
            <button onclick="window.close()" style="
              background: #6b7280;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin-${lang === 'ar' ? 'right' : 'left'}: 10px;
            ">
              ${lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>

          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => {
                window.close();
              }, 1000);
            }, 500);
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(lang === 'ar' ? 'خطأ في تحميل الملف' : 'Error downloading file');
    } finally {
      setDownloading(false);
    }
  };

  const handleNewChat = async () => {
    if (!user?.user?.id) return;
    setNewChatLoading(true);
    try {
      const data = await startNewConversation(user.user.id, user.token);
      if (!data) return;

      const newConv = {
        id: data.conversationId,
        messages: data.messages || [],
        summary: data.summary || translations[lang].newChat,
        title: data.title || translations[lang].newChat,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        reply: data.reply || null,
      };

      setConversationsList(prev => [newConv, ...prev]);
      setActiveConversation(newConv.id);
    } catch (err) {
      console.error('Error starting new conversation:', err);
    } finally {
      setNewChatLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !activeConversation) return;
    setLoading(true);

    const tempMessage = { role: "user", content: currentMessage };
    setConversationsList(prev =>
      prev.map(conv =>
        conv.id === activeConversation
          ? { ...conv, messages: [...(conv.messages || []), tempMessage] }
          : conv
      )
    );
    setCurrentMessage('');

    try {
      const data = await addMessageToConversation(
        activeConversation, 
        tempMessage.content, 
        user.token,
        selectedModel
      );
      if (!data) return;

      setConversationsList(prev =>
        prev.map(conv =>
          conv.id === activeConversation
            ? {
                ...conv,
                summary: data.summary || conv.summary,
                messages: [
                  ...(conv.messages || []).filter(msg => msg !== tempMessage),
                  tempMessage,
                  { role: "assistant", content: data.reply }
                ]
              }
            : conv
        )
      );
    } catch (err) {
      console.error('Error adding message:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.user?.id) {
      setUser(storedUser);
      setLang(storedUser.user.language || 'en');
    }
  }, []);

  useEffect(() => {
    if (!user?.user?.id) return;
    getConversations(user.user.id, user.token)
      .then(data => {
        setConversationsList(data.conversations);
        if (!activeConversation && data.conversations.length > 0) setActiveConversation(data.conversations[0].id);
      })
      .catch(err => console.error('Error fetching conversations:', err));
  }, [user]);

  const filteredConversations = conversationsList.filter(conv =>
    (conv.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversationsList.find(c => c.id === activeConversation);
  const selectedModelData = AVAILABLE_MODELS.find(model => model.id === selectedModel);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <button
            onClick={handleNewChat}
            disabled={newChatLoading}
            className="flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {newChatLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <MessageSquarePlus size={20} />}
            <span className="font-medium">{newChatLoading ? 'Loading...' : translations[lang].newChat}</span>
          </button>
          <button
            onClick={handleLanguageUpdate}
            className="ml-2 px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {lang === 'en' ? 'EN' : 'AR'}
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={translations[lang].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {filteredConversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors group hover:bg-gray-800 ${activeConversation === conv.id ? 'bg-gray-800' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{conv.summary}</h3>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {conv.messages?.[conv.messages.length - 1]?.content || translations[lang].noMessages}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{conv.createdAt}</p>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded cursor-pointer">
                  <MoreVertical size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.user?.name || translations[lang].userProfile}</p>
              <p className="text-xs text-gray-400">{user?.user?.email || 'john@example.com'}</p>
            </div>
            <div className="flex gap-1">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors"><Settings size={18} /></button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" onClick={handleLogout}><LogOut size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{activeConv?.summary || translations[lang].newChat}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Model Selection Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <span>{selectedModelData?.name}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showModelDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 px-3 py-2">{translations[lang].selectModel}</p>
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedModel === model.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-gray-500">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Download PDF Button */}
            {activeConv?.messages?.length > 0 && (
              <button
                onClick={downloadConversationAsPDF}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {downloading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Download size={16} />
                )}
                <span>{downloading ? translations[lang].downloading : translations[lang].download}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {(activeConv?.messages || []).map((message, index) => (
            <div key={index} className={`py-8 px-6 ${message?.role === 'assistant' ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="max-w-3xl mx-auto flex gap-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message?.role === 'assistant' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                  {message?.role === 'assistant' ? <span className="text-white font-bold text-sm">AI</span> : <User size={18} className="text-white" />}
                </div>
                <div className="flex-1 space-y-2">
                  {message?.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown components={MarkdownComponents}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!activeConv?.messages?.length && <p className="text-center text-gray-400 py-8">{translations[lang].noMessages}</p>}
        </div>

        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder={translations[lang].inputPlaceholder}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-40"
                  disabled={loading}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) e.preventDefault(); }}
                />
                {loading && <Loader2 className="absolute right-3 top-1/4 h-5 w-5 animate-spin text-gray-800" />}
              </div>
              <button onClick={handleSubmit} disabled={!currentMessage.trim() || loading} className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors">
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">{translations[lang].disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;