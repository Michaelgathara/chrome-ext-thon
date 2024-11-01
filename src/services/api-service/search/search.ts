import { API_URL } from "../../../libs";

export const search = async (pageContent: string) => {
  const requestBody = { page_content: pageContent };

  const response = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  return response.json();
};
