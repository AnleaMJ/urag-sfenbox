import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/urag';
import { User, Bot, ExternalLink, Info, CheckCircle, FileText, MessageSquare } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
          <Bot size={18} />
        </div>
      )}
      
      <div className={`max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div className={`p-4 rounded-2xl shadow-sm border ${
          isUser 
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none border-green-200' 
            : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-none border-orange-100'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          
          <div className={`text-xs mt-2 ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        {/* Search Result Metadata */}
        {message.searchResult && !isUser && (
          <div className="mt-2 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-orange-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-orange-600" />
              <span className="text-xs font-medium text-gray-700">Search Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Method:</span>
                <div className="flex items-center gap-1">
                  {message.searchResult.type === 'faq' && <MessageSquare size={12} className="text-orange-500" />}
                  {message.searchResult.type === 'document' && <FileText size={12} className="text-green-500" />}
                  {message.searchResult.type === 'fallback' && <Info size={12} className="text-gray-500" />}
                  <span className="capitalize bg-gradient-to-r from-orange-100 to-green-100 px-2 py-1 rounded-full text-gray-700">
                    {message.searchResult.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Confidence:</span>
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className="font-medium text-gray-800">
                    {(message.searchResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Sources */}
            {message.searchResult.sources && message.searchResult.sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-orange-100">
                <span className="text-xs font-medium text-gray-600 mb-2 block">Sources:</span>
                <div className="flex flex-wrap gap-1">
                  {message.searchResult.sources.map((source, index) => (
                    <a
                      key={index}
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 bg-gradient-to-r from-orange-50 to-green-50 hover:from-orange-100 hover:to-green-100 px-2 py-1 rounded-full transition-all duration-200 border border-orange-200"
                    >
                      <ExternalLink size={10} />
                      {source.split('/').pop() || 'Source'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg">
          <User size={18} />
        </div>
      )}
    </div>
  );
};