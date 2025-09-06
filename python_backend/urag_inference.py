"""
Step 4: URAG Inference Engine
Implements the two-tier search with fallback mechanism
"""

import json
import os
from typing import Dict, Any, Optional, List
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEndpoint, HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from config import Config

class URAGInference:
    def __init__(self):
        # Initialize components
        os.environ["HUGGINGFACEHUB_API_TOKEN"] = Config.HUGGINGFACEHUB_API_TOKEN

        self.llm = HuggingFaceEndpoint(
            repo_id=Config.LLM_MODEL,
            huggingfacehub_api_token=Config.HUGGINGFACEHUB_API_TOKEN,
            temperature=0.7,
            top_p=0.95,
            max_new_tokens=512
        )

        self.embeddings = HuggingFaceEmbeddings(
            model_name=Config.EMBEDDING_MODEL
        )

        # Load vector stores
        self.faq_vectorstore = None
        self.doc_vectorstore = None
        self.faq_retriever = None
        self.doc_retriever = None
        self._load_vector_stores()

        # Setup retrievers
        self._setup_retrievers()

        # Setup chains
        self._setup_chains()
    
    def _load_vector_stores(self):
        """Load existing vector stores"""
        try:
            self.faq_vectorstore = Chroma(
                collection_name=Config.FAQ_COLLECTION,
                embedding_function=self.embeddings,
                persist_directory=Config.VECTOR_STORE_DIR
            )
            
            self.doc_vectorstore = Chroma(
                collection_name=Config.DOC_COLLECTION,
                embedding_function=self.embeddings,
                persist_directory=Config.VECTOR_STORE_DIR
            )
            
            print("Vector stores loaded successfully.")
            
        except Exception as e:
            print(f"Error loading vector stores: {e}")
            print("Run vector_indexing.py first to create indexes.")
    
    def _setup_retrievers(self):
        """Setup retrievers with thresholds from paper"""
        if self.faq_vectorstore:
            self.faq_retriever = self.faq_vectorstore.as_retriever(
                search_type="similarity_score_threshold",
                search_kwargs={
                    "score_threshold": Config.FAQ_THRESHOLD,
                    "k": Config.FAQ_LIMIT
                }
            )
        
        if self.doc_vectorstore:
            self.doc_retriever = self.doc_vectorstore.as_retriever(
                search_type="similarity_score_threshold",
                search_kwargs={
                    "score_threshold": Config.DOC_THRESHOLD,
                    "k": Config.DOC_LIMIT
                }
            )
    
    def _setup_chains(self):
        """Setup LangChain chains for RAG and fallback"""
        # RAG chain for document-based responses
        self.rag_prompt = ChatPromptTemplate.from_template(
            """You are a helpful college admission assistant. Answer the student's question based on the provided context.
            Be specific, accurate, and helpful. If the context doesn't contain enough information, say so.

            Context: {context}

            Question: {question}

            Answer:"""
        )

        if self.doc_retriever is not None:
            self.rag_chain = (
                {"context": self.doc_retriever, "question": RunnablePassthrough()}
                | self.rag_prompt
                | self.llm
                | StrOutputParser()
            )
        else:
            self.rag_chain = None

        # Fallback chain
        self.fallback_prompt = ChatPromptTemplate.from_template(
            """You are a college admission assistant. Provide a helpful general response to this question.
            Always end with a disclaimer to verify information with official sources.

            Question: {question}

            Response:"""
        )
        
        self.fallback_chain = (
            self.fallback_prompt
            | self.llm
            | StrOutputParser()
        )
    
    def search_faqs(self, query: str) -> Optional[Dict[str, Any]]:
        """Tier 1: FAQ Search"""
        if not self.faq_retriever:
            return None
        
        try:
            faq_results = self.faq_retriever.invoke(query)
            
            if faq_results:
                # Get the best matching FAQ
                top_faq = faq_results[0]
                confidence = getattr(top_faq, 'score', 0.95)  # Default high confidence for FAQ hits
                
                return {
                    "type": "faq",
                    "content": top_faq.metadata["answer"],
                    "confidence": confidence,
                    "faq_id": top_faq.metadata["faq_id"],
                    "matched_question": top_faq.page_content
                }
        
        except Exception as e:
            print(f"Error in FAQ search: {e}")
        
        return None
    
    def search_documents(self, query: str) -> Optional[Dict[str, Any]]:
        """Tier 2: Document Search with RAG"""
        if not self.doc_retriever or not self.rag_chain:
            return None
        
        try:
            doc_results = self.doc_retriever.invoke(query)
            
            if doc_results:
                # Generate RAG response
                response = self.rag_chain.invoke(query)
                
                # Extract sources
                sources = [doc.metadata["url"] for doc in doc_results if doc.metadata.get("url")]
                document_ids = [doc.metadata["doc_id"] for doc in doc_results]
                
                # Calculate confidence (average of document scores)
                confidence = sum(getattr(doc, 'score', 0.8) for doc in doc_results) / len(doc_results)
                
                return {
                    "type": "document",
                    "content": response,
                    "confidence": confidence,
                    "sources": sources,
                    "document_ids": document_ids
                }
        
        except Exception as e:
            print(f"Error in document search: {e}")
        
        return None
    
    def generate_fallback(self, query: str) -> Dict[str, Any]:
        """Tier 3: Fallback Response"""
        try:
            response = self.fallback_chain.invoke({"question": query})
            
            # Add disclaimer
            disclaimer = "\n\n*Disclaimer: This is a general response. Please verify with official college sources for the most current and accurate information.*"
            
            return {
                "type": "fallback",
                "content": response + disclaimer,
                "confidence": 0.3
            }
        
        except Exception as e:
            print(f"Error in fallback generation: {e}")
            return {
                "type": "fallback",
                "content": "I apologize, but I'm unable to process your question right now. Please contact the admissions office directly for assistance.",
                "confidence": 0.1
            }
    
    def query(self, user_query: str) -> Dict[str, Any]:
        """
        Main URAG inference method
        Implements Algorithm 3 from the paper
        """
        print(f"Processing query: {user_query}")
        
        # Tier 1: FAQ Search
        faq_result = self.search_faqs(user_query)
        if faq_result and faq_result["confidence"] >= Config.FAQ_THRESHOLD:
            print(f"FAQ hit with confidence {faq_result['confidence']:.3f}")
            return faq_result
        
        # Tier 2: Document Search
        doc_result = self.search_documents(user_query)
        if doc_result and doc_result["confidence"] >= Config.DOC_THRESHOLD:
            print(f"Document hit with confidence {doc_result['confidence']:.3f}")
            return doc_result
        
        # Tier 3: Fallback
        print("Using fallback response")
        return self.generate_fallback(user_query)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get system statistics"""
        stats = {
            "faq_count": 0,
            "document_count": 0,
            "total_variations": 0
        }
        
        try:
            if self.faq_vectorstore:
                faq_collection = self.faq_vectorstore._collection
                stats["faq_count"] = faq_collection.count()
            
            if self.doc_vectorstore:
                doc_collection = self.doc_vectorstore._collection
                stats["document_count"] = doc_collection.count()
            
            # Load FAQ data for variation count
            with open(Config.ENRICHED_FAQS_FILE, 'r', encoding='utf-8') as f:
                faqs = json.load(f)
                stats["total_variations"] = sum(len(faq.get("variations", [])) for faq in faqs)
        
        except Exception as e:
            print(f"Error getting stats: {e}")
        
        return stats

if __name__ == "__main__":
    # Test inference
    inference = URAGInference()
    
    # Test queries
    test_queries = [
        "What are the admission requirements for engineering?",
        "What is the fee structure?",
        "Tell me about hostel facilities",
        "How is the placement record?"
    ]
    
    for query in test_queries:
        print(f"\n{'='*50}")
        result = inference.query(query)
        print(f"Query: {query}")
        print(f"Type: {result['type']}")
        print(f"Confidence: {result['confidence']:.3f}")
        print(f"Response: {result['content'][:200]}...")