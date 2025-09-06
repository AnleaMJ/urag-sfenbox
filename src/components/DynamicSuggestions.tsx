import React from 'react';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

interface DynamicSuggestionsProps {
  lastUserQuestion: string | null;
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

const SUGGESTION_CATEGORIES = {
  admission: [
    "What documents are required for admission?",
    "What is the admission process timeline?",
    "Are there any entrance exams required?",
    "What are the eligibility criteria for different courses?"
  ],
  fees: [
    "Are there any scholarships available?",
    "What are the payment options for fees?",
    "Are there any additional charges apart from tuition?",
    "What is the refund policy for fees?"
  ],
  courses: [
    "What is the curriculum structure?",
    "Are there any specializations available?",
    "What are the career prospects after this course?",
    "What is the duration of the program?"
  ],
  placement: [
    "What companies visit for campus recruitment?",
    "What is the average salary package?",
    "What training is provided for placements?",
    "What is the placement percentage?"
  ],
  hostel: [
    "What are the hostel rules and regulations?",
    "What facilities are available in the hostel?",
    "How much are the hostel fees?",
    "Is hostel accommodation guaranteed?"
  ],
  campus: [
    "What sports facilities are available?",
    "Are there any clubs and societies?",
    "What is the library facility like?",
    "What about transportation to the campus?"
  ],
  faculty: [
    "What are the qualifications of faculty members?",
    "What is the student-teacher ratio?",
    "Are there research opportunities?",
    "What teaching methodology is followed?"
  ],
  general: [
    "Tell me about the college infrastructure",
    "What are the college timings?",
    "How is the college ranking?",
    "What makes this college unique?"
  ]
};

const categorizeQuestion = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('admission') || lowerQuestion.includes('apply') || lowerQuestion.includes('requirement')) {
    return 'admission';
  } else if (lowerQuestion.includes('fee') || lowerQuestion.includes('cost') || lowerQuestion.includes('tuition') || lowerQuestion.includes('payment')) {
    return 'fees';
  } else if (lowerQuestion.includes('course') || lowerQuestion.includes('program') || lowerQuestion.includes('curriculum') || lowerQuestion.includes('subject')) {
    return 'courses';
  } else if (lowerQuestion.includes('placement') || lowerQuestion.includes('job') || lowerQuestion.includes('career') || lowerQuestion.includes('company')) {
    return 'placement';
  } else if (lowerQuestion.includes('hostel') || lowerQuestion.includes('accommodation') || lowerQuestion.includes('residence')) {
    return 'hostel';
  } else if (lowerQuestion.includes('campus') || lowerQuestion.includes('facility') || lowerQuestion.includes('infrastructure') || lowerQuestion.includes('library')) {
    return 'campus';
  } else if (lowerQuestion.includes('faculty') || lowerQuestion.includes('teacher') || lowerQuestion.includes('professor') || lowerQuestion.includes('research')) {
    return 'faculty';
  } else {
    return 'general';
  }
};

export const DynamicSuggestions: React.FC<DynamicSuggestionsProps> = ({ 
  lastUserQuestion, 
  onSelectQuestion, 
  disabled 
}) => {
  const category = lastUserQuestion ? categorizeQuestion(lastUserQuestion) : 'general';
  const suggestions = SUGGESTION_CATEGORIES[category] || SUGGESTION_CATEGORIES.general;
  
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'admission': return '📝';
      case 'fees': return '💰';
      case 'courses': return '📚';
      case 'placement': return '💼';
      case 'hostel': return '🏠';
      case 'campus': return '🏫';
      case 'faculty': return '👨‍🏫';
      default: return '💡';
    }
  };

  const getCategoryName = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-orange-600" />
          <Sparkles size={16} className="text-green-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Related Questions</h3>
          <p className="text-xs text-gray-600">
            {getCategoryIcon(category)} {getCategoryName(category)} related
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            disabled={disabled}
            className="w-full text-left p-3 text-sm bg-gradient-to-r from-orange-50 to-green-50 hover:from-orange-100 hover:to-green-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-100 hover:border-orange-200 group hover:shadow-md transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700 group-hover:text-gray-800 leading-relaxed">{question}</span>
              <ArrowRight size={14} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-2 bg-gradient-to-r from-orange-100/50 to-green-100/50 rounded-lg border border-orange-200/50">
        <div className="text-xs text-gray-600 text-center">
          💡 Questions adapt based on your previous query
        </div>
      </div>
    </div>
  );
};