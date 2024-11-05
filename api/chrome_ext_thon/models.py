from pydantic import BaseModel


class Search(BaseModel):
    query: str


class Summarize(BaseModel):
    url: str
