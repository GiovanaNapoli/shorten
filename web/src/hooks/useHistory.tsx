import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export interface HistoryItem {
  longUrl: string;
  shortUrl: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useHistory(page: number = 1, limit: number = 10) {
  return useQuery<HistoryResponse>({
    queryKey: ["history", page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/history?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      return response.json();
    },
  });
}
