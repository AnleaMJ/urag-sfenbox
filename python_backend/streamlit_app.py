"""
Step 5: Streamlit Prototype Interface
Quick prototype for testing URAG framework
"""

import streamlit as st
import requests
import json
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:8000"

# Page configuration
st.set_page_config(
    page_title="SFIT Admission Assistant",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        margin-bottom: 2rem;
    }
    .chat-message {
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 10px;
        border-left: 4px solid #3b82f6;
    }
    .user-message {
        background-color: #eff6ff;
        border-left-color: #1e40af;
    }
    .assistant-message {
        background-color: #f8fafc;
        border-left-color: #10b981;
    }
    .stats-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

def call_api(endpoint: str, data: dict = None):
    """Make API call to backend"""
    try:
        if data:
            response = requests.post(f"{API_BASE_URL}/{endpoint}", json=data)
        else:
            response = requests.get(f"{API_BASE_URL}/{endpoint}")
        
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"API Error: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        st.error("Cannot connect to URAG backend. Make sure the API server is running on port 8000.")
        return None
    except Exception as e:
        st.error(f"Error calling API: {e}")
        return None

# Main app
def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🎓 SFIT Admission Assistant</h1>
        <p>Powered by URAG (Unified RAG) Framework</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar with stats and info
    with st.sidebar:
        st.header("📊 Framework Stats")
        
        # Get stats from API
        stats = call_api("stats")
        if stats:
            st.markdown(f"""
            <div class="stats-card">
                <h4>📚 Knowledge Base</h4>
                <p><strong>FAQs:</strong> {stats['faq_count']}</p>
                <p><strong>Documents:</strong> {stats['document_count']}</p>
                <p><strong>FAQ Variations:</strong> {stats['total_variations']}</p>
                <p><strong>Status:</strong> {stats['framework_status']}</p>
            </div>
            """, unsafe_allow_html=True)
        
        st.header("🔧 URAG Framework")
        st.markdown("""
        **Tier 1:** FAQ Search  
        Direct answers from curated Q&A pairs
        
        **Tier 2:** Document Retrieval  
        RAG-based search through augmented documents
        
        **Tier 3:** Fallback Response  
        General guidance with disclaimer
        """)
        
        st.header("💡 Suggested Questions")
        suggested_questions = [
            "What are the admission requirements?",
            "What is the fee structure?",
            "When do admissions open?",
            "What courses are available?",
            "Is hostel facility available?",
            "Tell me about placements"
        ]
        
        for question in suggested_questions:
            if st.button(question, key=f"suggest_{hash(question)}"):
                st.session_state.current_question = question
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
        # Add welcome message
        st.session_state.messages.append({
            "role": "assistant",
            "content": "Welcome to SFIT Admission Assistant! I'm powered by the URAG framework. How can I help you with your admission queries?",
            "timestamp": datetime.now(),
            "metadata": {}
        })
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            
            # Show metadata for assistant messages
            if message["role"] == "assistant" and message.get("metadata"):
                metadata = message["metadata"]
                if metadata.get("type"):
                    st.caption(f"🔍 Method: {metadata['type']} | Confidence: {metadata.get('confidence', 0):.1%}")
                if metadata.get("sources"):
                    with st.expander("📖 Sources"):
                        for source in metadata["sources"]:
                            st.markdown(f"- [{source}]({source})")
    
    # Handle suggested question
    if hasattr(st.session_state, 'current_question'):
        prompt = st.session_state.current_question
        del st.session_state.current_question
    else:
        prompt = st.chat_input("Ask about admissions, courses, fees, or campus life...")
    
    # Process user input
    if prompt:
        # Add user message
        st.session_state.messages.append({
            "role": "user",
            "content": prompt,
            "timestamp": datetime.now(),
            "metadata": {}
        })
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get response from URAG API
        with st.chat_message("assistant"):
            with st.spinner("Searching knowledge base..."):
                api_response = call_api("query", {"question": prompt})
                
                if api_response:
                    response_content = api_response["response"]
                    st.markdown(response_content)
                    
                    # Show metadata
                    st.caption(f"🔍 Method: {api_response['type']} | Confidence: {api_response['confidence']:.1%}")
                    
                    if api_response.get("sources"):
                        with st.expander("📖 Sources"):
                            for source in api_response["sources"]:
                                st.markdown(f"- [{source}]({source})")
                    
                    # Add to chat history
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": response_content,
                        "timestamp": datetime.now(),
                        "metadata": {
                            "type": api_response["type"],
                            "confidence": api_response["confidence"],
                            "sources": api_response.get("sources", []),
                            "faq_id": api_response.get("faq_id"),
                            "document_ids": api_response.get("document_ids", [])
                        }
                    })
                else:
                    error_msg = "Sorry, I'm having trouble connecting to the knowledge base. Please try again."
                    st.error(error_msg)
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": error_msg,
                        "timestamp": datetime.now(),
                        "metadata": {}
                    })

if __name__ == "__main__":
    main()
</parameter>