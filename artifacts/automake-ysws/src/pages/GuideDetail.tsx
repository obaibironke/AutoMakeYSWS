import { Link, useParams } from "wouter";
import { guides } from "../data/guides";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-orange-100 text-orange-800",
};

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const guide = guides.find((g) => g.id === id);

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <h1 className="font-serif text-3xl text-[#3B2F3E]">Guide not found</h1>
        <Link href="/guides">
          <span className="font-sans text-[#3B2F3E] underline cursor-pointer">← Back to Guides</span>
        </Link>
      </div>
    );
  }

  const exampleProjects = projects.slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#D1DCCF] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/guides">
            <span className="font-sans text-sm text-[#3B2F3E] hover:underline cursor-pointer mb-6 inline-block">
              ← Back to Guides
            </span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-sans text-xs font-semibold px-3 py-1 rounded-full ${difficultyColors[guide.difficulty]}`}>
              {guide.difficulty}
            </span>
            <span className="font-sans text-sm text-[#424242]">{guide.steps.length} steps</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3B2F3E] leading-tight">
            {guide.title}
          </h1>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Intro */}
          <div>
            <p className="font-sans text-lg text-[#424242] leading-relaxed">{guide.description}</p>
          </div>

          {/* Steps */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#3B2F3E] mb-8">Step-by-Step Instructions</h2>
            <div className="space-y-4">
              {guide.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start bg-[#D1DCCF]/20 border border-[#D1DCCF] rounded-xl p-5"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#3B2F3E] text-white flex items-center justify-center font-sans font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="font-sans text-[#424242] text-base leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Make it your own */}
          <div className="bg-[#3B2F3E] rounded-2xl p-8 text-white">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">
              Ways to Make It Your Own
            </h2>
            <ul className="space-y-3">
              {guide.modifications.map((mod, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-[#D1DCCF] font-bold text-lg mt-0.5">✦</span>
                  <p className="font-sans text-[#D1DCCF] text-base leading-relaxed">{mod}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Example projects */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#3B2F3E] mb-8">
              Example Projects Built from Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exampleProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
