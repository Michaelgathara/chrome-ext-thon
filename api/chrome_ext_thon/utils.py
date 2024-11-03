# pyright: reportUnknownMemberType=false
import os, requests, logging, json
import google.generativeai as genai
from googlesearch import (
    search,
)  # this is actually a wrapper for beautifulsoup and requests
from api.chrome_ext_thon.configs import (
    SUMMARIZE_SYSTEM_PROMPT,
    SEARCH_SYSTEM_PROMPT,
    GEMINI_KEY,
)

LOG_LEVEL = os.getenv("LOG_LEVEL") or "INFO"

logging.basicConfig(
    level=LOG_LEVEL,
    format="%(levelname)s:     %(asctime)s - %(name)s - %(message)s",
    handlers=[logging.StreamHandler()],
)

LOG = logging.getLogger(__name__)

genai.configure(api_key=GEMINI_KEY)


async def gemini(
    user_prompt: str, use_case: int = 1, model_name: str = "gemini-1.5-flash-latest"
):
    """
    Models avail:
    Gemini 1.5 Pro: gemini-1.5-pro-002
    Gemini 1.5 Flash: gemini-1.5-flash-002
    Gemini 1.5 Flash-8B: gemini-1.5-flash-8b
    Gemini 1.0 Pro: gemini-1.0-pro-002
    Text Embedding Model: text-embedding-004
    AQA (Answer Quality Assessment): aqa
    """
    try:
        model = genai.GenerativeModel(model_name)
        system = SUMMARIZE_SYSTEM_PROMPT if use_case == 1 else SEARCH_SYSTEM_PROMPT
        response = model.generate_content(
            [{"role": "user", "parts": [system + "\n\n" + user_prompt]}]
        )
        return response.text
    except Exception as e:
        LOG.error(f"Error in Gemini processing: {e}")
        return user_prompt


async def google_search(query):
    """
    this is a beautifulsoup implementation
    https://pypi.org/project/googlesearch-python/
    """
    response = search(query, num_results=10, advanced=True)
    LOG.info(f"Google search response: {response}")
    results_list = []
    for res in response:
        results_list.append(
            {"url": res.url, "title": res.title, "description": res.description}
        )

    return results_list
