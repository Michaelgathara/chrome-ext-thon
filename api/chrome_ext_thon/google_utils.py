import time
import requests
from bs4 import BeautifulSoup
from typing import Optional
from urllib.parse import quote_plus
import logging
import fake_useragent

LOG = logging.getLogger(__name__)


def _req(
    term: str,
    results_per_page: int,
    lang: str,
    start: int,
    proxies: Optional[dict],
    timeout: int,
    safe: str,
    ssl_verify: Optional[bool],
    region: Optional[str],
) -> requests.Response:
    headers = {"User-Agent": fake_useragent.UserAgent().random}

    params = {
        "q": term,
        "num": results_per_page,
        "hl": lang,
        "start": start,
        "safe": safe,
    }

    if region:
        params["gl"] = region

    url = f"https://www.google.com/search?" + "&".join(
        f"{k}={quote_plus(str(v))}" for k, v in params.items()
    )

    LOG.info(f"Searching for {term} at {url}")

    return requests.get(
        url,
        headers=headers,
        proxies=proxies,
        timeout=timeout,
        verify=ssl_verify if ssl_verify is not None else True,
    )


class SearchResult:
    def __init__(self, url, title, description, favicon):
        self.url = url
        self.title = title
        self.description = description
        self.favicon = favicon

    def __repr__(self):
        return f"SearchResult(url={self.url}, title={self.title}, description={self.description})"


def search(
    term,
    num_results=10,
    lang="en",
    proxy=None,
    advanced=False,
    sleep_interval=1,
    timeout=5,
    safe="active",
    ssl_verify=None,
    region=None,
):
    """Search the Google search engine"""

    # Proxy setup
    proxies = (
        {"https": proxy, "http": proxy}
        if proxy and (proxy.startswith("https") or proxy.startswith("http"))
        else None
    )

    start = 0
    fetched_results = 0  # Keep track of the total fetched results
    loop_count = 1

    LOG.info(f"Starting search for {term}")

    while fetched_results < num_results:
        LOG.info(f"Loop count: {loop_count}")
        loop_count += 1

        # Send request
        resp = _req(
            term,
            num_results - start,
            lang,
            start,
            proxies,
            timeout,
            safe,
            ssl_verify,
            region,
        )

        # Parse
        soup = BeautifulSoup(resp.text, "html.parser")
        result_block = soup.find_all("div", attrs={"class": "g"})
        new_results = 0  # Keep track of new results in this iteration

        LOG.info(f"Found {len(result_block)} results")

        for result in result_block:
            # Find link, title, description
            link = result.find("a", href=True)
            title = result.find("h3")
            description_box = result.find("div", {"style": "-webkit-line-clamp:2"})
            favicon_tag = result.find("img")
            favicon = favicon_tag["src"] if favicon_tag else None

            if link and title and description_box:
                description = description_box.text
                fetched_results += 1
                new_results += 1
                if advanced:
                    yield SearchResult(link["href"], title.text, description, favicon)
                else:
                    yield link["href"]

                time.sleep(sleep_interval)

            if new_results == 0:
                break

            if fetched_results >= num_results:
                break  # Stop if we have fetched the desired number of results
