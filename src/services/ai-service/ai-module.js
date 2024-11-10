import { SEARCH_PROMPT, SUMMARIZE_PROMPT } from "./prompts";

export async function prompt(prompt, systemPrompt = SEARCH_PROMPT) {
  const maxRetries = 10; // Maximum number of retries
  let attempt = 0; // Current attempt count

  while (attempt < maxRetries) {
    try {
      const { available } = await ai.languageModel.capabilities();
      console.log("available", available);

      if (available !== "no") {
        console.log("creating session");
        const session = await ai.languageModel.create({systemPrompt: systemPrompt});

        console.log("prompting session");
        console.log("prompt", prompt);
        const result = await session.prompt(prompt);


        console.log("result", result);
        await session.destroy();

        return result;
      } else {
        console.warn("Language model is not available.");
        return null;
      }
    } catch (error) {
      attempt++; // Increment the attempt count
      console.error(`Error generating prompt (attempt ${attempt}):`, error);
      if (attempt >= maxRetries) {
        throw error; // Rethrow the error if max retries reached
      }
    }
  }
}

export async function summarize(content, systemPrompt = SUMMARIZE_PROMPT) {
  content = content.slice(0, 2000);
  const canSummarize = await ai.summarizer.capabilities();
  let summarizer;
  if (canSummarize && canSummarize.available !== "no") {
    console.log("can summarize", canSummarize);
    if (canSummarize.available === "readily") {
      console.log("readily available");
      summarizer = await ai.summarizer.create();
      const result = await summarizer.summarize(systemPrompt + content);
      await summarizer.destroy();
      return result;
    } else {
      console.log("not readily available");
      summarizer = await ai.summarizer.create();
      summarizer.addEventListener("downloadprogress", (e) => {
        console.log(e.loaded, e.total);
      });
      await summarizer.ready;
      console.log("summarizer ready");
      const result = await summarizer.summarize(systemPrompt + content);
      await summarizer.destroy();
      return result;
    }
  } else {
    // The summarizer can't be used at all.
  }
}
