import { aiService } from "../../ai-service";
import { NEWS_BIAS_PROMPT } from "../../ai-service/prompts";
import { stripNonEnglishCharacters } from "../../../libs/helpers";

export const getAIBiasRating = async (
  pageContent: string,
  domain: string
): Promise<string> => {
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

  const response = aiService.prompt(
    prompt,
    NEWS_BIAS_PROMPT + `\n\nThe domain of the page is ${domain}`
  );

  console.log("Found News Site with bias of: " + response);
  return response;
};
