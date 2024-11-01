import os, requests, json
import google.generativeai as genai
from googlesearch import search # this is actually a wrapper for beautifulsoup and requests
from configs import SUMMARIZE_SYSTEM_PROMPT, SEARCH_SYSTEM_PROMPT, SEARCH_API_KEY, CSE_ID, GEMINI_KEY

genai.configure(api_key=GEMINI_KEY)

def gemini(user_prompt: str, use_case: int = 1, model_name: str = "gemini-1.5-flash-latest"):
    """
        Models avail: 
        Gemini 1.5 Pro: gemini-1.5-pro-002
        Gemini 1.5 Flash: gemini-1.5-flash-002
        Gemini 1.5 Flash-8B: gemini-1.5-flash-8b
        Gemini 1.0 Pro: gemini-1.0-pro-002
        Text Embedding Model: text-embedding-004
        AQA (Answer Quality Assessment): aqa
    """
    model = genai.GenerativeModel(model_name)
    system = SUMMARIZE_SYSTEM_PROMPT if use_case == 1 else SEARCH_SYSTEM_PROMPT
    response = model.generate_content(
        user_prompt,
        system_prompt = system
    )

    return response

def google_search(query):
    """
    this is a beautifulsoup implementation
    https://pypi.org/project/googlesearch-python/
    """
    response = search(query, num_results = 10, advanced = True)
    results_list = []
    for res in response:
        results_list.append({
            "url": res.url,
            "title": res.title,
            "description": res.description
        })
        
    return json.dumps(results_list, indent = 4)
    

"""
Complicated setup with API keys and cse ids
"""
# def google_search(query, **kwargs):
#     url = "https://www.googleapis.com/customsearch/v1"
#     params = {
#         'q': query,
#         'key': SEARCH_API_KEY,
#         'cx': CSE_ID,
#     }
#     params.update(kwargs)
#     response = requests.get(url, params = params)
#     return response.json()

"""
results = google_search('OpenAI')
for item in results.get('items', []):
    print(item['title'], item['link'])"""