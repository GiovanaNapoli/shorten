import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export function useShorten() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (longUrl: string) => fetch(`${BASE_URL}/short`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    }).then((res) => res.json()),
    onSuccess: (data) => {
      if (data?.shortUrl) {
        console.log("Shortened URL:", data.shortUrl);
        navigator.clipboard.writeText(data.shortUrl).catch((err) => {
          toast.error("Failed to copy URL to clipboard:", err);
        });
      }
      toast.success("URL shortened successfully! Copyed to clipboard.");
      
      // Invalidate history query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (error) => {
      console.error("Error shortening URL:", error);
      toast.error(`Failed to shorten URL. ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });
}