import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import MarqueeStrip from "../components/MarqueeStrip";
import { projects } from "../data/projects";

/* ─── Data ────────────────────────────────────────────────── */

const steps = [
  { label: "Build an automation project" },
  { label: "Log your hours & submit" },
  { label: "Get reviewed & approved" },
  { label: "Earn currency & shop rewards" },
];

const faqItems = [
  {
    q: "Who can join?",
    a: "Any teen aged 13–18, anywhere in the world. Doesn't matter where you're from or what skill level you're at.",
  },
  {
    q: "How do I get coins?",
    a: "Build an automation, log your hours, submit it, and get approved. Simple. The cooler and more complex your project, the more coins you earn.",
  },
  {
    q: "What can I actually buy?",
    a: "Coins can be used to buy automation tools, gadgets, and more. Check out the shop to see what you can get!",
  },
  {
    q: "Do I need to know how to code?",
    a: "Nope! Making automations is one of the best ways to learn how to code. Most nodes do not require code and the few that do are not very complex.",
  },
  {
    q: "How many projects can I submit?",
    a: "You can submit as many projects as you would like. The more you ship, the more you earn!",
  },
];

/* ─── Accordion ───────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "2px solid #0F1923",
        borderLeft: open ? "4px solid #00E5A0" : "2px solid #0F1923",
      }}
    >
      <button
        className="w-full text-left flex items-center justify-between px-6 py-4 transition-colors"
        style={{ background: open ? "white" : "rgba(255,255,255,0.8)" }}
        onClick={() => setOpen(!open)}
      >
        <span
          className="font-sans font-bold text-sm pr-4"
          style={{ color: "#0F1923" }}
        >
          {q}
        </span>
        <span
          className="text-lg font-bold shrink-0 inline-block"
          style={{
            color: "#0F1923",
            transform: open ? "rotate(45deg)" : "none",
            transition: "transform .2s ease",
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
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-6 py-4 bg-white"
              style={{ borderTop: "1px solid rgba(15,25,35,0.1)" }}
            >
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "#0F1923" }}
              >
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Section content variants ────────────────────────────── */

const contentVariants = {
  enter: (d: number) => ({ y: d > 0 ? 90 : -90, opacity: 0 }),
  center: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (d: number) => ({
    y: d > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
};

/* ─── Sections ────────────────────────────────────────────── */

function HeroSection({
  dir,
  blobX,
  blobY,
}: {
  dir: number;
  blobX: { b1: any; b2: any; b3: any; b4: any };
  blobY: { b1: any; b2: any; b3: any; b4: any };
}) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center text-center overflow-hidden"
      style={{ background: "#0F1923" }}
    >
      {/* Parallax blobs */}
      <motion.div
        className="blob blob-1"
        style={{
          width: 500,
          height: 500,
          background: "#00E5A0",
          top: "5%",
          left: "0%",
          x: blobX.b1,
          y: blobY.b1,
        }}
      />
      <motion.div
        className="blob blob-2"
        style={{
          width: 380,
          height: 380,
          background: "#FF5733",
          top: "20%",
          right: "2%",
          x: blobX.b2,
          y: blobY.b2,
        }}
      />
      <motion.div
        className="blob blob-3"
        style={{
          width: 300,
          height: 300,
          background: "#00E5A0",
          bottom: "10%",
          left: "25%",
          x: blobX.b3,
          y: blobY.b3,
        }}
      />
      <motion.div
        className="blob blob-4"
        style={{
          width: 220,
          height: 220,
          background: "#FF5733",
          bottom: "15%",
          right: "15%",
          x: blobX.b4,
          y: blobY.b4,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {/* Sticker badges */}
        <motion.div
          initial={{ opacity: 0, rotate: 8, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 12, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "6%",
            right: "3%",
            background: "#00E5A0",
            color: "#0F1923",
            borderRadius: "50%",
            width: 84,
            height: 84,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: 800,
            fontSize: "0.65rem",
            lineHeight: 1.3,
            letterSpacing: "0.05em",
            boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
            zIndex: 20,
            flexDirection: "column",
          }}
        >
          FREE
          <br />
          TOOLS
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: -4, scale: 0.8 }}
          animate={{ opacity: 1, rotate: -8, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            bottom: "8%",
            right: "3%",
            background: "#FF5733",
            color: "white",
            borderRadius: "50px",
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: "0.6rem",
            lineHeight: 1.4,
            textAlign: "center",
            letterSpacing: "0.06em",
            boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
            zIndex: 20,
          }}
        >
          OPEN TO
          <br />
          ALL TEENS
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: 2, scale: 0.8 }}
          animate={{ opacity: 1, rotate: -5, scale: 1 }}
          transition={{ delay: 1.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "6%",
            left: "3%",
            background: "#00E5A0",
            color: "#0F1923",
            borderRadius: "12px",
            padding: "8px 14px",
            fontWeight: 800,
            fontSize: "0.6rem",
            lineHeight: 1.4,
            textAlign: "center",
            letterSpacing: "0.06em",
            boxShadow: "3px 3px 0px rgba(0,0,0,0.3)",
            zIndex: 20,
          }}
        >
          EARN
          <br />
          COINS
        </motion.div>

        <motion.div
          className="inline-block rounded-full px-4 py-1.5 mb-5"
          style={{
            background: "rgba(245,240,232,0.1)",
            border: "1px solid rgba(245,240,232,0.2)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <span
            className="font-sans text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#F5F0E8" }}
          >
            Hack Club presents
          </span>
        </motion.div>

        <h1
          className="font-sans font-extrabold leading-none mb-5 flex flex-col items-center"
          style={{ color: "#F5F0E8" }}
        >
          <motion.span
            className="inline-block relative text-8xl sm:text-9xl pb-5"
            style={{ transform: "rotate(-2deg)", display: "inline-block" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Automake
            <svg
              viewBox="0 0 440 14"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 4,
                left: 0,
                width: "100%",
                height: 14,
              }}
              preserveAspectRatio="none"
            >
              <path
                d="M4 7 C34 1, 74 13, 114 7 S194 1, 234 7 S314 13, 354 7 S414 2, 438 7"
                fill="none"
                stroke="#F5F0E8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.span>
        </h1>

        <motion.p
          className="font-sans text-lg sm:text-xl max-w-xl mx-auto mb-9 leading-relaxed"
          style={{ color: "rgba(245,240,232,0.8)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          Build an automation that solves a real problem, get a SBC to host it.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          <Link href="/showcase">
            <motion.span
              whileHover={{ rotate: -1, y: 2 }}
              whileTap={{ scale: 0.97 }}
              className="font-sans font-bold px-8 py-4 rounded-lg text-base cursor-pointer inline-block transition-all"
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
              Explore Projects
            </motion.span>
          </Link>
          <Link href="/guides">
            <motion.span
              whileHover={{ rotate: 1, y: 2 }}
              whileTap={{ scale: 0.97 }}
              className="font-sans font-bold px-8 py-4 rounded-lg text-base cursor-pointer inline-block transition-all"
              style={{
                background: "#FF5733",
                color: "white",
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
              Browse Guides
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <span
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "rgba(0,229,160,0.7)" }}
        >
          scroll
        </span>
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00E5A0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </div>
    </div>
  );
}

function HowItWorksSection({ dir }: { dir: number }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#F5F0E8" }}
    >
      <motion.div
        className="w-full flex flex-col"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-12">
            <h2
              className="font-sans text-4xl sm:text-5xl font-extrabold mb-4"
              style={{ color: "#0F1923" }}
            >
              Here's <mark>How</mark> It Works
            </h2>
            <p
              className="font-sans text-lg max-w-2xl mx-auto"
              style={{ color: "#0F1923" }}
            >
              Four simple steps from idea to reward. Anyone can do it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, rotate: 0, transition: { duration: 0.2 } }}
                className="relative bg-white rounded-xl p-7 text-center overflow-hidden"
                style={{
                  boxShadow: "3px 3px 0px #0F1923",
                  border: "2px solid #0F1923",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    left: 6,
                    fontSize: "5rem",
                    fontWeight: 900,
                    color: "rgba(15,25,35,0.07)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="relative z-10">
                  <p
                    className="font-sans font-bold text-base"
                    style={{ color: "#0F1923" }}
                  >
                    {step.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/guides">
              <span
                className="font-sans font-semibold text-base hover:underline cursor-pointer"
                style={{ color: "#0F1923" }}
              >
                Follow the Guides →
              </span>
            </Link>
          </div>
        </div>

        <div className="w-full mt-10">
          <MarqueeStrip />
        </div>
      </motion.div>
    </div>
  );
}

function ProjectsSection({ dir }: { dir: number }) {
  const featuredProjects = projects.slice(0, 3);
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#F5F0E8" }}
    >
      <motion.div
        className="w-full max-w-6xl mx-auto px-6"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className="text-center mb-10">
          <h2
            className="font-sans text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ color: "#0F1923" }}
          >
            Projects <mark>shipped</mark> so far
          </h2>
          <p
            className="font-sans text-lg max-w-2xl mx-auto"
            style={{ color: "#0F1923" }}
          >
            Real automation projects built by real teens, just like you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3 + i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transform: `rotate(${i % 2 === 0 ? "1deg" : "-1deg"})` }}
              whileHover={{ rotate: 0, y: -4, transition: { duration: 0.2 } }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/showcase">
            <span
              className="font-sans font-semibold text-base hover:underline cursor-pointer"
              style={{ color: "#0F1923" }}
            >
              See all projects →
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function FaqSectionContent({ dir }: { dir: number }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-auto"
      style={{ background: "#F5F0E8" }}
    >
      <motion.div
        className="w-full max-w-2xl mx-auto px-6 py-10"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className="text-center mb-8">
          <h2
            className="font-sans text-4xl sm:text-5xl font-extrabold mb-3"
            style={{ color: "#0F1923" }}
          >
            <mark>FAQ</mark>
          </h2>
          <p className="font-sans" style={{ color: "#0F1923" }}>
            Got questions? We've got answers.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          {faqItems.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Integrations Section ───────────────────────────────── */

const integrationLogos = [
  // Row 1 — 4 icons, tops ~3-5%, cols at 3 / 28 / 54 / 80
  {
    slug: "slack",
    name: "Slack",
    top: "4%",
    left: "3%",
    size: 72,
    rot: -4,
    src: "https://cdn.hackclub.com/019cee17-6c23-776d-9d1b-48582fc3ca3e/SLA-Slack-From-Salesforce-Logo-WHITE.png",
  },
  { slug: "notion",      name: "Notion",      top: "3%",  left: "28%", size: 82, rot:  3 },
  { slug: "github",      name: "GitHub",      top: "5%",  left: "54%", size: 72, rot: -6 },
  { slug: "huggingface", name: "Hugging Face",top: "2%",  left: "80%", size: 82, rot:  5 },
  // Row 2 — 3 icons, tops ~15-18%, cols at 15 / 43 / 70 (staggered +12)
  { slug: "discord",     name: "Discord",     top: "16%", left: "15%", size: 82, rot: -3 },
  { slug: "airtable",    name: "Airtable",    top: "15%", left: "43%", size: 72, rot:  7 },
  { slug: "cloudflare",  name: "Cloudflare",  top: "18%", left: "71%", size: 92, rot: -5 },
  // Row 3 — 4 icons, tops ~28-31%, cols at 3 / 28 / 54 / 80
  { slug: "google",      name: "Gemini",      top: "29%", left: "3%",  size: 92, rot:  4 },
  { slug: "whatsapp",    name: "WhatsApp",    top: "28%", left: "29%", size: 72, rot: -7 },
  { slug: "meta",        name: "Meta",        top: "31%", left: "55%", size: 82, rot:  6 },
  { slug: "anthropic",   name: "Claude",      top: "27%", left: "81%", size: 72, rot: -3 },
  // Row 4 — 3 icons, tops ~41-44%, cols at 15 / 43 / 70
  { slug: "gmail",       name: "Gmail",       top: "42%", left: "15%", size: 72, rot:  5 },
  { slug: "mailchimp",   name: "Mailchimp",   top: "44%", left: "43%", size: 92, rot: -6 },
  { slug: "supabase",    name: "Supabase",    top: "41%", left: "71%", size: 82, rot:  4 },
  // Row 5 — 4 icons, tops ~54-57%, cols at 3 / 28 / 54 / 80
  { slug: "facebook",    name: "Facebook",    top: "55%", left: "3%",  size: 82, rot:  7 },
  { slug: "googledrive", name: "Google Drive",top: "54%", left: "29%", size: 72, rot: -4 },
  { slug: "vonage",      name: "Vonage",      top: "57%", left: "55%", size: 82, rot:  5 },
  { slug: "instagram",   name: "Instagram",   top: "55%", left: "81%", size: 72, rot: -5 },
  // Row 6 — 3 icons, tops ~67-70%, cols at 15 / 43 / 70
  { slug: "googlesheets",name: "Google Sheets",top:"68%", left: "14%", size: 82, rot:  3 },
  { slug: "clickup",     name: "ClickUp",     top: "67%", left: "43%", size: 72, rot: -7 },
  { slug: "stripe",      name: "Stripe",      top: "70%", left: "71%", size: 92, rot:  6 },
  // Row 7 — 3 icons, tops ~81-84%, cols at 3 / 41 / 79
  { slug: "calendly",    name: "Calendly",    top: "82%", left: "3%",  size: 72, rot: -3 },
  { slug: "googleads",   name: "Google Ads",  top: "80%", left: "41%", size: 82, rot:  5 },
  { slug: "brevo",       name: "Brevo",       top: "83%", left: "79%", size: 72, rot: -6 },
];

function IntegrationsSection({ dir, logoY }: { dir: number; logoY: number }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  const [ch, setCh] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => { setCw(el.offsetWidth); setCh(el.offsetHeight); };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Compute pixel positions dynamically so icons fill edge-to-edge on any screen
  const layout = useMemo(() => {
    if (!cw || !ch) return [];

    const PAD = cw * 0.02;
    const usableW = cw - 2 * PAD;

    // Fit 4 icons per row with a gap of 0.35× icon size
    // 4*size + 3*gap = usableW  →  size*(4 + 3*0.35) = usableW  →  size = usableW/5.05
    const size = Math.round(usableW / 5.05);
    const gap = (usableW - 4 * size) / 3;
    const halfCell = (size + gap) / 2; // stagger offset for 3-col rows

    // inset:"-10% 0" means the logo field starts 10% above container.
    // In logo field pixels: container top = 0.1*ch, container bottom = 1.1*ch
    const topStart = ch * 0.1 + ch * 0.02;
    const topEnd   = ch * 1.1 - size - ch * 0.02;
    const usableH  = topEnd - topStart;

    // 7 rows: alternating 4 and 3 icons = 4+3+4+3+4+3+3 = 24
    const rowPattern = [4, 3, 4, 3, 4, 3, 3];
    const rots = [-4, 3, -6, 5, -3, 7, -5, 4, -7, 6, -3, 5, -4, 7, -6, 3, -5, 6, -3, 4, -7, 5, -4, 3];

    const result: Array<{ top: number; left: number; size: number; rot: number }> = [];
    let idx = 0;

    rowPattern.forEach((cols, rowIdx) => {
      const rowFrac = rowIdx / (rowPattern.length - 1);
      const rowTop = topStart + rowFrac * usableH;
      const jitterY = ((rowIdx * 7) % 5 - 2) * ch * 0.004;

      const colLefts = cols === 4
        ? [0, 1, 2, 3].map(c => PAD + c * (size + gap))
        : [0, 1, 2].map(c => PAD + halfCell + c * (size + gap));

      colLefts.forEach((leftPx, colIdx) => {
        const jitterX = ((rowIdx * 3 + colIdx * 7) % 5 - 2) * cw * 0.003;
        result.push({
          top: rowTop + jitterY,
          left: leftPx + jitterX,
          size,
          rot: rots[idx % rots.length],
        });
        idx++;
      });
    });

    return result;
  }, [cw, ch]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{ background: "#0F1923" }}
    >
      {/* Scattered logo field */}
      <div
        style={{
          position: "absolute",
          inset: "-10% 0",
          willChange: "transform",
          transform: `translateY(${logoY}px) translateZ(0)`,
          transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {layout.map((pos, i) => {
          const item = integrationLogos[i];
          if (!item) return null;
          return (
            <div
              key={item.slug}
              title={item.name}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                opacity: visible ? 1 : 0,
                transform: visible
                  ? `translateY(0px) rotate(${pos.rot}deg)`
                  : `translateY(-28px) rotate(${pos.rot}deg)`,
                transition: `opacity 0.5s ease ${i * 40}ms, transform 0.5s ease ${i * 40}ms`,
              }}
            >
              <div
                style={{
                  width: pos.size,
                  height: pos.size,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={item.src ?? `https://cdn.simpleicons.org/${item.slug}`}
                  alt={item.name}
                  draggable={false}
                  style={{
                    width: pos.size * 0.48,
                    height: pos.size * 0.48,
                    filter: item.src ? "none" : "brightness(0) invert(1)",
                    userSelect: "none",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered text */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <motion.div
          custom={dir}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <div
            style={{
              background: "rgba(15,25,35,0.55)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "2.5rem 3rem",
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            <h2
              className="font-sans text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
              style={{ color: "#00E5A0" }}
            >
              We'll fund the tools you need
            </h2>
            <p
              className="font-sans text-base sm:text-lg leading-relaxed"
              style={{ color: "rgba(245,240,232,0.8)" }}
            >
              Get sponsored for any integration your automation requires — no cost to you.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── N8n Video Section ──────────────────────────────────── */

function N8nVideoSection({ dir }: { dir: number }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0F1923" }}
    >
      <motion.div
        className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center h-full"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className="text-center mb-10">
          <h2
            className="font-sans text-4xl sm:text-5xl font-extrabold mb-3"
            style={{ color: "#00E5A0" }}
          >
            n8n Workflow Execution
          </h2>
          <p
            className="font-sans text-lg"
            style={{ color: "rgba(245,240,232,0.8)" }}
          >
            Learn how to execute workflows with n8n automation
          </p>
        </div>
        <video
          controls
          className="w-full rounded-xl shadow-lg bg-black"
          style={{ aspectRatio: "16 / 9" }}
        >
          <source src="/N8N workflow execution.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </div>
  );
}

/* ─── Main: scrolljacking orchestrator ───────────────────── */

const TOTAL = 6;
const TRANSITION_MS = 900;
const INTEG_SECTION = 2;
const INTEG_HOLD = 2;

export default function Landing() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const transitioning = useRef(false);
  const touchStartY = useRef(0);
  const intScrollCount = useRef(0);
  const [integLogoY, setIntegLogoY] = useState(0);

  useEffect(() => {
    if (current !== INTEG_SECTION) {
      intScrollCount.current = 0;
      setIntegLogoY(0);
    }
  }, [current]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 38, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 38, damping: 18 });

  const b1x = useTransform(smoothX, (v) => v * 0.75);
  const b1y = useTransform(smoothY, (v) => v * 0.55);
  const b2x = useTransform(smoothX, (v) => v * -0.45);
  const b2y = useTransform(smoothY, (v) => v * 0.65);
  const b3x = useTransform(smoothX, (v) => v * 0.3);
  const b3y = useTransform(smoothY, (v) => v * -0.4);
  const b4x = useTransform(smoothX, (v) => v * -0.6);
  const b4y = useTransform(smoothY, (v) => v * -0.35);

  const go = useCallback(
    (next: number) => {
      if (transitioning.current || next < 0 || next >= TOTAL) return;
      setDir(next > current ? 1 : -1);
      setCurrent(next);
      transitioning.current = true;
      setTimeout(() => {
        transitioning.current = false;
      }, TRANSITION_MS);
    },
    [current],
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 8) return;
      if (transitioning.current) return;

      const scrollDir = e.deltaY > 0 ? 1 : -1;

      if (current === INTEG_SECTION) {
        intScrollCount.current += 1;
        setIntegLogoY((prev) =>
          Math.max(-70, Math.min(70, prev + scrollDir * -35)),
        );

        if (intScrollCount.current >= INTEG_HOLD) {
          intScrollCount.current = 0;
          go(current + scrollDir);
        } else {
          transitioning.current = true;
          setTimeout(() => {
            transitioning.current = false;
          }, 460);
        }
      } else {
        go(current + scrollDir);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [current, go]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [current, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") go(current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") go(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, go]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 90);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 70);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const containerVariants = {
    enter: (d: number) => ({
      y: d > 0 ? "100%" : "-100%",
      scale: 1,
    }),
    center: {
      y: 0,
      scale: 1,
      transition: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: number) => ({
      y: d > 0 ? "-18%" : "18%",
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 1, 1] },
    }),
  };

  const blobProps = {
    blobX: { b1: b1x, b2: b2x, b3: b3x, b4: b4x },
    blobY: { b1: b1y, b2: b2y, b3: b3y, b4: b4y },
  };

  return (
    <div>
      <div
        style={{
          height: "calc(100vh - 64px)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ position: "absolute", inset: 0 }}
          >
            {current === 0 && <HeroSection dir={dir} {...blobProps} />}
            {current === 1 && <HowItWorksSection dir={dir} />}
            {current === 2 && (
              <IntegrationsSection dir={dir} logoY={integLogoY} />
            )}
            {current === 3 && <ProjectsSection dir={dir} />}
            {current === 4 && <FaqSectionContent dir={dir} />}
            {current === 5 && <N8nVideoSection dir={dir} />}
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] z-50"
          style={{ background: "rgba(0,229,160,0.15)" }}
        >
          <motion.div
            className="h-full"
            style={{ background: "#00E5A0" }}
            animate={{ width: `${((current + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
