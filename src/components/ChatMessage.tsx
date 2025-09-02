import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/urag';
import { User, Bot, ExternalLink, Info } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg mb-4`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-700">
            {isUser ? 'You' : 'URAG Assistant'}
          </span>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="text-gray-800 leading-relaxed">
          {message.content}
        </div>
        
        {/* Search Result Metadata */}
        {message.searchResult && !isUser && (
          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Search Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium text-gray-500">Method:</span>
                <span className="ml-2 capitalize bg-gray-100 px-2 py-1 rounded">
                  {message.searchResult.type}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Confidence:</span>
                <span className="ml-2">
                  {(message.searchResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* Sources */}
            {message.searchResult.sources && message.searchResult.sources.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500">Sources:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {message.searchResult.sources.map((source, index) => (
                    <a
                      key={index}
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
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
    </div>
  );
};