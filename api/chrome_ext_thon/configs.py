import os
from dotenv import load_dotenv
load_dotenv()

GEMINI_KEY = os.getenv('GEMINI_API_KEY')

SUMMARIZE_SYSTEM_PROMPT = f"""
You are a summarizing assistant who takes in a bunch of text and summarizes it in about 20 words, the text goes as follows: \n\n
"""

SEARCH_SYSTEM_PROMPT = """
    You are a helpful search assistant who takes a ton of text then comes up with a query for a google search so that I can find webpages that I can use to dig into more about the topic of the text. The search query should be short and to the point
"""