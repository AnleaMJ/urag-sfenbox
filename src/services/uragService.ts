import { FAQItem, Document, SearchResult } from '../types/urag';
import { searchSimilar } from '../utils/vectorSearch';
import { mockFAQs, mockDocuments } from '../data/mockData';

// URAG Configuration (from paper)
const URAG_CONFIG = {
  FAQ_THRESHOLD: 0.7,     // tFAQ from paper (adjusted for simplified similarity)
  DOC_THRESHOLD: 0.5,     // tDoc from paper (adjusted)
  FAQ_LIMIT: 3,
  DOC_LIMIT: 2
};

class URAGService {
  private faqs: FAQItem[] = [];
  private documents: Document[] = [];
  
  constructor() {
    this.initializeData();
  }
  
  private initializeData() {
    // In production, this would load from your vector store
    this.faqs = mockFAQs;
    this.documents = mockDocuments;
  }
  
  // Tier 1: FAQ Search
  private searchFAQs(query: string): SearchResult | null {
    const results = searchSimilar(query, this.faqs, URAG_CONFIG.FAQ_THRESHOLD, URAG_CONFIG.FAQ_LIMIT);
    
    if (results.length > 0) {
      const topResult = results[0];
      return {
        type: 'faq',
        content: topResult.answer,
        confidence: topResult.similarity,
        faqId: topResult.id
      };
    }
    
    return null;
  }
  
  // Tier 2: Document Search
  private searchDocuments(query: string): SearchResult | null {
    const results = searchSimilar(query, this.documents, URAG_CONFIG.DOC_THRESHOLD, URAG_CONFIG.DOC_LIMIT);
    
    if (results.length > 0) {
      // Simulate RAG response generation
      const context = results.map(doc => doc.augmentedContent).join('\n\n');
      const response = this.generateRAGResponse(query, context);
      
      return {
        type: 'document',
        content: response,
        confidence: results[0].similarity,
        sources: results.map(doc => doc.metadata.url),
        documentIds: results.map(doc => doc.id)
      };
    }
    
    return null;
  }
  
  // Tier 3: Fallback
  private generateFallback(query: string): SearchResult {
    const fallbackResponses = [
      "I understand you're asking about college admissions. For the most accurate and up-to-date information, please contact our admissions office directly or visit our official website.",
      "That's a great question about our college. I recommend reaching out to our admissions counselors who can provide you with detailed information specific to your situation.",
      "I want to make sure you get the most accurate information. Please check our official admissions portal or contact our help desk for specific details about this query."
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      type: 'fallback',
      content: `${randomResponse}\n\n*Disclaimer: This is a general response. Please verify with official sources for the most current information.*`,
      confidence: 0.3
    };
  }
  
  // Simulate RAG response generation
  private generateRAGResponse(query: string, context: string): string {
    // In production, this would use your LLM
    const responses = [
      `Based on the available information: ${context.substring(0, 200)}...`,
      `According to our records: ${context.substring(0, 200)}...`,
      `From the official documentation: ${context.substring(0, 200)}...`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Main URAG inference method
  public async query(userQuery: string): Promise<SearchResult> {
    try {
      // Step 1: Try FAQ search (Tier 1)
      const faqResult = this.searchFAQs(userQuery);
      if (faqResult) {
        return faqResult;
      }
      
      // Step 2: Try document search (Tier 2)
      const docResult = this.searchDocuments(userQuery);
      if (docResult) {
        return docResult;
      }
      
      // Step 3: Fallback (Tier 3)
      return this.generateFallback(userQuery);
      
    } catch (error) {
      console.error('URAG inference error:', error);
      return {
        type: 'fallback',
        content: 'I apologize, but I encountered an error processing your question. Please try again or contact our admissions office directly.',
        confidence: 0.1
      };
    }
  }
  
  // Get FAQ statistics
  public getFAQStats() {
    return {
      totalFAQs: this.faqs.length,
      totalVariations: this.faqs.reduce((sum, faq) => sum + (faq.variations?.length || 0), 0)
    };
  }
  
  // Get document statistics
  public getDocumentStats() {
    return {
      totalDocuments: this.documents.length,
      totalSections: [...new Set(this.documents.map(doc => doc.metadata.section))].length
    };
  }
}

export const uragService = new URAGService();