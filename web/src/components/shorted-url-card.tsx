import { CopyIcon, LinkIcon, ShareIcon } from "lucide-react";
import Button from "./ui/button";

function ShortedUrlCard({ url }: { url?: string }) {
  return (
    <div className="animate-card-pop-in flex w-full max-w-2xl items-center justify-between rounded-lg border border-zinc-100 p-4 shadow">
      <span className="w-full text-sm text-zinc-700 text-ellipsis overflow-hidden whitespace-nowrap">
        # https://averylongurl.com/veryveryverylongurl
      </span>
      <a href="/" className="w-full text-sm text-center text-cyan-700">
        <LinkIcon size={16} className="inline-block mr-1" />
        {url || "https://short.ly/abc123"}
      </a>
      <div className="flex w-full justify-end gap-2">
        <Button icon={<CopyIcon size={16} />} text="Copy" />
        <Button icon={<ShareIcon size={16} />} text="Share" />
      </div>
    </div>
  );
}

export default ShortedUrlCard;
