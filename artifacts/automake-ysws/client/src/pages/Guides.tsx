import { useState } from "react";
import GuideCard from "../components/GuideCard";
import { guides } from "../data/guides";
import type { Guide } from "../data/guides";

const difficulties: (Guide["difficulty"] | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Guides() {
  const [active, setActive] = useState<Guide["difficulty"] | "All">("All");

  const filtered = active === "All" ? guides : guides.filter((g) => g.difficulty === active);

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

      {/* Filter + Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setActive(d)}
                className={`font-sans text-sm font-semibold px-5 py-2 rounded-full border transition-colors ${
                  active === d
                    ? "bg-[#3B2F3E] text-white border-[#3B2F3E]"
                    : "bg-white text-[#424242] border-[#D1DCCF] hover:border-[#3B2F3E] hover:text-[#3B2F3E]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center font-sans text-[#424242] mt-20 text-lg">
              No guides at this level yet — check back soon!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
