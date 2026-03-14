import { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";

const categories: (Project["category"] | "All")[] = ["All", "Automation", "AI", "IoT", "API", "Other"];

export default function Showcase() {
  const [active, setActive] = useState<Project["category"] | "All">("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-16" style={{ background: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-sans text-5xl font-extrabold mb-4" style={{ color: "#0F1923" }}>Project Showcase</h1>
          <p className="font-sans text-lg max-w-2xl mx-auto" style={{ color: "#0F1923" }}>
            Real automation projects built by teens around the world. Browse, get inspired, and submit your own.
          </p>
        </div>
      </section>

      {/* Filter pills + Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="font-sans text-sm font-bold px-5 py-2 rounded-full border-2 transition-all"
                style={
                  active === cat
                    ? { background: "#00E5A0", color: "#0F1923", borderColor: "#00E5A0" }
                    : { background: "transparent", color: "#0F1923", borderColor: "#0F1923" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center font-sans mt-20 text-lg" style={{ color: "#0F1923" }}>
              No projects in this category yet — be the first to submit one!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
