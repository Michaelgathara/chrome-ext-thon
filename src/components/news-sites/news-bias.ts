import { newsBiasData, BiasRating } from './news-bias-list';

export const NewsBiasService = {
  isNewsSource(domain: string): boolean {
    return Object.keys(newsBiasData).some(news => domain.includes(news));
  },

  getBiasRating(domain: string): BiasRating | null {
    const newsSource = Object.keys(newsBiasData).find(news => domain.includes(news));
    return newsSource ? newsBiasData[newsSource] : null;
  }
};