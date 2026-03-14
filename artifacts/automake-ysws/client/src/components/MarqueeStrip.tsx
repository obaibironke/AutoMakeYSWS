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
    <div className="bg-[#3B2F3E] py-8 overflow-hidden">
      <div
        className="flex gap-4 marquee-track"
        style={{
          width: "max-content",
          animation: "marquee 30s linear infinite",
        }}
      >
        {doubled.map((p, i) => (
          <div
            key={i}
            className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 shrink-0 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#D1DCCF] flex items-center justify-center text-[#3B2F3E] font-bold font-sans text-sm">
              {p.name[0]}
            </div>
            <span className="font-sans text-white font-medium text-sm whitespace-nowrap">
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
