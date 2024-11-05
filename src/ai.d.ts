declare module "ai-module" {
  export const aiPrompt: {
    languageModel: {
      capabilities: () => Promise<{
        available: string;
        defaultTemperature: number;
        defaultTopK: number;
        maxTopK: number;
      }>;
      create: () => Promise<{
        prompt: (input: string) => Promise<string>;
      }>;
    };
  };
}
