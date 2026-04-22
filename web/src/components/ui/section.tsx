function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center gap-6 py-20 px-4">
      {children}
    </section>
  );
  
}

export default Section;
