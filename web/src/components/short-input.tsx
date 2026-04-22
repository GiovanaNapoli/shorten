import { ArrowRightLeft, LinkIcon } from "lucide-react";
import Button from "./ui/button";

export function ShortInput() {
  return (
    <div className="w-full max-w-2xl rounded-xl bg-cyan-200/40 p-4">
      <div className="flex items-center gap-2 rounded-lg bg-white px-2 py-1">
        <div className="flex items-center gap-2 text-cyan-700">
          <LinkIcon size={16} />
          <span className="h-4 w-px bg-cyan-200" aria-hidden="true" />
        </div>

        <input
          type="text"
          placeholder="Enter your URL here"
          className="flex-1 bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 outline-none"
        />

        <Button
          type="button"
          text="Shorten"
          icon={<ArrowRightLeft size={14} />}
          size="md"
          className="arvo-bold border-none bg-linear-to-r from-cyan-300/40 to-blue-400/40 hover:from-cyan-400/40 hover:to-blue-500/40"
        />
      </div>
    </div>
  );
}
