import { summarize } from "../ai-module";

export const summarizeContent = async (content: string) => {
  return await summarize(content);
};
