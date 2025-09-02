"""
Step 2: URAG Preparation Phase
Implements URAG-D (Document Augmentation) and URAG-F (FAQ Enrichment)
"""

import json
import os
from typing import List, Dict, Any
from langchain_community.llms import HuggingFaceHub
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import JSONLoader
from langchain_community.document_loaders import PyPDFLoader  # <-- Add this import
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document
from config import Config

class URAGPreparation:
    def __init__(self):
        # Initialize LLM and embeddings
        os.environ["HUGGINGFACEHUB_API_TOKEN"] = Config.HUGGINGFACEHUB_API_TOKEN
        
        self.llm = HuggingFaceHub(
            repo_id=Config.LLM_MODEL,
            model_kwargs={
                "temperature": 0.7,
                "top_p": 0.95,
                "max_new_tokens": 512
            }
        )
        
        self.embeddings = HuggingFaceEmbeddings(
            model_name=Config.EMBEDDING_MODEL
        )
        
        # Text splitter for semantic chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    def _load_pdf_documents(self, pdf_folder: str) -> List[Dict[str, Any]]:
        """
        Load all PDF files from a folder and return as list of dicts with 'content' and 'metadata'.
        """
        pdf_docs = []
        for fname in os.listdir(pdf_folder):
            if fname.lower().endswith(".pdf"):
                pdf_path = os.path.join(pdf_folder, fname)
                try:
                    loader = PyPDFLoader(pdf_path)
                    pages = loader.load()
                    for i, page in enumerate(pages):
                        pdf_docs.append({
                            "content": page.page_content,
                            "metadata": {
                                "source": pdf_path,
                                "page": i + 1,
                                "title": fname
                            }
                        })
                except Exception as e:
                    print(f"Error loading PDF {fname}: {e}")
        return pdf_docs

    def urag_d_augment_documents(self, use_pdf: bool = False, pdf_folder: str = None) -> List[Dict[str, Any]]:
        """
        URAG-D: Document Augmentation
        Optionally process PDFs as context if use_pdf=True and pdf_folder is provided.
        """
        print("Starting URAG-D: Document Augmentation...")

        if use_pdf and pdf_folder:
            print(f"Loading PDF documents from {pdf_folder} ...")
            crawled_data = self._load_pdf_documents(pdf_folder)
            # Adapt to expected format
            for doc in crawled_data:
                doc.setdefault('url', doc['metadata'].get('source', ''))
                doc.setdefault('title', doc['metadata'].get('title', ''))
        else:
            # Load crawled documents from JSON
            try:
                with open(Config.COLLEGE_DATA_FILE, 'r', encoding='utf-8') as f:
                    crawled_data = json.load(f)
            except FileNotFoundError:
                print("No crawled data found. Run data_collection.py first or provide PDFs.")
                return []
        
        augmented_docs = []
        
        for i, page_data in enumerate(crawled_data):
            print(f"Processing document {i+1}/{len(crawled_data)}: {page_data.get('url', 'Unknown URL')}")
            
            content = page_data.get('markdown', '') or page_data.get('content', '')
            if not content or len(content.strip()) < 100:
                continue
            
            try:
                # Step 1: Extract general context (Algorithm 1, Line 4)
                context_prompt = ChatPromptTemplate.from_template(
                    """Extract the overarching general context and main themes from this college website document. 
                    Focus on institutional information, academic programs, and student services.
                    
                    Document: {doc_content}
                    
                    General Context:"""
                )
                context_chain = context_prompt | self.llm | StrOutputParser()
                general_context = context_chain.invoke({"doc_content": content[:2000]})  # Limit for API
                
                # Step 2: Semantic chunking
                doc = Document(page_content=content, metadata=page_data)
                chunks = self.text_splitter.split_documents([doc])
                
                for chunk in chunks:
                    if len(chunk.page_content.strip()) < 50:
                        continue
                    
                    # Step 3: Rewrite chunk with context (Algorithm 1, Line 7)
                    rewrite_prompt = ChatPromptTemplate.from_template(
                        """Rewrite this text chunk to be more coherent and informative using the provided context.
                        Make it self-contained while preserving all important information.
                        
                        General Context: {context}
                        
                        Original Chunk: {chunk_content}
                        
                        Rewritten Chunk:"""
                    )
                    rewrite_chain = rewrite_prompt | self.llm | StrOutputParser()
                    rewritten = rewrite_chain.invoke({
                        "context": general_context,
                        "chunk_content": chunk.page_content
                    })
                    
                    # Step 4: Generate summary (Algorithm 1, Line 8)
                    summary_prompt = ChatPromptTemplate.from_template(
                        """Create a brief, informative summary sentence for this rewritten content.
                        Focus on the key information relevant to college admissions and student queries.
                        
                        Content: {rewritten}
                        
                        Summary:"""
                    )
                    summary_chain = summary_prompt | self.llm | StrOutputParser()
                    summary = summary_chain.invoke({"rewritten": rewritten})
                    
                    # Step 5: Combine summary + rewritten (Algorithm 1, Line 9)
                    augmented_content = f"{summary.strip()}\n\n{rewritten.strip()}"
                    
                    augmented_docs.append({
                        "id": f"doc_{i}_{len(augmented_docs)}",
                        "content": chunk.page_content,
                        "augmented_content": augmented_content,
                        "summary": summary.strip(),
                        "metadata": {
                            "url": page_data.get('url', ''),
                            "title": page_data.get('title', ''),
                            "section": self._extract_section(page_data.get('url', ''))
                        }
                    })
                
            except Exception as e:
                print(f"Error processing document {i}: {e}")
                continue
        
        # Save augmented documents
        with open(Config.AUGMENTED_DOCS_FILE, 'w', encoding='utf-8') as f:
            json.dump(augmented_docs, f, indent=4, ensure_ascii=False)
        
        print(f"URAG-D completed. Generated {len(augmented_docs)} augmented document chunks.")
        return augmented_docs
    
    def urag_f_enrich_faqs(self) -> List[Dict[str, Any]]:
        """
        URAG-F: FAQ Enrichment
        1. Load initial FAQs
        2. Generate new Q&A pairs from augmented documents
        3. Paraphrase questions for linguistic diversity
        """
        print("Starting URAG-F: FAQ Enrichment...")
        
        # Load initial FAQs
        try:
            with open(Config.INITIAL_FAQS_FILE, 'r', encoding='utf-8') as f:
                initial_faqs = json.load(f)
        except FileNotFoundError:
            print("No initial FAQs found. Starting with empty set.")
            initial_faqs = []
        
        # Load augmented documents
        try:
            with open(Config.AUGMENTED_DOCS_FILE, 'r', encoding='utf-8') as f:
                augmented_docs = json.load(f)
        except FileNotFoundError:
            print("No augmented documents found. Run URAG-D first.")
            return initial_faqs
        
        enriched_faqs = initial_faqs.copy()
        
        # Generate new Q&A pairs from documents (Algorithm 2, Lines 4-6)
        qa_gen_prompt = ChatPromptTemplate.from_template(
            """Based on this college document content, generate 3-5 relevant question-answer pairs 
            that prospective students might ask about admissions, courses, fees, or campus life.
            
            Return as JSON array: [{"question": "...", "answer": "..."}]
            
            Document Content: {doc_content}
            
            Generated Q&A Pairs:"""
        )
        qa_chain = qa_gen_prompt | self.llm | StrOutputParser()
        
        for doc in augmented_docs[:10]:  # Limit to avoid API costs
            try:
                new_qas_text = qa_chain.invoke({"doc_content": doc["augmented_content"]})
                # Parse JSON response
                new_qas = json.loads(new_qas_text)
                if isinstance(new_qas, list):
                    enriched_faqs.extend(new_qas)
            except (json.JSONDecodeError, Exception) as e:
                print(f"Error generating Q&A from document: {e}")
                continue
        
        # Paraphrase questions for diversity (Algorithm 2, Lines 7-9)
        paraphrase_prompt = ChatPromptTemplate.from_template(
            """Generate 3 paraphrased variations of this question while keeping the same meaning.
            Make them sound natural and diverse in phrasing.
            
            Original Question: {question}
            
            Return as JSON array: ["variation1", "variation2", "variation3"]
            
            Paraphrased Questions:"""
        )
        paraphrase_chain = paraphrase_prompt | self.llm | StrOutputParser()
        
        final_faqs = []
        for faq in enriched_faqs:
            try:
                # Add original FAQ
                faq_item = {
                    "id": f"faq_{len(final_faqs)}",
                    "question": faq["question"],
                    "answer": faq["answer"],
                    "variations": []
                }
                
                # Generate variations
                variations_text = paraphrase_chain.invoke({"question": faq["question"]})
                variations = json.loads(variations_text)
                if isinstance(variations, list):
                    faq_item["variations"] = variations
                
                final_faqs.append(faq_item)
                
            except Exception as e:
                print(f"Error paraphrasing FAQ: {e}")
                # Add without variations
                final_faqs.append({
                    "id": f"faq_{len(final_faqs)}",
                    "question": faq["question"],
                    "answer": faq["answer"],
                    "variations": []
                })
        
        # Save enriched FAQs
        with open(Config.ENRICHED_FAQS_FILE, 'w', encoding='utf-8') as f:
            json.dump(final_faqs, f, indent=4, ensure_ascii=False)
        
        print(f"URAG-F completed. Generated {len(final_faqs)} enriched FAQs.")
        return final_faqs
    
    def _extract_section(self, url: str) -> str:
        """Extract section from URL for categorization"""
        if 'admission' in url.lower():
            return 'admissions'
        elif 'academic' in url.lower() or 'course' in url.lower():
            return 'academics'
        elif 'fee' in url.lower() or 'cost' in url.lower():
            return 'fees'
        elif 'placement' in url.lower():
            return 'placements'
        elif 'facility' in url.lower() or 'infrastructure' in url.lower():
            return 'facilities'
        elif 'about' in url.lower():
            return 'about'
        else:
            return 'general'

if __name__ == "__main__":
    # Run preparation pipeline
    prep = URAGPreparation()
    
    # To use PDF context, set use_pdf=True and provide the folder path
    # Example: augmented_docs = prep.urag_d_augment_documents(use_pdf=True, pdf_folder="path/to/pdf_folder")
    augmented_docs = prep.urag_d_augment_documents()
    
    # Step 2: FAQ Enrichment
    enriched_faqs = prep.urag_f_enrich_faqs()
    
    print("URAG preparation phase completed!")