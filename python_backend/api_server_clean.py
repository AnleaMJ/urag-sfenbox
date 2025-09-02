"""
FastAPI Backend Server for URAG Chatbot
Provides REST API endpoints for the React frontend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import os
from urag_inference import URAGInference

# Initialize FastAPI app
app = FastAPI(
    title="URAG College Admission Chatbot API",
    description="Backend API for the Unified RAG framework chatbot",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize URAG inference engine
urag_engine = None

@app.on_event("startup")
async def startup_event():
    """Initialize URAG engine on startup"""
    global urag_engine
    try:
        urag_engine = URAGInference()
        print("URAG inference engine initialized successfully")
    except Exception as e:
        print(f"Error initializing URAG engine: {e}")
        urag_engine = None

# Request/Response models
class QueryRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None

class QueryResponse(BaseModel):
    response: str
    type: str
    confidence: float
    sources: List[str] = []
    faq_id: Optional[str] = None
    document_ids: List[str] = []
    matched_question: Optional[str] = None

class StatsResponse(BaseModel):
    faq_count: int
    document_count: int
    total_variations: int
    framework_status: str

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "URAG College Admission Chatbot API",
        "status": "running",
        "framework": "Unified RAG (URAG)"
    }

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process user query through URAG framework"""
    if not urag_engine:
        raise HTTPException(
            status_code=503,
            detail="URAG engine not initialized. Please check server logs."
        )
    
    try:
        # Process query through URAG
        result = urag_engine.query(request.question)
        
        return QueryResponse(
            response=result["content"],
            type=result["type"],
            confidence=result["confidence"],
            sources=result.get("sources", []),
            faq_id=result.get("faq_id"),
            document_ids=result.get("document_ids", []),
            matched_question=result.get("matched_question")
        )
    
    except Exception as e:
        print(f"Error processing query: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error processing your question. Please try again."
        )

@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get URAG framework statistics"""
    if not urag_engine:
        raise HTTPException(
            status_code=503,
            detail="URAG engine not initialized"
        )
    
    try:
        stats = urag_engine.get_stats()
        
        return StatsResponse(
            faq_count=stats["faq_count"],
            document_count=stats["document_count"],
            total_variations=stats["total_variations"],
            framework_status="operational"
        )
    
    except Exception as e:
        print(f"Error getting stats: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving system statistics"
        )

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy" if urag_engine else "unhealthy",
        "urag_engine": "initialized" if urag_engine else "not_initialized",
        "vector_stores": {
            "faq": "loaded" if urag_engine and urag_engine.faq_vectorstore else "not_loaded",
            "documents": "loaded" if urag_engine and urag_engine.doc_vectorstore else "not_loaded"
        }
    }

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
