import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")
    HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # College Configuration
    COLLEGE_WEBSITE_URL = os.getenv("COLLEGE_WEBSITE_URL", "https://sfit.ac.in")
    
    # URAG Configuration (from paper)
    FAQ_THRESHOLD = 0.9  # tFAQ
    DOC_THRESHOLD = 0.8  # tDoc
    FAQ_LIMIT = 20
    DOC_LIMIT = 2
    
    # Model Configuration
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    LLM_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"
    
    # File Paths
    DATA_DIR = "data"
    COLLEGE_DATA_FILE = f"{DATA_DIR}/college_data.json"
    AUGMENTED_DOCS_FILE = f"{DATA_DIR}/augmented_docs.json"
    ENRICHED_FAQS_FILE = f"{DATA_DIR}/enriched_faqs.json"
    INITIAL_FAQS_FILE = f"{DATA_DIR}/initial_faqs.json"
    
    # Vector Store
    VECTOR_STORE_DIR = "vector_store"
    FAQ_COLLECTION = "faq_index"
    DOC_COLLECTION = "doc_index"
</parameter>