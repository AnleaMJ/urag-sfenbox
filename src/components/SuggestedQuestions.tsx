import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What are the admission requirements for engineering?",
  "What is the fee structure for undergraduate programs?",
  "When do admissions open for next year?",
  "What courses are available at SFIT?",
  "Is hostel facility available?",
  "Tell me about placement statistics",
  "What is the campus infrastructure like?",
  "How is student life at SFIT?"
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  onSelectQuestion, 
  disabled 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">Suggested Questions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            disabled={disabled}
            className="text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-200"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};