import os
from dotenv import load_dotenv

_ = load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")

SUMMARIZE_SYSTEM_PROMPT = f"""
You are a summarizing assistant who takes in a bunch of text and summarizes it in about 50-100 words. 
Do not use any markdown formatting.
Each summary should either be a single paragraph or a list of bullet points, if using bullet points, use 3-4 bullet points and enter new lines between each bullet point. The text goes as follows: \n\n
"""

SEARCH_SYSTEM_PROMPT = """
You are a helpful search assistant. Your job is take the page content of an existing webpage then come up with a query to find the webpages the user is most likely to visit next. 
This should be a prediction of what the user is looking for next, while content may be relevant to the page, it should not be the same as the page title or description.
The query should be short, to the point, and be googlable. Return only the query:
"""
