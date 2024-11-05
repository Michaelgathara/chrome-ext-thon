from pydantic import BaseModel


class Search(BaseModel):
    page_content: str


class Summarize(BaseModel):
    url: str
