from fastapi import FastAPI, Request
from pydantic import BaseModel
from urag_preparation import URAGPreparation

app = FastAPI()
prep = URAGPreparation()

class QueryRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(req: QueryRequest):
    # For demo: just echo, replace with retrieval + LLM answer logic
    # You should load augmented docs, find relevant context, and generate answer
    return {"answer": f"You asked: {req.question}"}

# Add more endpoints as needed
