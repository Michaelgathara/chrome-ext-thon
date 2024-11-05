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
    LOG.info(f"Searching for {search.query}")
    """
        TODO:
        Send the query to search to generate a json
        Send the json to frontend
    """
    search_results = await google_search(search.query)
    return {"searchResults": search_results}


@app.post("/api/summarize")
async def short_summary(summary: Summarize):
    LOG.info(f"Summarizing {summary.url}")
    content = await summarize_page(summary.url)
    return {"content": content}
