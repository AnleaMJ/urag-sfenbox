import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { URAGStats } from './components/URAGStats';
import { ChatMessage as ChatMessageType } from './types/urag';
import { uragService } from './services/uragService';
import { MessageCircle, Bot, Sparkles } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessageType = {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your SFIT admission assistant powered by the URAG framework. I can help you with questions about admissions, courses, fees, hostel facilities, and campus life. What would you like to know?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const searchResult = await uragService.query(messageText);
      
      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: searchResult.content,
        timestamp: new Date(),
        searchResult
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try again or contact our admissions office directly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, orange 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, green 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-orange-100">
            <div className="relative">
              <Bot size={40} className="text-orange-600" />
              <Sparkles size={16} className="absolute -top-1 -right-1 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                SFIT Admission Assistant
              </h1>
              <p className="text-gray-600 text-sm">Powered by URAG Framework</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <URAGStats />
            
            {messages.length <= 1 && (
              <SuggestedQuestions 
                onSelectQuestion={handleSuggestedQuestion}
                disabled={isLoading}
              />
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                <div className="flex items-center gap-3">
                  <MessageCircle size={24} />
                  <div>
                    <h2 className="font-semibold">Chat with URAG Assistant</h2>
                    <p className="text-sm opacity-90">Ask anything about SFIT admissions</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-orange-100 to-green-100 backdrop-blur-sm p-4 rounded-2xl rounded-bl-none max-w-xs border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm ml-2">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <ChatInput 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;