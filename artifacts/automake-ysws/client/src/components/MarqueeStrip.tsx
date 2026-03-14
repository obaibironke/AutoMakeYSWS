import { projects } from "../data/projects";

export default function MarqueeStrip() {
  const doubled = [...projects, ...projects];

  return (
    <div className="w-full overflow-hidden py-3">
      <div
        className="flex gap-3"
        style={{
          width: "max-content",
          animation: "marquee 28s linear infinite",
        }}
      >
        {doubled.map((p, i) => (
          <div
            key={i}
            className="bg-[#D1DCCF]/40 border border-[#3B2F3E]/10 rounded-full px-5 py-2.5 shrink-0 flex items-center"
          >
            <span className="font-sans text-[#3B2F3E]/70 font-medium text-sm whitespace-nowrap">
              {p.title}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
