import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import MarqueeStrip from "../components/MarqueeStrip";
import ProjectCard from "../components/ProjectCard";
import DotNav from "../components/DotNav";
import { projects } from "../data/projects";

const faqItems = [
  {
    q: "Who can participate?",
    a: "Any teen aged 13–18 anywhere in the world. Automake YSWS is open to all nationalities and skill levels.",
  },
  {
    q: "How do I earn currency?",
    a: "Submit an automation project, log your build hours, and get approved by an organizer. Each approved project earns you currency based on its complexity and time invested.",
  },
  {
    q: "What can I buy in the shop?",
    a: "Automation tools, tech gadgets, fun items, learning resources, and high-tier milestone rewards like laptops and travel stipends.",
  },
  {
    q: "Do I need prior experience?",
    a: "Not at all! Starter guides are available to help you build your first project from scratch, even if you've never coded before.",
  },
  {
    q: "How many projects can I submit?",
    a: "As many as you like! Each approved project earns you currency. The more you build, the more you earn.",
  },
  {
    q: "When does the program end?",
    a: "Check back for updates — the program runs on a rolling basis. We'll announce any deadlines or new seasons in our community Discord.",
  },
];

const steps = [
  { icon: "🔧", label: "Build an automation project" },
  { icon: "📋", label: "Log your hours & submit" },
  { icon: "✅", label: "Get reviewed & approved" },
  { icon: "🪙", label: "Earn currency & shop rewards" },
];

const TITLE_WORDS = "Automake YSWS".split(" ");

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#3B2F3E]/20 rounded-xl overflow-hidden">
      <button
        className="w-full text-left flex items-center justify-between px-6 py-5 bg-white hover:bg-[#D1DCCF]/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans font-semibold text-[#3B2F3E] text-base pr-4">{q}</span>
        <span
          className="text-[#3B2F3E] text-xl font-bold shrink-0"
          style={{
            display: "inline-block",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? "200px" : "0",
          opacity: open ? 1 : 0,
          transition: "max-height 0.3s ease, opacity 0.3s ease",
        }}
      >
        <div className="px-6 py-5 bg-white border-t border-[#D1DCCF]">
          <p className="font-sans text-[#424242] text-base leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const featuredProjects = projects.slice(0, 3);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [seenSections, setSeenSections] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      setActiveSection(idx);
      setScrolled(el.scrollTop > el.clientHeight * 0.3);
      setSeenSections((prev) => {
        if (prev.has(idx)) return prev;
        const next = new Set(prev);
        next.add(idx);
        return next;
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const vis = (sectionIdx: number) => seenSections.has(sectionIdx);

  const sectionStyle: React.CSSProperties = {
    height: "100vh",
    overflow: "hidden",
    scrollSnapAlign: "start",
    position: "relative",
  };

  return (
    <>
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
        }}
      >
        {/* ── Section 0: Hero ── */}
        <section id="section-hero" style={sectionStyle} className="bg-[#D1DCCF]">
          {/* Blobs */}
          <div
            className="blob blob-1"
            style={{ width: 420, height: 420, background: "#3B2F3E", top: "10%", left: "5%" }}
          />
          <div
            className="blob blob-2"
            style={{ width: 340, height: 340, background: "#2a2230", top: "30%", right: "8%" }}
          />
          <div
            className="blob blob-3"
            style={{ width: 280, height: 280, background: "#4a6650", bottom: "15%", left: "30%" }}
          />
          <div
            className="blob blob-4"
            style={{ width: 200, height: 200, background: "#3B2F3E", bottom: "20%", right: "20%" }}
          />

          {/* Content */}
          <div
            className="relative flex flex-col items-center justify-center h-full pt-20 text-center px-4 sm:px-6 lg:px-8"
            style={{ zIndex: 1 }}
          >
            <div
              className={`fade-up ${vis(0) ? "visible" : ""} inline-block bg-[#3B2F3E]/10 border border-[#3B2F3E]/20 rounded-full px-4 py-1.5 mb-6`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className="font-sans text-xs font-semibold text-[#3B2F3E] uppercase tracking-widest">
                Hack Club presents
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#3B2F3E] leading-tight mb-6">
              {TITLE_WORDS.map((word, i) => (
                <span
                  key={i}
                  className={`fade-up ${vis(0) ? "visible" : ""} inline-block mr-[0.3em]`}
                  style={{ transitionDelay: `${100 + i * 100}ms` }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p
              className={`fade-up ${vis(0) ? "visible" : ""} font-sans text-xl sm:text-2xl text-[#424242] max-w-2xl mx-auto mb-10 leading-relaxed`}
              style={{ transitionDelay: "300ms" }}
            >
              Build automation projects. Earn currency. Unlock rewards.
            </p>

            <div
              className={`fade-up ${vis(0) ? "visible" : ""} flex flex-col sm:flex-row gap-4 justify-center`}
              style={{ transitionDelay: "400ms" }}
            >
              <Link href="/showcase">
                <span className="font-sans font-semibold bg-[#3B2F3E] text-white px-8 py-4 rounded-lg text-base hover:bg-[#2d2330] transition-colors cursor-pointer inline-block">
                  Explore Projects
                </span>
              </Link>
              <Link href="/guides">
                <span className="font-sans font-semibold border-2 border-[#3B2F3E] text-[#3B2F3E] px-8 py-4 rounded-lg text-base hover:bg-[#3B2F3E] hover:text-white transition-colors cursor-pointer inline-block">
                  Browse Guides
                </span>
              </Link>
            </div>
          </div>

          {/* Scroll hint */}
          <div
            className="scroll-hint"
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              zIndex: 10,
              opacity: scrolled ? 0 : 1,
              transition: "opacity 0.4s ease",
              pointerEvents: "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B2F3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </section>

        {/* ── Section 1: How It Works ── */}
        <section id="section-how" style={sectionStyle} className="bg-white">
          <div className="flex flex-col justify-center h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div
              className={`slide-left ${vis(1) ? "visible" : ""} text-center mb-10`}
              style={{ transitionDelay: "0ms" }}
            >
              <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">
                Here's How It Works
              </h2>
              <p className="font-sans text-[#424242] text-lg max-w-2xl mx-auto">
                Four simple steps from idea to reward. Anyone can do it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`slide-left ${vis(1) ? "visible" : ""} bg-[#D1DCCF]/30 border border-[#D1DCCF] rounded-xl p-8 text-center hover:bg-[#D1DCCF]/50 transition-colors cursor-default`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="font-sans text-xs font-bold text-[#3B2F3E]/50 uppercase tracking-widest mb-2">
                    Step {i + 1}
                  </div>
                  <p className="font-sans font-semibold text-[#3B2F3E] text-base">{step.label}</p>
                </div>
              ))}
            </div>

            <div
              className={`fade-up ${vis(1) ? "visible" : ""} text-center mt-8`}
              style={{ transitionDelay: "650ms" }}
            >
              <Link href="/guides">
                <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                  Follow the Guides →
                </span>
              </Link>
            </div>

            <div className="mt-8">
              <MarqueeStrip />
            </div>
          </div>
        </section>

        {/* ── Section 2: Featured Projects ── */}
        <section id="section-projects" style={sectionStyle} className="bg-[#D1DCCF]">
          <div className="flex flex-col justify-center h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div
              className={`fade-up ${vis(2) ? "visible" : ""} text-center mb-10`}
              style={{ transitionDelay: "0ms" }}
            >
              <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">
                Projects shipped so far
              </h2>
              <p className="font-sans text-[#424242] text-lg max-w-2xl mx-auto">
                Real automation projects built by real teens, just like you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((p, i) => (
                <div
                  key={p.id}
                  className={`pop-in ${vis(2) ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>

            <div
              className={`fade-up ${vis(2) ? "visible" : ""} text-center mt-8`}
              style={{ transitionDelay: "350ms" }}
            >
              <Link href="/showcase">
                <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                  See all projects →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Section 3: FAQ ── */}
        <section id="section-faq" style={{ ...sectionStyle, overflowY: "auto" }} className="bg-[#D1DCCF]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div
              className={`fade-up ${vis(3) ? "visible" : ""} text-center mb-12`}
              style={{ transitionDelay: "0ms" }}
            >
              <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">FAQ</h2>
              <p className="font-sans text-[#424242] text-lg">Got questions? We've got answers.</p>
            </div>

            <div className="flex flex-col gap-3">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className={`fade-up ${vis(3) ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <FaqItem q={item.q} a={item.a} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <DotNav containerRef={containerRef} />
    </>
  );
}
