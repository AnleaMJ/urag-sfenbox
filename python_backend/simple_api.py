"""
FastAPI Backend Server for URAG Chatbot - Simplified Version
Provides REST API endpoints for the React frontend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="URAG College Admission Chatbot API",
    description="Backend API for the Unified RAG framework chatbot",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Mock responses for testing
def get_mock_response(question: str) -> QueryResponse:
    question_lower = question.lower()
    
    if "admission" in question_lower or "apply" in question_lower:
        return QueryResponse(
            response="For admission to SFIT, you need to meet the eligibility criteria for your chosen program. Generally, you need to pass the qualifying examination (10+2 for UG, graduation for PG) and clear any entrance exams if required. Please visit our admissions office or check our website for detailed requirements.",
            type="FAQ",
            confidence=0.92,
            sources=["FAQ Database"],
            faq_id="faq_001",
            matched_question="What are the admission requirements?"
        )
    elif "fee" in question_lower or "cost" in question_lower or "tuition" in question_lower:
        return QueryResponse(
            response="Fee structure varies by program and category. For detailed fee information including tuition, admission fees, and other charges, please contact our accounts office or download the fee structure from our official website.",
            type="FAQ",
            confidence=0.88,
            sources=["FAQ Database"],
            faq_id="faq_002",
            matched_question="What are the fees?"
        )
    elif "course" in question_lower or "program" in question_lower or "branch" in question_lower:
        return QueryResponse(
            response="SFIT offers various undergraduate and postgraduate programs in Engineering, Management, and other fields. Popular programs include Computer Engineering, Electronics, Mechanical, Civil, and MBA. Please check our academic catalog for the complete list of courses and their curriculum.",
            type="Document",
            confidence=0.85,
            sources=["Academic Catalog", "Course Documents"],
            document_ids=["doc_001", "doc_002"]
        )
    elif "placement" in question_lower or "job" in question_lower or "career" in question_lower:
        return QueryResponse(
            response="SFIT has a dedicated Training and Placement cell that assists students with career opportunities. We have good placement records with various companies visiting our campus for recruitment. The placement cell also provides training, soft skills development, and career guidance.",
            type="Document",
            confidence=0.80,
            sources=["Placement Cell Documents"],
            document_ids=["doc_003"]
        )
    elif "hostel" in question_lower or "accommodation" in question_lower:
        return QueryResponse(
            response="SFIT provides hostel facilities for both boys and girls. The hostels are well-equipped with basic amenities. For hostel admission, availability, and fees, please contact the hostel administration office.",
            type="FAQ",
            confidence=0.75,
            sources=["Hostel Information"],
            faq_id="faq_003"
        )
    else:
        return QueryResponse(
            response="Thank you for your question about SFIT. For specific information that I couldn't find in our database, please contact our office directly at +91-22-26702300 or visit our website at https://sfit.ac.in. Our staff will be happy to assist you with detailed information.",
            type="Fallback",
            confidence=0.50,
            sources=["General Information"]
        )

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "URAG College Admission Chatbot API",
        "status": "running",
        "framework": "Unified RAG (URAG)",
        "college": "St. Francis Institute of Technology (SFIT)"
    }

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process user query through URAG framework"""
    try:
        # Use mock response for now
        result = get_mock_response(request.question)
        return result
    
    except Exception as e:
        print(f"Error processing query: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error processing your question. Please try again."
        )

@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get URAG framework statistics"""
    return StatsResponse(
        faq_count=25,
        document_count=15,
        total_variations=150,
        framework_status="operational"
    )

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "urag_engine": "mock_mode",
        "vector_stores": {
            "faq": "mock_loaded",
            "documents": "mock_loaded"
        },
        "environment": {
            "firecrawl_configured": bool(os.getenv('FIRECRAWL_API_KEY')),
            "huggingface_configured": bool(os.getenv('HUGGINGFACEHUB_API_TOKEN')),
            "openai_configured": bool(os.getenv('OPENAI_API_KEY', '').replace('your_openai_key_here', '')),
        }
    }

if __name__ == "__main__":
    print("Starting URAG Chatbot API Server...")
    print("API will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        "simple_api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
