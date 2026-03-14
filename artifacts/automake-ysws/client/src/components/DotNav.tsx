import { useEffect, useState } from "react";

const LABELS = ["Hero", "How It Works", "Projects", "FAQ"];

interface DotNavProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function DotNav({ containerRef }: DotNavProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      setActive(Math.round(el.scrollTop / el.clientHeight));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [containerRef]);

  const scrollTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: i * el.clientHeight, behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "1.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {LABELS.map((label, i) => (
        <button
          key={i}
          onClick={() => scrollTo(i)}
          aria-label={`Go to section: ${label}`}
          title={label}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            border: "2px solid #3B2F3E",
            backgroundColor: active === i ? "#3B2F3E" : "transparent",
            transition: "background-color 0.25s ease, transform 0.2s ease",
            cursor: "pointer",
            padding: 0,
            transform: active === i ? "scale(1.3)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}
