import GuideCard from "../components/GuideCard";
import { guides } from "../data/guides";

export default function Guides() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-16" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 text-center">
          <h1
            className="font-sans font-extrabold mb-4"
            style={{ color: "#0F1923", fontSize: "clamp(3rem, 6vw, 7rem)" }}
          >
            Starter Guides
          </h1>
          <p
            className="font-sans max-w-3xl mx-auto"
            style={{ color: "#0F1923", fontSize: "clamp(1rem, 1.4vw, 1.5rem)" }}
          >
            These guides are starting points to remix. Follow the steps to build
            your first project, then make it your own and submit it to earn
            currency.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          {guides.length === 1 ? (
            <div style={{ maxWidth: "min(36rem, 40vw)", margin: "0 auto" }}>
              <GuideCard guide={guides[0]} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {guides.map((g) => (
                <GuideCard key={g.id} guide={g} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
