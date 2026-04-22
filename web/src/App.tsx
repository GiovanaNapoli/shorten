import { ShortInput } from "./components/short-input";

function App() {
  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        <div className="glow-orb-primary -top-48 -left-48" />
        <div className="glow-orb-accent -bottom-32 -right-32" />

        <section className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center gap-6 py-20 px-4">
          <h1 className="arvo-bold text-2xl md:text-3xl font-bold font-display tracking-tight leading-tight mb-4">
            Create Your{" "}
            <span className="relative inline-block px-2">
              <span className="absolute inset-0 -skew-x-6 bg-linear-to-r from-cyan-300/40 to-blue-400/40 rounded-lg -z-10"></span>
              Short
            </span>{" "}
            Link
          </h1>

          <ShortInput />
        </section>
      </main>

      {/* <Button icon={<CopyIcon size={16} />} text="Copy" />
      <Button icon={<ChartLineIcon size={16} />} text="Statistics" />
      <Button icon={<ShareIcon size={16} />} text="Share" /> */}
    </>
  );
}

export default App;
