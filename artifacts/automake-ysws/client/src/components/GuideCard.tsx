import { Link } from "wouter";
import type { Guide } from "../data/guides";

interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <div className="bg-white border border-[#D1DCCF] rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <h3 className="font-serif text-lg font-bold text-[#3B2F3E] leading-tight flex-1">
          {guide.title}
        </h3>
      </div>

      <p className="font-sans text-sm text-[#424242] leading-relaxed flex-1 mb-4">
        {guide.description}
      </p>

      <p className="font-sans text-xs text-[#424242] mb-4">
        {guide.steps.length} steps · {guide.modifications.length} remix ideas
      </p>

      <Link href={`/guides/${guide.id}`}>
        <span className="mt-auto w-full inline-flex items-center justify-center font-sans text-sm font-semibold bg-[#3B2F3E] text-white px-5 py-2.5 rounded-lg hover:bg-[#2d2330] transition-colors cursor-pointer">
          View Guide →
        </span>
      </Link>
    </div>
  );
}
