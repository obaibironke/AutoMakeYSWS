import { Link, useParams } from "wouter";
import { projects } from "../data/projects";

const categoryColors: Record<string, string> = {
  Automation: "bg-purple-100 text-purple-800",
  AI: "bg-blue-100 text-blue-800",
  IoT: "bg-green-100 text-green-800",
  API: "bg-orange-100 text-orange-800",
  Other: "bg-gray-100 text-gray-800",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <h1 className="font-serif text-3xl text-[#3B2F3E]">Project not found</h1>
        <Link href="/showcase">
          <span className="font-sans text-[#3B2F3E] underline cursor-pointer">← Back to Showcase</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#D1DCCF] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/showcase">
            <span className="font-sans text-sm text-[#3B2F3E] hover:underline cursor-pointer mb-6 inline-block">
              ← Back to Showcase
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`font-sans text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[project.category]}`}>
              {project.category}
            </span>
            <div className="flex items-center gap-1 text-[#424242]">
              <span>🕐</span>
              <span className="font-sans text-sm font-medium">{project.hours} hours logged</span>
            </div>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3B2F3E] mb-3">
            {project.title}
          </h1>
          <p className="font-sans text-base text-[#424242]">
            by <strong>{project.creator}</strong> · {project.age} · {project.location}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshot placeholder */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#3B2F3E] mb-4">Screenshot</h2>
              <div className="w-full h-56 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="font-sans text-sm text-gray-400">Project screenshot placeholder</p>
                </div>
              </div>
            </div>

            {/* Video placeholder */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#3B2F3E] mb-4">Demo Video</h2>
              <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">▶️</div>
                  <p className="font-sans text-sm text-gray-400">Video URL not provided</p>
                </div>
              </div>
            </div>

            {/* Documentation */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#3B2F3E] mb-4">Documentation</h2>
              <div className="prose max-w-none">
                {project.documentation.split("\n\n").map((para, i) => (
                  <p key={i} className="font-sans text-[#424242] text-base leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-[#D1DCCF]/40 border border-[#D1DCCF] rounded-xl p-5">
              <h3 className="font-serif font-bold text-[#3B2F3E] text-lg mb-3">About this project</h3>
              <p className="font-sans text-sm text-[#424242] leading-relaxed">{project.description}</p>
            </div>

            {/* Concepts */}
            <div className="bg-[#D1DCCF]/40 border border-[#D1DCCF] rounded-xl p-5">
              <h3 className="font-serif font-bold text-[#3B2F3E] text-lg mb-3">Concepts learned</h3>
              <div className="flex flex-wrap gap-2">
                {project.concepts.map((c) => (
                  <span key={c} className="font-sans text-xs font-medium bg-white border border-[#D1DCCF] text-[#424242] px-3 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Creator */}
            <div className="bg-[#3B2F3E] rounded-xl p-5 text-white">
              <h3 className="font-sans font-semibold text-white/70 text-xs uppercase tracking-widest mb-3">Creator</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D1DCCF] flex items-center justify-center text-[#3B2F3E] font-bold font-sans">
                  {project.creator[0]}
                </div>
                <div>
                  <p className="font-sans font-bold text-white">{project.creator}</p>
                  <p className="font-sans text-sm text-white/60">{project.age} · {project.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
