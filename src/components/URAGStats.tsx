import React from 'react';
import { Database, MessageCircle, FileText, BarChart3, Zap } from 'lucide-react';
import { uragService } from '../services/uragService';

export const URAGStats: React.FC = () => {
  const faqStats = uragService.getFAQStats();
  const docStats = uragService.getDocumentStats();
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-orange-600" />
        <h3 className="font-semibold text-gray-800">Framework Status</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <MessageCircle size={20} className="text-orange-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{faqStats.totalFAQs}</div>
          <div className="text-xs text-gray-600">FAQs</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <FileText size={20} className="text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{docStats.totalDocuments}</div>
          <div className="text-xs text-gray-600">Documents</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-green-50 rounded-xl border border-orange-200">
          <Database size={20} className="text-orange-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{faqStats.totalVariations}</div>
          <div className="text-xs text-gray-600">Variations</div>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border border-green-200">
          <Zap size={20} className="text-green-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{docStats.totalSections}</div>
          <div className="text-xs text-gray-600">Sections</div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-orange-100 to-green-100 rounded-lg border border-orange-200">
        <div className="text-xs text-gray-700 text-center font-medium">
          🔍 Two-tier Search Active
        </div>
        <div className="text-xs text-gray-600 text-center mt-1">
          FAQ → Documents → Fallback
        </div>
      </div>
    </div>
  );
};