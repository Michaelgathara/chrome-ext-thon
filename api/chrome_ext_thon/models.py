from pydantic import BaseModel


class Search(BaseModel):
    page_content: str
