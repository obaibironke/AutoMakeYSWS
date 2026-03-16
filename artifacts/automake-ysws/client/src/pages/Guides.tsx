import GuideCard from "../components/GuideCard";
import { guides } from "../data/guides";

export default function Guides() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-16" style={{ background: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="font-sans text-5xl font-extrabold mb-4"
            style={{ color: "#0F1923" }}
          >
            Starter Guides
          </h1>
          <p
            className="font-sans text-lg max-w-2xl mx-auto"
            style={{ color: "#0F1923" }}
          >
            These guides are starting points to remix. Follow the steps to build
            your first project, then make it your own and submit it to earn
            currency.
          </p>
        </div>
      </section>

      {/* Grid — single column when only one guide, grows naturally */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {guides.length === 1 ? (
            <div className="max-w-xl mx-auto">
              <GuideCard guide={guides[0]} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
