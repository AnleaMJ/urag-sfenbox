"""
Complete URAG Pipeline Runner
Runs the entire preparation and indexing pipeline
"""

import os
import sys
from data_collection import crawl_college_website
from urag_preparation import URAGPreparation
from vector_indexing import VectorIndexer
from urag_inference import URAGInference

def run_complete_pipeline():
    """Run the complete URAG pipeline"""
    
    print("🚀 Starting URAG Pipeline for College Admission Chatbot")
    print("=" * 60)
    
    try:
        # Step 1: Data Collection
        print("\n📡 Step 1: Data Collection")
        if not os.path.exists("data/college_data.json"):
            print("Crawling college website...")
            crawl_college_website()
        else:
            print("Using existing crawled data.")
        
        # Step 2: URAG Preparation
        print("\n🔧 Step 2: URAG Preparation (URAG-D + URAG-F)")
        prep = URAGPreparation()
        
        if not os.path.exists("data/augmented_docs.json"):
            print("Running URAG-D: Document Augmentation...")
            prep.urag_d_augment_documents()
        else:
            print("Using existing augmented documents.")
        
        if not os.path.exists("data/enriched_faqs.json"):
            print("Running URAG-F: FAQ Enrichment...")
            prep.urag_f_enrich_faqs()
        else:
            print("Using existing enriched FAQs.")
        
        # Step 3: Vector Indexing
        print("\n🗂️ Step 3: Vector Store Indexing")
        indexer = VectorIndexer()
        
        if not os.path.exists("vector_store"):
            print("Creating vector indexes...")
            indexer.create_faq_index()
            indexer.create_document_index()
        else:
            print("Using existing vector indexes.")
        
        # Step 4: Test Inference
        print("\n🧠 Step 4: Testing URAG Inference")
        inference = URAGInference()
        
        test_queries = [
            "What are the admission requirements for engineering?",
            "What is the fee structure for undergraduate programs?",
            "Tell me about hostel facilities"
        ]
        
        for query in test_queries:
            print(f"\nTesting: {query}")
            result = inference.query(query)
            print(f"Response Type: {result['type']}")
            print(f"Confidence: {result['confidence']:.3f}")
            print(f"Response: {result['content'][:150]}...")
        
        print("\n✅ URAG Pipeline completed successfully!")
        print("\nNext steps:")
        print("1. Run the API server: python api_server.py")
        print("2. Test with Streamlit: streamlit run streamlit_app.py")
        print("3. Integrate with your React frontend")
        
    except Exception as e:
        print(f"\n❌ Pipeline failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_complete_pipeline()
</parameter>