import React from 'react';
import { Database, MessageCircle, FileText, BarChart3 } from 'lucide-react';
import { uragService } from '../services/uragService';

export const URAGStats: React.FC = () => {
  const faqStats = uragService.getFAQStats();
  const docStats = uragService.getDocumentStats();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">URAG Framework Status</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <MessageCircle size={24} className="text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{faqStats.totalFAQs}</div>
          <div className="text-sm text-gray-600">FAQs</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <FileText size={24} className="text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{docStats.totalDocuments}</div>
          <div className="text-sm text-gray-600">Documents</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Database size={24} className="text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{faqStats.totalVariations}</div>
          <div className="text-sm text-gray-600">FAQ Variations</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <BarChart3 size={24} className="text-orange-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-800">{docStats.totalSections}</div>
          <div className="text-sm text-gray-600">Content Sections</div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Framework: Two-tier search (FAQ → Documents → Fallback) with confidence thresholds
      </div>
    </div>
  );
};