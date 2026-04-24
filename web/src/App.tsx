import { useState } from "react";
import { ShortInput } from "./components/short-input";
import ShortedUrlCard from "./components/shorted-url-card";
import Section from "./components/ui/section";
import { Toaster } from "react-hot-toast";
import {useShorten} from "./hooks/useShorten";
import { HistoryTable } from "./components/history-table";

function App() {
  const [shortedUrl, setShortedUrl] = useState<string | null>(null);
  const { mutate } = useShorten();
  const handleShorten = (longUrl: string) => {
    mutate(longUrl, {
      onSuccess: (data) => {
        setShortedUrl(data.shortUrl);
      },
    });
    // setShortedUrl(`https://short.ly/${Math.random().toString(36).substring(2, 8)}`);
  };
  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        <div className="glow-orb-primary -top-48 -left-48" />
        <div className="glow-orb-accent -bottom-32 -right-32" />

        <Section>
          <h1 className="arvo-bold text-2xl md:text-3xl font-bold font-display tracking-tight leading-tight mb-4">
            Create Your{" "}
            <span className="relative inline-block px-2">
              <span className="absolute inset-0 -skew-x-6 bg-linear-to-r from-cyan-300/40 to-blue-400/40 rounded-lg -z-10"></span>
              Short
            </span>{" "}
            Link
          </h1>

          <ShortInput onShorten={(longUrl) => handleShorten(longUrl)} />
          {shortedUrl && <ShortedUrlCard url={shortedUrl} />}
        </Section>

        <Section>
          <h2 className="arvo-bold text-xl md:text-2xl font-bold font-display tracking-tight mb-6 text-center">
            <span className="relative inline-block px-2">
              <span className="absolute inset-0 -skew-x-6 bg-linear-to-r from-cyan-300/40 to-blue-400/40 rounded-lg -z-10"></span>
              URL History
            </span>
          </h2>
          <HistoryTable />
        </Section>
      </main>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
