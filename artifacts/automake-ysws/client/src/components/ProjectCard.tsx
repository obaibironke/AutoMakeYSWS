import { Link } from "wouter";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-1"
      style={{
        borderTop: "4px solid #3B2F3E",
        border: "1px solid #D1DCCF",
        borderTopWidth: "4px",
        borderTopColor: "#3B2F3E",
        boxShadow: "3px 3px 0px #3B2F3E",
      }}
    >
      <div className="mb-3">
        <h3 className="font-sans text-lg font-bold text-[#3B2F3E] leading-tight">
          {project.title}
        </h3>
      </div>

      <p className="font-sans text-sm text-[#424242] leading-relaxed flex-1 mb-4">
        {project.description}
      </p>

      <Link href={`/projects/${project.id}`}>
        <span
          className="mt-4 w-full inline-flex items-center justify-center font-sans text-sm font-bold bg-[#3B2F3E] text-white px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:translate-y-[2px]"
          style={{ boxShadow: "3px 3px 0px #424242" }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "none")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "3px 3px 0px #424242")}
        >
          View Project →
        </span>
      </Link>
    </div>
  );
}
