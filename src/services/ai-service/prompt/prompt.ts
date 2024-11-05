import { prompt as aiPrompt } from "../ai-module";

export const prompt = async (prompt: string) => {
  const result = await aiPrompt(prompt);
  return result;
};
