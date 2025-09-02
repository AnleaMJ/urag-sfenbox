export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  variations?: string[];
  confidence?: number;
}

export interface Document {
  id: string;
  content: string;
  augmentedContent: string;
  summary: string;
  metadata: {
    url: string;
    title: string;
    section: string;
  };
  embedding?: number[];
}

export interface SearchResult {
  type: 'faq' | 'document' | 'fallback';
  content: string;
  confidence: number;
  sources?: string[];
  faqId?: string;
  documentIds?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  searchResult?: SearchResult;
}