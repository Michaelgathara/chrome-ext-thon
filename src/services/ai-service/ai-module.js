import { SEARCH_PROMPT } from "./prompts";

export async function prompt(prompt) {
  try {
    const { available } = await ai.languageModel.capabilities();
    console.log("available", available);

    if (available !== "no") {
      console.log("creating session");
      const session = await ai.languageModel.create();
      console.log("prompting session");
      const result = await session.prompt(`${SEARCH_PROMPT}${prompt}`);
      return result;
    } else {
      console.warn("Language model is not available.");
      return null;
    }
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
}