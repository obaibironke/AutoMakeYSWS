export default function Showcase() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-16" style={{ background: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="font-sans text-5xl font-extrabold mb-4"
            style={{ color: "#0F1923" }}
          >
            Project Showcase
          </h1>
          <p
            className="font-sans text-lg max-w-2xl mx-auto"
            style={{ color: "#0F1923" }}
          >
            Real automation projects built by teens around the world. Browse,
            get inspired, and submit your own.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <p
            className="text-center font-sans text-lg"
            style={{ color: "#0F1923" }}
          >
            Sorry, no awesome automations have been built yet, check back
            another day to see if some have been added!
          </p>
        </div>
      </section>
    </div>
  );
}
