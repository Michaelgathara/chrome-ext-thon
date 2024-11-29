import { summarize } from "../ai-module";
import { stripNonEnglishCharacters } from "../../../libs/helpers";

export const summarizeContent = async (
  content: string,
  systemPrompt?: string
) => {
  const summary = await summarize(
    stripNonEnglishCharacters(content),
    systemPrompt
  );
  const start = Math.max(0, Math.floor((summary.length - 3500) / 2));
  const end = start + 3500;
  console.log("summary", summary.slice(start, end));
  return summary.slice(start, end);
};
