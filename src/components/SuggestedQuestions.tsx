import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';

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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle size={20} className="text-orange-600" />
        <h3 className="font-semibold text-gray-800">Suggested Questions</h3>
      </div>
      
      <div className="space-y-2">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            disabled={disabled}
            className="w-full text-left p-3 text-sm bg-gradient-to-r from-orange-50 to-green-50 hover:from-orange-100 hover:to-green-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-100 hover:border-orange-200 group hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700 group-hover:text-gray-800">{question}</span>
              <ArrowRight size={14} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};