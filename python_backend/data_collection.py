"""
Step 1: Data Collection using Firecrawl
Crawls college website and extracts clean content
"""

import json
import os
from firecrawl import FirecrawlApp
from config import Config

def crawl_college_website():
    """Crawl college website using Firecrawl"""
    
    # Ensure data directory exists
    os.makedirs(Config.DATA_DIR, exist_ok=True)
    
    # Initialize Firecrawl
    app = FirecrawlApp(api_key=Config.FIRECRAWL_API_KEY)
    
    print(f"Starting crawl of {Config.COLLEGE_WEBSITE_URL}...")
    
    # Crawl the college website
    crawl_result = app.crawl_url(
        Config.COLLEGE_WEBSITE_URL,
        params={
            'crawlerOptions': {
                'includes': [
                    'admissions/*', 
                    'academics/*', 
                    'courses/*',
                    'fees/*',
                    'placement/*',
                    'facilities/*',
                    'about/*'
                ],
                'excludes': [
                    'blog/*', 
                    'news/*',
                    'events/*',
                    'gallery/*'
                ],
                'maxDepth': 5,
                'limit': 300
            },
            'pageOptions': {
                'onlyMainContent': True,
                'includeHtml': False
            }
        }
    )
    
    # Save crawled data
    with open(Config.COLLEGE_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(crawl_result, f, indent=4, ensure_ascii=False)
    
    print(f"Crawled {len(crawl_result)} pages and saved to {Config.COLLEGE_DATA_FILE}")
    return crawl_result

def load_crawled_data():
    """Load previously crawled data"""
    try:
        with open(Config.COLLEGE_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"No crawled data found at {Config.COLLEGE_DATA_FILE}")
        return []

if __name__ == "__main__":
    # Run data collection
    crawl_college_website()
</parameter>