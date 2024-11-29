import { newsBiasData, BiasRating } from "../data";

export const getBiasRating = (domain: string): BiasRating | null => {
  const newsSource = Object.keys(newsBiasData).find((news) =>
    domain.includes(news)
  );
  return newsSource ? newsBiasData[newsSource] : null;
};
