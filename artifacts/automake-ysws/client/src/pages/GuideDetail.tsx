import { Link, useParams } from "wouter";
import { guides } from "../data/guides";

function renderStepText(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      const isLong = code.length > 30;

      if (isLong) {
        return (
          <code
            key={i}
            style={{
              background: "rgba(0,229,160,0.08)",
              border: "1px solid rgba(0,229,160,0.3)",
              borderRadius: "8px",
              padding: "8px 12px",
              fontFamily: "monospace",
              fontSize: "0.85em",
              fontWeight: 600,
              color: "#00E5A0",
              display: "block",
              marginTop: "10px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              overflowWrap: "anywhere",
            }}
          >
            {code}
          </code>
        );
      }

      return (
        <code
          key={i}
          style={{
            background: "rgba(0,229,160,0.12)",
            border: "1px solid rgba(0,229,160,0.3)",
            borderRadius: "6px",
            padding: "2px 8px",
            fontFamily: "monospace",
            fontSize: "0.88em",
            fontWeight: 600,
            color: "#00E5A0",
            display: "inline-block",
            whiteSpace: "nowrap",
            wordBreak: "normal",
            overflowWrap: "normal",
          }}
        >
          {code}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const guide = guides.find((g) => g.id === id);

  if (!guide) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#F5F0E8" }}
      >
        <h1 className="font-sans text-3xl font-extrabold" style={{ color: "#0F1923" }}>
          Guide not found
        </h1>
        <Link href="/guides">
          <span className="font-sans cursor-pointer underline" style={{ color: "#0F1923" }}>
            ← Back to Guides
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-14" style={{ background: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/guides">
            <span
              className="font-sans text-sm hover:underline cursor-pointer mb-6 inline-block"
              style={{ color: "#0F1923" }}
            >
              ← Back to Guides
            </span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-sans text-sm" style={{ color: "#0F1923" }}>
              {guide.steps.length} steps
            </span>
          </div>
          <h1
            className="font-sans text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ color: "#0F1923" }}
          >
            {guide.title}
          </h1>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <p className="font-sans text-lg leading-relaxed" style={{ color: "#0F1923" }}>
              {guide.description}
            </p>
          </div>

          {/* Steps */}
          <div>
            <h2 className="font-sans text-3xl font-extrabold mb-8" style={{ color: "#0F1923" }}>
              Step-by-Step Instructions
            </h2>
            <div className="space-y-4">
              {guide.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start rounded-xl p-5"
                  style={{ background: "white", border: "2px solid #0F1923" }}
                >
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-sm"
                    style={{ background: "#00E5A0", color: "#0F1923" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-sans text-base leading-relaxed pt-0.5"
                      style={{ color: "#0F1923" }}
                    >
                      {renderStepText(step.text)}
                    </p>
                    {step.images && step.images.length > 0 && (
                      <div className="mt-4 flex flex-col gap-3">
                        {step.images.map((src, j) => (
                          <img
                            key={j}
                            src={src}
                            alt={`Step ${i + 1} screenshot ${j + 1}`}
                            className="rounded-lg w-full"
                            style={{
                              border: "1px solid rgba(15,25,35,0.12)",
                              maxWidth: "100%",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Make it your own */}
          <div className="rounded-2xl p-8" style={{ background: "#0F1923" }}>
            <h2
              className="font-sans text-2xl font-extrabold mb-6"
              style={{ color: "#00E5A0" }}
            >
              Ways to Make It Your Own
            </h2>
            <ul className="space-y-3">
              {guide.modifications.map((mod, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="font-bold text-lg mt-0.5" style={{ color: "#00E5A0" }}>✦</span>
                  <p className="font-sans text-base leading-relaxed" style={{ color: "#F5F0E8" }}>
                    {renderStepText(mod)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}