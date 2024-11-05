# STL
import os
import logging

# PDM
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.chrome_ext_thon.models import Search, Summarize
from api.chrome_ext_thon.utils import google_search, gemini, summarize_page


LOG_LEVEL = os.getenv("LOG_LEVEL") or "INFO"

logging.basicConfig(
    level=LOG_LEVEL,
    format="%(levelname)s:     %(asctime)s - %(name)s - %(message)s",
    handlers=[logging.StreamHandler()],
)

LOG = logging.getLogger(__name__)

app = FastAPI(title="api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/search")
async def search(search: Search):
    LOG.info(f"Searching for {search.page_content}")
    """
        TODO:
        Get the page content 
        Send it to gemini to generate a query
        Send the query to search to generate a json
        Send the json to frontend
    """
    search_query = await gemini(user_prompt=search.page_content, use_case=2)
    LOG.info(f"Generated search query: {search_query}")

    search_results = await google_search(search_query)
    return {"searchResults": search_results}


@app.post("/api/summarize")
async def short_summary(summary: Summarize):
    LOG.info(f"Summarizing {summary.url}")
    short_summary = await summarize_page(summary.url)
    return {"summary": short_summary}
