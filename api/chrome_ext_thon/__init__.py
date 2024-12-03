# STL
import os
import logging

# PDM
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# From api.chrome_ext_thon had some errors. Removing for testing
from api.chrome_ext_thon.models import Search, Summarize
from api.chrome_ext_thon.utils import google_search, summarize_page


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


@app.get("/api/health")
async def health():
    return JSONResponse(content={"status": "ok"})


@app.post("/api/search")
async def search(search: Search):
    search_results = await google_search(search.query)
    return JSONResponse(
        content={"searchResults": [res.model_dump() for res in search_results]}
    )


@app.post("/api/summarize")
async def short_summary(summary: Summarize):
    LOG.info(f"Summarizing {summary.url}")
    content = await summarize_page(summary.url)
    return JSONResponse(content={"content": content})
