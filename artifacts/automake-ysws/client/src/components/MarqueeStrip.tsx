const marqueeItems = [
  "⚡ Email Auto-Responder",
  "🤖 WhatsApp Bot",
  "📊 Auto-Report Generator",
  "🔗 Zapier Clone",
  "🧠 AI Flashcard Maker",
  "💬 Slack Daily Digest",
  "🪙 Crypto Price Notifier",
  "📅 Social Media Scheduler",
  "🎨 AI Recipe Generator",
  "📬 Newsletter Bot",
  "🔥 Notion Sync",
  "💡 Discord Alerts",
];

export default function MarqueeStrip() {
  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full overflow-hidden py-3" style={{ background: "#0F1923" }}>
      <div
        className="flex gap-3"
        style={{
          width: "max-content",
          animation: "marquee 32s linear infinite",
        }}
      >
        {doubled.map((text, i) => (
          <div
            key={i}
            className="rounded-full px-5 py-2.5 shrink-0 flex items-center"
            style={
              i % 2 === 0
                ? { background: "#00E5A0", color: "#0F1923" }
                : { background: "#FF5733", color: "white" }
            }
          >
            <span className="font-sans font-bold text-sm whitespace-nowrap">
              {text}
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
