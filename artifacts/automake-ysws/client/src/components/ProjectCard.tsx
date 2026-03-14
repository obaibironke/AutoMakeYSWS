import { Link } from "wouter";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col transition-all duration-200"
      style={{
        border: "2px solid #0F1923",
        borderTop: "4px solid #0F1923",
        boxShadow: "3px 3px 0px #0F1923",
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0px #0F1923")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0px #0F1923")}
    >
      <div className="mb-3">
        <h3 className="font-sans text-lg font-bold leading-tight" style={{ color: "#0F1923" }}>
          {project.title}
        </h3>
      </div>

      <p className="font-sans text-sm leading-relaxed flex-1 mb-4" style={{ color: "#0F1923" }}>
        {project.description}
      </p>

      <Link href={`/projects/${project.id}`}>
        <span
          className="mt-4 w-full inline-flex items-center justify-center font-sans text-sm font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-150"
          style={{ background: "#00E5A0", color: "#0F1923", boxShadow: "3px 3px 0px #0F1923" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translate(2px,2px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0px #0F1923"; (e.currentTarget as HTMLElement).style.transform = ""; }}
        >
          View Project →
        </span>
      </Link>
    </div>
  );
}
