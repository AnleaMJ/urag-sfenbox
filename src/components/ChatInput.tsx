import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="border-t border-orange-100 bg-white/60 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about admissions, courses, fees, or any other college-related questions..."
            className="w-full p-4 pr-12 border border-orange-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-800"
            rows={Math.min(4, Math.max(1, message.split('\n').length))}
            disabled={disabled || isLoading}
          />
          <Sparkles size={16} className="absolute right-4 top-4 text-orange-400" />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium min-w-[120px] justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Thinking...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};