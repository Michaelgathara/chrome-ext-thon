import { SEARCH_PROMPT, SUMMARIZE_PROMPT } from "./prompts";

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

export async function summarize(content) {
  content = content.slice(0, 2000);
  const canSummarize = await ai.summarizer.capabilities();
  let summarizer;
  if (canSummarize && canSummarize.available !== "no") {
    console.log("can summarize", canSummarize);
    if (canSummarize.available === "readily") {
      console.log("readily available");
      summarizer = await ai.summarizer.create();
      return await summarizer.summarize(SUMMARIZE_PROMPT + content);
    } else {
      console.log("not readily available");
      summarizer = await ai.summarizer.create();
      summarizer.addEventListener("downloadprogress", (e) => {
        console.log(e.loaded, e.total);
      });
      await summarizer.ready;
      console.log("summarizer ready");
      return await summarizer.summarize(SUMMARIZE_PROMPT + content);
    }
  } else {
    // The summarizer can't be used at all.
  }
}
