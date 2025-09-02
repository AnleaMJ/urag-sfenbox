# URAG College Admission Chatbot Backend

This is the Python backend implementation of the Unified RAG (URAG) framework for a college admission chatbot, based on the research paper methodology.

## Setup Instructions

### 1. Environment Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required API keys:
- **Firecrawl API Key**: Get from [firecrawl.dev](https://firecrawl.dev)
- **Hugging Face Token**: Get from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- **OpenAI API Key** (optional): For better LLM performance

### 3. Run the Complete Pipeline

```bash
# Run the complete URAG preparation pipeline
python run_pipeline.py
```

This will:
1. Crawl your college website using Firecrawl
2. Apply URAG-D document augmentation
3. Apply URAG-F FAQ enrichment
4. Create vector indexes
5. Test the inference engine

### 4. Start the API Server

```bash
# Start FastAPI server
python api_server.py
```

The API will be available at `http://localhost:8000`

### 5. Test with Streamlit (Optional)

```bash
# Run Streamlit prototype
streamlit run streamlit_app.py
```

## API Endpoints

- `GET /` - Health check
- `POST /query` - Process user queries
- `GET /stats` - Get framework statistics
- `GET /health` - Detailed health check

## URAG Framework Implementation

### URAG-D (Document Augmentation)
- Semantic chunking of crawled content
- General context extraction
- Chunk rewriting for coherence
- Summary generation

### URAG-F (FAQ Enrichment)
- Q&A pair generation from documents
- Question paraphrasing for linguistic diversity
- FAQ database expansion

### Two-Tier Inference
1. **Tier 1**: FAQ search with high confidence threshold (0.9)
2. **Tier 2**: Document retrieval with RAG generation (0.8)
3. **Tier 3**: Fallback with disclaimer

## File Structure

```
python_backend/
├── requirements.txt          # Python dependencies
├── config.py                # Configuration settings
├── data_collection.py       # Step 1: Web crawling
├── urag_preparation.py      # Step 2: URAG-D and URAG-F
├── vector_indexing.py       # Step 3: Vector store creation
├── urag_inference.py        # Step 4: Inference engine
├── api_server.py           # FastAPI backend server
├── streamlit_app.py        # Streamlit prototype
├── run_pipeline.py         # Complete pipeline runner
└── data/
    ├── initial_faqs.json   # Seed FAQ data
    ├── college_data.json   # Crawled website data
    ├── augmented_docs.json # URAG-D output
    └── enriched_faqs.json  # URAG-F output
```

## Integration with React Frontend

The FastAPI server provides CORS-enabled endpoints that your React frontend can call:

```javascript
// Example API call from React
const response = await fetch('http://localhost:8000/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: "What are the admission requirements?"
  })
});

const result = await response.json();
```

## Customization

1. **College Website**: Update `COLLEGE_WEBSITE_URL` in `.env`
2. **Initial FAQs**: Edit `data/initial_faqs.json`
3. **Crawl Parameters**: Modify includes/excludes in `data_collection.py`
4. **Thresholds**: Adjust `FAQ_THRESHOLD` and `DOC_THRESHOLD` in `config.py`
5. **Models**: Change `EMBEDDING_MODEL` and `LLM_MODEL` in `config.py`

## Troubleshooting

1. **API Connection Issues**: Ensure the FastAPI server is running on port 8000
2. **Vector Store Errors**: Delete `vector_store/` directory and re-run pipeline
3. **Memory Issues**: Reduce batch sizes in processing scripts
4. **API Rate Limits**: Add delays between API calls in preparation scripts

## Production Deployment

For production deployment:
1. Use a proper WSGI server like Gunicorn
2. Set up proper logging and monitoring
3. Use a production vector database (Pinecone, Weaviate)
4. Implement caching for frequently asked questions
5. Add authentication and rate limiting
</parameter>