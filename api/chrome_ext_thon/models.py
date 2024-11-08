from pydantic import BaseModel


class Search(BaseModel):
    query: str


class Summarize(BaseModel):
    url: str


class GoogleSearchResult(BaseModel):
    url: str
    title: str
    description: str
    favicon: str
