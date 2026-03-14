const participants = [
  { name: "Amara", age: 16, location: "Nigeria" },
  { name: "Jake", age: 15, location: "USA" },
  { name: "Priya", age: 17, location: "India" },
  { name: "Luca", age: 16, location: "Italy" },
  { name: "Sofia", age: 17, location: "Brazil" },
  { name: "Kwame", age: 15, location: "Ghana" },
  { name: "Yuki", age: 16, location: "Japan" },
  { name: "Nia", age: 14, location: "UK" },
  { name: "Mateus", age: 15, location: "Portugal" },
  { name: "Aisha", age: 17, location: "Kenya" },
  { name: "Chen", age: 16, location: "China" },
  { name: "Fatima", age: 15, location: "Morocco" },
];

export default function MarqueeStrip() {
  const doubled = [...participants, ...participants];

  return (
    <div className="overflow-hidden py-2">
      <div
        className="flex gap-3"
        style={{
          width: "max-content",
          animation: "marquee 30s linear infinite",
        }}
      >
        {doubled.map((p, i) => (
          <div
            key={i}
            className="bg-[#D1DCCF]/40 border border-[#3B2F3E]/10 rounded-full px-5 py-2.5 shrink-0 flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-full bg-[#3B2F3E]/15 flex items-center justify-center text-[#3B2F3E] font-bold font-sans text-xs">
              {p.name[0]}
            </div>
            <span className="font-sans text-[#3B2F3E]/70 font-medium text-sm whitespace-nowrap">
              {p.name} · {p.age} · {p.location}
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
