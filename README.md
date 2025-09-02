# Sfenbox (SFIT Enquiry box) - Advanced Admission Enquiry Chatbot with Unified Hybrid RAG Framework (URAG)

A modular pipeline for building a college information chatbot using LLMs, with support for ingesting both crawled website data and PDF documents as context.

---

## Features

- **URAG-D (Document Augmentation):**  
  Processes crawled web data or PDFs, semantically chunks, rewrites, and summarizes content for robust retrieval.
- **URAG-F (FAQ Enrichment):**  
  Generates and paraphrases FAQs from augmented documents for diverse and accurate chatbot responses.
- **PDF Support:**  
  Ingests and processes PDF files as context.
- **FastAPI Backend:**  
  Exposes a `/chat` endpoint for chatbot queries.

---

## Folder Structure

```
urag-sfenbox/
│
├── python_backend/
│   ├── urag_preparation.py      # Data preparation and augmentation pipeline
│   ├── main.py                  # FastAPI app for chatbot API
│   └── __init__.py
├── pdf_docs/                    # (Recommended) Place your PDF files here
├── data/                        # (Optional) JSON data files
├── .gitignore
└── README.md
```

---

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnleaMJ/urag-sfenbox.git
   cd urag-sfenbox
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv sfenbox
   sfenbox\Scripts\activate  # On Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   *(If `requirements.txt` is missing, install manually: `pip install fastapi uvicorn langchain-community langchain-core` and other required packages.)*

4. **Configure your environment:**
   - Edit `config.py` with your HuggingFace API token and model names.
   - Place your PDF files in a folder (e.g., `pdf_docs/`).

---

## Data Preparation

Run the preparation pipeline to process your data:

```bash
python python_backend/urag_preparation.py
```

- To use PDF files as context:
  ```python
  # In urag_preparation.py __main__ section:
  augmented_docs = prep.urag_d_augment_documents(use_pdf=True, pdf_folder="pdf_docs")
  ```

---

## Running the Chatbot API

Start the FastAPI server:

```bash
uvicorn python_backend.main:app --reload
```

- The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Test the `/chat` endpoint with a POST request:
  ```json
  {
    "question": "What courses are offered?"
  }
  ```

---

## Deployment

- For production, use a process manager (e.g., Gunicorn with Uvicorn workers).
- Deploy on a cloud VM or platform (Azure, AWS, GCP, Heroku, etc.).
- Connect a frontend (React, Streamlit, etc.) to the FastAPI backend.

---

## Tips

- Use JSON as context for faster repeated runs.
- Add new PDFs to `pdf_docs/` and re-run the preparation pipeline as needed.
- Use `.gitignore` to avoid committing cache files.

---

## License

MIT License

---

## Acknowledgements

- [LangChain](https://github.com/langchain-ai/langchain)
- [FastAPI](https://fastapi.tiangolo.com/)
- [HuggingFace](https://huggingface.co/)
