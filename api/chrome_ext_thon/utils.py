import os, requests
import google.generativeai as genai
from configs import SUMMARIZE_SYSTEM_PROMPT, SEARCH_SYSTEM_PROMPT

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

def gemini(user_prompt: str, use_case: int = 1, model_name: str = "gemini-1.5-pro-001"):
    model = genai.GenerativeModel(model_name)
    system = SUMMARIZE_SYSTEM_PROMPT if use_case == 1 else SEARCH_SYSTEM_PROMPT
    response = model.generate_content(
        user_prompt,
        system_prompt = system
    )

    return response

def google_search(query, api_key, cse_id, **kwargs):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        'q': query,
        'key': api_key,
        'cx': cse_id,
    }
    params.update(kwargs)
    response = requests.get(url, params=params)
    return response.json()
