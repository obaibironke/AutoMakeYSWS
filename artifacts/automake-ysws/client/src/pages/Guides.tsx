import GuideCard from "../components/GuideCard";
import { guides } from "../data/guides";

export default function Guides() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#D1DCCF] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-[#3B2F3E] mb-4">Starter Guides</h1>
          <p className="font-sans text-lg text-[#424242] max-w-2xl mx-auto">
            These guides are starting points to remix. Follow the steps to build your first project, then make it your own and submit it to earn currency.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
