import random
from requests import get
from bs4 import BeautifulSoup
from time import sleep


def get_useragent():
    return random.choice(_useragent_list)


_useragent_list = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0",
]


def _req(term, results, lang, start, proxies, timeout):
    resp = get(
        url="https://www.google.com/search",
        headers={"User-Agent": get_useragent()},
        params={
            "q": term,
            "num": results + 2,  # Prevents multiple requests
            "hl": lang,
            "start": start,
        },
        proxies=proxies,
        timeout=timeout,
    )
    resp.raise_for_status()
    return resp


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
    sleep_interval=0.25,
    timeout=5,
):
    """
    Search the Google search engine.

    Args:
        term (str): The search term.
        num_results (int, optional): The number of search results to retrieve. Defaults to 10.
        lang (str, optional): The language of the search results. Defaults to "en".
        proxy (str, optional): The proxy server to use for the search. Defaults to None.
        advanced (bool, optional): Whether to return advanced search results. Defaults to False.
        sleep_interval (int, optional): The interval between each search request in seconds. Defaults to 0.
        timeout (int, optional): The timeout for each search request in seconds. Defaults to 5.

    Yields:
        str or SearchResult: The search results. If advanced is True, yields SearchResult objects containing the link, title, and description. Otherwise, yields only the link.

    """
    escaped_term = term.replace(" ", "+")

    # Proxy
    proxies = None
    if proxy:
        if proxy.startswith("https"):
            proxies = {"https": proxy}
        else:
            proxies = {"http": proxy}

    # Fetch
    start = 0
    while start < num_results:
        # Send request
        resp = _req(escaped_term, num_results - start, lang, start, proxies, timeout)

        # Parse
        soup = BeautifulSoup(resp.text, "html.parser")
        result_block = soup.find_all("div", attrs={"class": "g"})
        if not result_block:
            print("No result found")
            break
        for result in result_block:
            # Find link, title, description
            link = result.find("a", href=True)
            title = result.find("h3")
            description_box = result.find("div", {"style": "-webkit-line-clamp:2"})
            favicon_tag = result.find("img")
            favicon = favicon_tag["src"] if favicon_tag else None
            if description_box:
                description = description_box.text
                if link and title and description:
                    start += 1
                    if advanced:
                        yield SearchResult(
                            link["href"], title.text, description, favicon
                        )
                    else:
                        yield link["href"]
            else:
                start += 1
        sleep(sleep_interval)
