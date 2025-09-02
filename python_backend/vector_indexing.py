"""
Step 3: Vector Store Indexing
Creates and manages Chroma vector stores for FAQs and documents
"""

import json
import os
from typing import List
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from config import Config

class VectorIndexer:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name=Config.EMBEDDING_MODEL
        )
        
        # Ensure vector store directory exists
        os.makedirs(Config.VECTOR_STORE_DIR, exist_ok=True)
    
    def create_faq_index(self) -> Chroma:
        """Create vector index for FAQs (embed questions only)"""
        print("Creating FAQ vector index...")
        
        # Load enriched FAQs
        try:
            with open(Config.ENRICHED_FAQS_FILE, 'r', encoding='utf-8') as f:
                faqs = json.load(f)
        except FileNotFoundError:
            print("No enriched FAQs found. Run urag_preparation.py first.")
            return None
        
        # Create documents for FAQ questions and variations
        faq_docs = []
        for faq in faqs:
            # Main question
            faq_docs.append(Document(
                page_content=faq["question"],
                metadata={
                    "faq_id": faq["id"],
                    "answer": faq["answer"],
                    "type": "main_question"
                }
            ))
            
            # Question variations
            for variation in faq.get("variations", []):
                faq_docs.append(Document(
                    page_content=variation,
                    metadata={
                        "faq_id": faq["id"],
                        "answer": faq["answer"],
                        "type": "variation"
                    }
                ))
        
        # Create vector store
        faq_vectorstore = Chroma.from_documents(
            documents=faq_docs,
            embedding=self.embeddings,
            collection_name=Config.FAQ_COLLECTION,
            persist_directory=Config.VECTOR_STORE_DIR
        )
        
        print(f"FAQ index created with {len(faq_docs)} entries.")
        return faq_vectorstore
    
    def create_document_index(self) -> Chroma:
        """Create vector index for augmented documents"""
        print("Creating document vector index...")
        
        # Load augmented documents
        try:
            with open(Config.AUGMENTED_DOCS_FILE, 'r', encoding='utf-8') as f:
                docs = json.load(f)
        except FileNotFoundError:
            print("No augmented documents found. Run urag_preparation.py first.")
            return None
        
        # Create documents for vector store
        doc_docs = []
        for doc in docs:
            doc_docs.append(Document(
                page_content=doc["augmented_content"],
                metadata={
                    "doc_id": doc["id"],
                    "url": doc["metadata"]["url"],
                    "title": doc["metadata"]["title"],
                    "section": doc["metadata"]["section"],
                    "summary": doc["summary"]
                }
            ))
        
        # Create vector store
        doc_vectorstore = Chroma.from_documents(
            documents=doc_docs,
            embedding=self.embeddings,
            collection_name=Config.DOC_COLLECTION,
            persist_directory=Config.VECTOR_STORE_DIR
        )
        
        print(f"Document index created with {len(doc_docs)} entries.")
        return doc_vectorstore
    
    def load_existing_indexes(self):
        """Load existing vector stores"""
        try:
            faq_vectorstore = Chroma(
                collection_name=Config.FAQ_COLLECTION,
                embedding_function=self.embeddings,
                persist_directory=Config.VECTOR_STORE_DIR
            )
            
            doc_vectorstore = Chroma(
                collection_name=Config.DOC_COLLECTION,
                embedding_function=self.embeddings,
                persist_directory=Config.VECTOR_STORE_DIR
            )
            
            return faq_vectorstore, doc_vectorstore
        except Exception as e:
            print(f"Error loading existing indexes: {e}")
            return None, None

if __name__ == "__main__":
    # Create vector indexes
    indexer = VectorIndexer()
    
    # Create FAQ index
    faq_store = indexer.create_faq_index()
    
    # Create document index
    doc_store = indexer.create_document_index()
    
    print("Vector indexing completed!")
</parameter>