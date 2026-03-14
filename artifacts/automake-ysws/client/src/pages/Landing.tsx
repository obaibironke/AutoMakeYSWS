import { useRef, useState } from "react";
import { Link } from "wouter";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useInView } from "../hooks/useInView";
import MarqueeStrip from "../components/MarqueeStrip";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

/* ─── Data ──────────────────────────────────────────────────── */

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
];

const steps = [
  { icon: "🔧", label: "Build an automation project" },
  { icon: "📋", label: "Log your hours & submit" },
  { icon: "✅", label: "Get reviewed & approved" },
  { icon: "🪙", label: "Earn currency & shop rewards" },
];

const TITLE = "Automake YSWS".split(" ");

/* ─── Sub-components ─────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#3B2F3E]/20 rounded-xl overflow-hidden">
      <button
        className="w-full text-left flex items-center justify-between px-6 py-5 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans font-semibold text-[#3B2F3E] text-base pr-4">{q}</span>
        <span
          className="text-[#3B2F3E] text-xl font-bold shrink-0 inline-block"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.22s ease",
          }}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-5 bg-white border-t border-[#D1DCCF]">
              <p className="font-sans text-[#424242] text-base leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Reusable animated section wrapper */
function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView(0.12);
  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0, y: 72, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* Stagger children into view */
const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const staggerFast = { show: { transition: { staggerChildren: 0.07 } } };
const itemVariant = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const popVariant = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Main component ─────────────────────────────────────────── */

export default function Landing() {
  const featuredProjects = projects.slice(0, 3);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Parallax for hero blobs */
  const { scrollY } = useScroll();
  const rawB1 = useTransform(scrollY, [0, 700], [0, -180]);
  const rawB2 = useTransform(scrollY, [0, 700], [0, -110]);
  const rawB3 = useTransform(scrollY, [0, 700], [0, -70]);
  const blobY1 = useSpring(rawB1, { stiffness: 60, damping: 20 });
  const blobY2 = useSpring(rawB2, { stiffness: 60, damping: 20 });
  const blobY3 = useSpring(rawB3, { stiffness: 60, damping: 20 });

  /* Scroll hint fades after first scroll */
  const hintOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  /* Stagger container only plays when section is in view */
  const { ref: howRef, inView: howInView } = useInView(0.15);
  const { ref: projRef, inView: projInView } = useInView(0.12);

  return (
    <div>
      {/* ══════════════════════════════════
          SECTION 1 — Hero
      ══════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-[#D1DCCF] flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Parallax blobs */}
        <motion.div
          className="blob blob-1"
          style={{ width: 480, height: 480, background: "#3B2F3E", top: "8%", left: "2%", y: blobY1 }}
        />
        <motion.div
          className="blob blob-2"
          style={{ width: 360, height: 360, background: "#2a2230", top: "25%", right: "4%", y: blobY2 }}
        />
        <motion.div
          className="blob blob-3"
          style={{ width: 300, height: 300, background: "#4a6650", bottom: "12%", left: "28%", y: blobY3 }}
        />
        <motion.div
          className="blob blob-4"
          style={{ width: 220, height: 220, background: "#3B2F3E", bottom: "18%", right: "18%" }}
        />

        {/* Hero content */}
        <motion.div
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
          style={{ zIndex: 1 }}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            variants={itemVariant}
            className="inline-block bg-[#3B2F3E]/10 border border-[#3B2F3E]/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="font-sans text-xs font-semibold text-[#3B2F3E] uppercase tracking-widest">
              Hack Club presents
            </span>
          </motion.div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#3B2F3E] leading-tight mb-6 flex flex-wrap justify-center gap-x-[0.3em]">
            {TITLE.map((word, i) => (
              <motion.span key={i} variants={itemVariant} className="inline-block">
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={itemVariant}
            className="font-sans text-xl sm:text-2xl text-[#424242] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Build automation projects. Earn currency. Unlock rewards.
          </motion.p>

          <motion.div
            variants={itemVariant}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/showcase">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="font-sans font-semibold bg-[#3B2F3E] text-white px-8 py-4 rounded-lg text-base hover:bg-[#2d2330] transition-colors cursor-pointer inline-block"
              >
                Explore Projects
              </motion.span>
            </Link>
            <Link href="/guides">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="font-sans font-semibold border-2 border-[#3B2F3E] text-[#3B2F3E] px-8 py-4 rounded-lg text-base hover:bg-[#3B2F3E] hover:text-white transition-colors cursor-pointer inline-block"
              >
                Browse Guides
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity, position: "absolute", bottom: "2.5rem", left: "50%", x: "-50%", zIndex: 10 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="font-sans text-xs font-medium text-[#3B2F3E]/50 uppercase tracking-widest">scroll</span>
          <motion.svg
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#3B2F3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          SECTION 2 — How It Works
      ══════════════════════════════════ */}
      <RevealSection className="bg-white">
        <div className="flex flex-col justify-center min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div ref={howRef} className="w-full">
            <motion.div
              initial="hidden"
              animate={howInView ? "show" : "hidden"}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={itemVariant} className="text-center mb-14">
                <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">
                  Here's How It Works
                </h2>
                <p className="font-sans text-[#424242] text-lg max-w-2xl mx-auto">
                  Four simple steps from idea to reward. Anyone can do it.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariant}
                    whileHover={{ y: -6 }}
                    className="bg-[#D1DCCF]/30 border border-[#D1DCCF] rounded-xl p-8 text-center hover:bg-[#D1DCCF]/50 transition-colors"
                  >
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="font-sans text-xs font-bold text-[#3B2F3E]/50 uppercase tracking-widest mb-2">
                      Step {i + 1}
                    </div>
                    <p className="font-sans font-semibold text-[#3B2F3E] text-base">{step.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariant} className="text-center mt-10">
                <Link href="/guides">
                  <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                    Follow the Guides →
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-14">
            <MarqueeStrip />
          </div>
        </div>
      </RevealSection>

      {/* ══════════════════════════════════
          SECTION 3 — Projects + FAQ
      ══════════════════════════════════ */}
      <RevealSection className="bg-[#D1DCCF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Projects */}
          <div ref={projRef}>
            <motion.div
              initial="hidden"
              animate={projInView ? "show" : "hidden"}
              variants={staggerFast}
            >
              <motion.div variants={itemVariant} className="text-center mb-14">
                <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">
                  Projects shipped so far
                </h2>
                <p className="font-sans text-[#424242] text-lg max-w-2xl mx-auto">
                  Real automation projects built by real teens, just like you.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((p) => (
                  <motion.div key={p.id} variants={popVariant}>
                    <ProjectCard project={p} />
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariant} className="text-center mt-10">
                <Link href="/showcase">
                  <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                    See all projects →
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#3B2F3E] mb-3">FAQ</h2>
              <p className="font-sans text-[#424242]">Got questions? We've got answers.</p>
            </div>
            <div className="flex flex-col gap-3">
              {faqItems.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
