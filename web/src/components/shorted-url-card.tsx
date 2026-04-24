import { CopyIcon, LinkIcon, ShareIcon } from "lucide-react";
import Button from "./ui/button";
import toast from "react-hot-toast";

function ShortedUrlCard({ url }: { url?: string }) {
  const handleCopy = async () => {
    if (!url) return;
    
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
      console.error("Copy error:", err);
    }
  };

  const handleShare = async () => {
    if (!url) return;

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shortened URL",
          text: "Check out this shortened URL",
          url: url,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== "AbortError") {
          console.error("Share error:", err);
          // Fallback to copy
          handleCopy();
        }
      }
    } else {
      // Fallback: copy to clipboard
      handleCopy();
      toast.success("URL copied! (Share not supported on this browser)");
    }
  };

  return (
    <div className="animate-card-pop-in flex w-full max-w-2xl items-center rounded-lg border border-zinc-100 p-4 shadow">
      <a target="_blank" href={url} className="flex text-sm  text-cyan-700">
        <LinkIcon size={16} className="inline-block mr-1" />
        {url || "https://short.ly/abc123"}
      </a>
      <div className="flex w-full justify-end gap-2">
        <Button icon={<CopyIcon size={16} />} text="Copy" onClick={handleCopy} />
        <Button icon={<ShareIcon size={16} />} text="Share" onClick={handleShare} />
      </div>
    </div>
  );
}

export default ShortedUrlCard;
