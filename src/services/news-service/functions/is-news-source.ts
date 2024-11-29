import { newsBiasData } from "../data";

export const isNewsSource = (domain: string): boolean => {
  return Object.keys(newsBiasData).some((news) => domain.includes(news));
};
