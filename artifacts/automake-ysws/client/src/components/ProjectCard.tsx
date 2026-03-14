import { Link } from "wouter";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white border border-[#D1DCCF] rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="mb-3">
        <h3 className="font-serif text-lg font-bold text-[#3B2F3E] leading-tight">
          {project.title}
        </h3>
      </div>

      <p className="font-sans text-sm text-[#424242] leading-relaxed flex-1 mb-4">
        {project.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div>
          <p className="font-sans text-sm font-semibold text-[#3B2F3E]">{project.creator}</p>
          <p className="font-sans text-xs text-[#424242]">
            {project.age} · {project.location}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[#424242]">
          <span className="text-sm">🕐</span>
          <span className="font-sans text-sm font-medium">{project.hours}h</span>
        </div>
      </div>

      <Link href={`/projects/${project.id}`}>
        <span className="mt-4 w-full inline-flex items-center justify-center font-sans text-sm font-semibold bg-[#3B2F3E] text-white px-5 py-2.5 rounded-lg hover:bg-[#2d2330] transition-colors cursor-pointer">
          View Project →
        </span>
      </Link>
    </div>
  );
}
