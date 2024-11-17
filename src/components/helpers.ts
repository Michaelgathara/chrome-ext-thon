import {
  checkDomainAndPrompt,
  sliceContent,
  grabContent,
  compileContent,
} from "../libs";
import { ApiService } from "../services/api-service";
import { aiService } from "../services/ai-service";
import { newsService } from "../services/news-service";

export const runScan = async (
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  loader: (value: boolean) => void,
  setShowPopup: (value: boolean) => void,
  setDomainList: (value: string[]) => void,
  setCurrentDomain: (value: string) => void,
  setWebpagesSummary: (value: string) => void,
  setNewsBias: (value: string | null) => void,
  setSearchResults: (value: any[]) => void
) => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  const controller = new AbortController();
  abortControllerRef.current = controller;
  const signal = controller.signal;

  const { collectData } = await chrome.storage.sync.get("collectData");
  const { newsSiteIntegration } = await chrome.storage.sync.get(
    "newsSiteIntegration"
  );

  const { currentDomain, domainList, shouldScan, showPopup, isGoogle, isNews } =
    await checkDomainAndPrompt();

  if (!collectData) {
    setShowPopup(showPopup);
    setDomainList(domainList);
    setCurrentDomain(currentDomain);
  }

  if (!shouldScan || !collectData || isGoogle) {
    setWebpagesSummary("");
  }

  if ((shouldScan || collectData) && !isGoogle) {
    loader(true);

    const content = await grabContent();
    const query = await aiService.prompt(sliceContent(content));

    try {
      const results = await ApiService.search(query!, signal);
      const compiledDescription = compileContent(results.searchResults);
      const summary = await aiService.summarizeContent(compiledDescription);

      setSearchResults(results.searchResults);
      setWebpagesSummary(summary);

      if (newsSiteIntegration && isNews) {
        const biasRating = await newsService.getAIBiasRating(
          content,
          currentDomain
        );
        setNewsBias(biasRating);
      } else {
        setNewsBias(null);
      }

      loader(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Request was aborted, no need to log
      } else {
        console.error("Search request failed", error);
        loader(false);
      }
    } finally {
      loader(false);
    }
  }
};
