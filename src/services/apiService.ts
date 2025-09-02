// API service for communicating with Python backend
const API_BASE_URL = 'http://localhost:8000';

export interface QueryRequest {
  question: string;
  conversation_id?: string;
}

export interface QueryResponse {
  response: string;
  type: 'faq' | 'document' | 'fallback';
  confidence: number;
  sources?: string[];
  faq_id?: string;
  document_ids?: string[];
  matched_question?: string;
}

export interface StatsResponse {
  faq_count: number;
  document_count: number;
  total_variations: number;
  framework_status: string;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Cannot connect to URAG backend. Make sure the Python API server is running on port 8000.');
      }
      throw error;
    }
  }

  async query(request: QueryRequest): Promise<QueryResponse> {
    return this.makeRequest<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getStats(): Promise<StatsResponse> {
    return this.makeRequest<StatsResponse>('/stats');
  }

  async healthCheck(): Promise<{ status: string; urag_engine: string }> {
    return this.makeRequest<{ status: string; urag_engine: string }>('/health');
  }
}

export const apiService = new ApiService();