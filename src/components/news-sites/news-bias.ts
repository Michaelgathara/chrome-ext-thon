import { aiService } from "../../services/ai-service";
import { newsBiasData, BiasRating } from "./news-bias-list";
import { NEWS_BIAS_PROMPT } from "../../services/ai-service/prompts";

export const BIAS_TO_COLOR = {
  "center-left": "var(--news-bias-left-center)",
  "center-right": "var(--news-bias-right-center)",
  "left": "var(--news-bias-left)",
  "right": "var(--news-bias-right)",
  "center": "var(--news-bias-center)",
};

function stripNonEnglishCharacters(input: string): string {
  // Testing to see if non-english text inside the text is messing with our output
  // This gives more successes but not always guranteed
  return input.replace(/[^a-zA-Z\s]/g, ''); 
};

export const NewsBiasService = {
  isNewsSource(domain: string): boolean {
    return Object.keys(newsBiasData).some((news) => domain.includes(news));
  },

  getBiasRating(domain: string): BiasRating | null {
    const newsSource = Object.keys(newsBiasData).find((news) =>
      domain.includes(news)
    );
    return newsSource ? newsBiasData[newsSource] : null;
  },
  getAIBiasRating(pageContent: string, domain: string): Promise<string> {
    const cleanContent: string = stripNonEnglishCharacters(pageContent);
    const start = Math.max(0, Math.floor((cleanContent.length - 3500) / 2));
    const end = start + 3500;
    const contentSlice = cleanContent.slice(start, end);

    const prompt = `
    Here is the page content that you will use to determine the bias of the news source:
    ----------------------------
    "${contentSlice}"
    ----------------------------

    Please attempt to give it a bias rating based on the content.
    `;

    return aiService.prompt(
      prompt,
      NEWS_BIAS_PROMPT + `\n\nThe domain of the page is ${domain}`
    );
  },
};
