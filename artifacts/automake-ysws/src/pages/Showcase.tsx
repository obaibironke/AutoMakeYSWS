import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";

const categories: (Project["category"] | "All")[] = ["All", "Automation", "AI", "IoT", "API", "Other"];

export default function Showcase() {
  const [active, setActive] = useState<Project["category"] | "All">("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#D1DCCF] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-[#3B2F3E] mb-4">Project Showcase</h1>
          <p className="font-sans text-lg text-[#424242] max-w-2xl mx-auto">
            Real automation projects built by teens around the world. Browse, get inspired, and submit your own.
          </p>
        </div>
      </section>

      {/* Filter pills + Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-sans text-sm font-semibold px-5 py-2 rounded-full border transition-colors ${
                  active === cat
                    ? "bg-[#3B2F3E] text-white border-[#3B2F3E]"
                    : "bg-white text-[#424242] border-[#D1DCCF] hover:border-[#3B2F3E] hover:text-[#3B2F3E]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center font-sans text-[#424242] mt-20 text-lg">
              No projects in this category yet — be the first to submit one!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
