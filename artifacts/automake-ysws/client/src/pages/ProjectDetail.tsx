import { Link, useParams } from "wouter";
import { projects } from "../data/projects";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#F5F0E8" }}>
        <h1 className="font-sans text-3xl font-extrabold" style={{ color: "#0F1923" }}>Project not found</h1>
        <Link href="/showcase">
          <span className="font-sans cursor-pointer underline" style={{ color: "#0F1923" }}>Back to Showcase</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-14" style={{ background: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/showcase">
            <span className="font-sans text-sm hover:underline cursor-pointer mb-6 inline-block" style={{ color: "#0F1923" }}>
              Back to Showcase
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-sans text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#00E5A0", color: "#0F1923" }}>
              {project.category}
            </span>
            <div className="flex items-center gap-1" style={{ color: "#0F1923" }}>
              <span className="font-sans text-sm font-medium">{project.hours} hours logged</span>
            </div>
          </div>
          <h1 className="font-sans text-4xl sm:text-5xl font-extrabold mb-3" style={{ color: "#0F1923" }}>
            {project.title}
          </h1>
          <p className="font-sans text-base" style={{ color: "#0F1923" }}>
            by <strong>{project.creator}</strong> · {project.age} · {project.location}
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-sans text-2xl font-extrabold mb-4" style={{ color: "#0F1923" }}>Screenshot</h2>
              <div className="w-full h-56 rounded-xl flex items-center justify-center" style={{ background: "white", border: "2px solid #0F1923" }}>
                <div className="text-center">
                  <p className="font-sans text-sm" style={{ color: "#0F1923" }}>Project screenshot placeholder</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-sans text-2xl font-extrabold mb-4" style={{ color: "#0F1923" }}>Demo Video</h2>
              <div className="w-full h-48 rounded-xl flex items-center justify-center" style={{ background: "white", border: "2px solid #0F1923" }}>
                <div className="text-center">
                  <p className="font-sans text-sm" style={{ color: "#0F1923" }}>Video URL not provided</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-sans text-2xl font-extrabold mb-4" style={{ color: "#0F1923" }}>Documentation</h2>
              <div className="prose max-w-none">
                {project.documentation.split("\n\n").map((para, i) => (
                  <p key={i} className="font-sans text-base leading-relaxed mb-4" style={{ color: "#0F1923" }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl p-5" style={{ background: "white", border: "2px solid #0F1923" }}>
              <h3 className="font-sans font-bold text-lg mb-3" style={{ color: "#0F1923" }}>About this project</h3>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#0F1923" }}>{project.description}</p>
            </div>

            <div className="rounded-xl p-5" style={{ background: "white", border: "2px solid #0F1923" }}>
              <h3 className="font-sans font-bold text-lg mb-3" style={{ color: "#0F1923" }}>Concepts learned</h3>
              <div className="flex flex-wrap gap-2">
                {project.concepts.map((c) => (
                  <span key={c} className="font-sans text-xs font-medium bg-white px-3 py-1 rounded-full" style={{ border: "1px solid #0F1923", color: "#0F1923" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-5 text-white" style={{ background: "#0F1923" }}>
              <h3 className="font-sans font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(245,240,232,0.6)" }}>Creator</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-sans" style={{ background: "#00E5A0", color: "#0F1923" }}>
                  {project.creator[0]}
                </div>
                <div>
                  <p className="font-sans font-bold" style={{ color: "#F5F0E8" }}>{project.creator}</p>
                  <p className="font-sans text-sm" style={{ color: "rgba(245,240,232,0.6)" }}>{project.age} · {project.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
