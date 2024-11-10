import { prompt as aiPrompt } from "../ai-module";

export const prompt = async (prompt: string, customPrompt?: string) => {
  const result = await aiPrompt(prompt, customPrompt);
  return result;
};
