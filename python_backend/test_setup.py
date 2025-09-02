import os
from dotenv import load_dotenv

print(" Testing Environment Setup...")
load_dotenv()

firecrawl_key = os.getenv('FIRECRAWL_API_KEY')
hf_token = os.getenv('HUGGINGFACEHUB_API_TOKEN')
college_url = os.getenv('COLLEGE_WEBSITE_URL')

print(f" Firecrawl API Key: {'SET' if firecrawl_key else ' NOT SET'}")
print(f" Hugging Face Token: {'SET' if hf_token else ' NOT SET'}")
print(f" College Website URL: {college_url}")

print("\n Testing Package Imports...")
try:
    import langchain, chromadb, fastapi, sentence_transformers, streamlit
    print(" All packages imported successfully!")
    print("\n Setup is ready! You can now run:")
    print("1. streamlit run streamlit_app.py")
    print("2. python api_server.py")
except ImportError as e:
    print(f" Import failed: {e}")
