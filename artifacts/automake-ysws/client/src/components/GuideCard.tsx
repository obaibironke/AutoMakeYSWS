import { Link } from "wouter";
import type { Guide } from "../data/guides";

interface GuideCardProps {
  guide: Guide;
}

const difficultyColors: Record<
  Guide["difficulty"],
  { bg: string; color: string }
> = {
  Beginner: { bg: "#00E5A0", color: "#0F1923" },
  Intermediate: { bg: "#FF5733", color: "white" },
  Advanced: { bg: "#0F1923", color: "#F5F0E8" },
};

export default function GuideCard({ guide }: GuideCardProps) {
  // FIX: provide safe defaults
  const badge = difficultyColors[guide.difficulty] || {
    bg: "#E0E0E0",
    color: "#0F1923",
  };
  const steps = Array.isArray(guide.steps) ? guide.steps : [];
  const modifications = Array.isArray(guide.modifications)
    ? guide.modifications
    : [];

  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col transition-all duration-200"
      style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "5px 5px 0px #0F1923")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "3px 3px 0px #0F1923")
      }
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="font-sans text-lg font-bold leading-tight flex-1"
          style={{ color: "#0F1923" }}
        >
          {guide.title}
        </h3>
        <span
          className="shrink-0 font-sans text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: badge.bg, color: badge.color }}
        >
          {guide.difficulty || "Unknown"}
        </span>
      </div>
      <p
        className="font-sans text-sm leading-relaxed flex-1 mb-4"
        style={{ color: "#0F1923" }}
      >
        {guide.description}
      </p>
      <p className="font-sans text-xs mb-4" style={{ color: "#424242" }}>
        {steps.length} steps · {modifications.length} remix ideas
      </p>
      <Link href={guide.link || `/guides/${guide.id}`}>
        <span
          className="mt-auto w-full inline-flex items-center justify-center font-sans text-sm font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-150"
          style={{
            background: "#00E5A0",
            color: "#0F1923",
            boxShadow: "3px 3px 0px #0F1923",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.transform =
              "translate(2px,2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "3px 3px 0px #0F1923";
            (e.currentTarget as HTMLElement).style.transform = "";
          }}
        >
          View Guide →
        </span>
      </Link>
    </div>
  );
}
