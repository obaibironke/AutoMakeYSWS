import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import MarqueeStrip from "../components/MarqueeStrip";

const RSVP_URL = "https://forms.fillout.com/t/aMV1bXZoGvus";

/* ─── Data ────────────────────────────────────────────────── */
const steps = [
  { label: "Build an automation project" },
  { label: "Log your hours & submit" },
  { label: "Get reviewed & approved" },
  { label: "Earn credits & shop rewards" },
];

const faqItems = [
  {
    q: "Who can join?",
    a: "Any teen aged 13–18, anywhere in the world. Doesn't matter where you're from or what skill level you're at.",
  },
  {
    q: "How do I get credits?",
    a: "Build an automation, log your hours, submit it, and get approved. Simple. The cooler and more complex your project, the more credits you earn.",
  },
  {
    q: "What can I actually buy?",
    a: "Credits can be used to buy automation tools, gadgets, and more. Check out the shop to see what you can get!",
  },
  {
    q: "Do I need to know how to code?",
    a: "Nope! Making automations is one of the best ways to learn how to code. Most nodes do not require code and the few that do are not very complex.",
  },
  {
    q: "How many projects can I submit?",
    a: "You can submit as many projects as you would like. The more you ship, the more you earn!",
  },
  {
    q: "Do I have to use n8n?",
    a: "No you do not have to use n8n as long as you can export your workflow as a JSON and it works.",
  },
  {
    q: "What do I need to submit?",
    a: "For your project to be approved you need to have logged at least 3 hours of work. The automation needs to be able to run on its own without you starting it and you need to be able to submit your workflow's JSON. I need to be able to test it, whether it be through slack or hitting a webhook. If you just copy and paste from a guide, provide fake/demo only workflows, submit broken automations, submit the same workflow multiple times with no fixes, or create projects for the sole purpose of farming rewards, your project will be rejected and you may get banned from participating in Automake.",
  },
];

/* ─── Accordion ───────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const ,[open, setOpen] = useState(false);
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
            transition={{ duration: 0.28, ease: ,[0.22, 1, 0.36, 1] }}
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
    transition: { delay: 0.18, duration: 0.7, ease: ,[0.22, 1, 0.36, 1] },
  },
  exit: (d: number) => ({
    y: d > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
};

/* ─── Hero ───────────────────────────────────────────────── */
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
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <motion.div
          initial={{ opacity: 0, rotate: 8, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 12, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: ,[0.22, 1, 0.36, 1] }}
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
          transition={{ delay: 1.0, duration: 0.5, ease: ,[0.22, 1, 0.36, 1] }}
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
          transition={{ delay: 1.05, duration: 0.5, ease: ,[0.22, 1, 0.36, 1] }}
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
          CREDITS
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
              ease: ,[0.22, 1, 0.36, 1],
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
          <a href={RSVP_URL} target="_blank" rel="noopener noreferrer">
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
              RSVP Now
            </motion.span>
          </a>
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
        <span
          className="font-sans text-,[10px] font-semibold uppercase tracking-,[0.2em]"
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
          animate={{ y: ,[0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </div>
    </div>
  );
}

/* ─── About ──────────────────────────────────────────────── */
function AboutSection({ dir }: { dir: number }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden relative"
      style={{ background: "#F5F0E8" }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-4%",
          right: "-1%",
          fontSize: "22vw",
          fontWeight: 900,
          color: "rgba(15,25,35,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        AUTO
      </div>
      <motion.div
        className="w-full max-w-5xl mx-auto px-8 sm:px-12"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className="mb-6">
          <span
            className="font-sans text-xs font-bold uppercase tracking-,[0.25em]"
            style={{ color: "#FF5733" }}
          >
            About the program
          </span>
        </div>
        <h2
          className="font-sans font-extrabold mb-8 leading-tight"
          style={{ color: "#0F1923", fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
        >
          <span
            style={{
              display: "inline",
              background: "#00E5A0",
              borderRadius: "6px",
              padding: "0 10px 2px",
              marginRight: "12px",
            }}
          >
            Why
          </span>
          Automake?
        </h2>
        <p
          className="font-sans leading-relaxed"
          style={{
            color: "#0F1923",
            fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
            maxWidth: "780px",
          }}
        >
          Automations can be used for amazing things. They power useful tools
          like Slack bots or fun email responders.{" "}
          <span style={{ fontWeight: 800, color: "#00E5A0" }}>Automake</span>{" "}
          exists to provide a place{" "}
          <span style={{ fontWeight: 800, color: "#00E5A0" }}>
            (and reward)
          </span>{" "}
          for learning how to build real automations. You will learn how to take
          any inefficient or repetitive manual task and turn it into a task that
          takes care of itself.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <div
            style={{
              width: 48,
              height: 4,
              background: "#FF5733",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 24,
              height: 4,
              background: "#00E5A0",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 12,
              height: 4,
              background: "rgba(15,25,35,0.15)",
              borderRadius: 2,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── How It Works ───────────────────────────────────────── */
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

/* ─── Integrations ───────────────────────────────────────── */
const integrationLogos: Array<{
  slug: string;
  name: string;
  top: string;
  left: string;
  size: number;
  rot: number;
  src?: string;
}> = ,[
  { slug: "notion", name: "Notion", top: "6%", left: "29%", size: 80, rot: 3 },
  { slug: "github", name: "GitHub", top: "8%", left: "53%", size: 80, rot: -6 },
  {
    slug: "huggingface",
    name: "Hugging Face",
    top: "5%",
    left: "77%",
    size: 80,
    rot: 5,
  },
  {
    slug: "discord",
    name: "Discord",
    top: "20%",
    left: "16%",
    size: 80,
    rot: -3,
  },
  {
    slug: "airtable",
    name: "Airtable",
    top: "19%",
    left: "42%",
    size: 80,
    rot: 7,
  },
  {
    slug: "cloudflare",
    name: "Cloudflare",
    top: "21%",
    left: "66%",
    size: 80,
    rot: -5,
  },
  { slug: "stripe", name: "Stripe", top: "18%", left: "89%", size: 80, rot: 4 },
  { slug: "google", name: "Gemini", top: "33%", left: "6%", size: 80, rot: 4 },
  {
    slug: "whatsapp",
    name: "WhatsApp",
    top: "32%",
    left: "29%",
    size: 80,
    rot: -7,
  },
  { slug: "meta", name: "Meta", top: "34%", left: "53%", size: 80, rot: 6 },
  {
    slug: "anthropic",
    name: "Claude",
    top: "31%",
    left: "77%",
    size: 80,
    rot: -3,
  },
  { slug: "gmail", name: "Gmail", top: "46%", left: "16%", size: 80, rot: 5 },
  {
    slug: "mailchimp",
    name: "Mailchimp",
    top: "47%",
    left: "42%",
    size: 80,
    rot: -6,
  },
  {
    slug: "supabase",
    name: "Supabase",
    top: "45%",
    left: "66%",
    size: 80,
    rot: 4,
  },
  {
    slug: "clickup",
    name: "ClickUp",
    top: "48%",
    left: "89%",
    size: 80,
    rot: -5,
  },
  {
    slug: "facebook",
    name: "Facebook",
    top: "59%",
    left: "6%",
    size: 80,
    rot: 7,
  },
  {
    slug: "googledrive",
    name: "Google Drive",
    top: "58%",
    left: "29%",
    size: 80,
    rot: -4,
  },
  { slug: "vonage", name: "Vonage", top: "60%", left: "53%", size: 80, rot: 5 },
  {
    slug: "instagram",
    name: "Instagram",
    top: "57%",
    left: "77%",
    size: 80,
    rot: -5,
  },
  {
    slug: "googlesheets",
    name: "Google Sheets",
    top: "72%",
    left: "16%",
    size: 80,
    rot: 3,
  },
  {
    slug: "slack",
    name: "Slack",
    top: "71%",
    left: "29%",
    size: 80,
    rot: -4,
    src: "https://cdn.hackclub.com/019cee17-6c23-776d-9d1b-48582fc3ca3e/SLA-Slack-From-Salesforce-Logo-WHITE.png",
  },
  {
    slug: "calendly",
    name: "Calendly",
    top: "71%",
    left: "42%",
    size: 80,
    rot: -7,
  },
  {
    slug: "googleads",
    name: "Google Ads",
    top: "73%",
    left: "66%",
    size: 80,
    rot: 6,
  },
  { slug: "brevo", name: "Brevo", top: "70%", left: "89%", size: 80, rot: -3 },
];

function IntegrationsSection({ dir, logoY }: { dir: number; logoY: number }) {
  const ,[visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 350);
    return () => clearTimeout(t);
  }, ,[]);

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: "#0F1923" }}
    >
      <div
        style={{
          position: "absolute",
          inset: "3% 0",
          willChange: "transform",
          transform: `translateY(${logoY}px) translateZ(0)`,
          transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {integrationLogos.map((item, i) => (
          <div
            key={item.slug}
            title={item.name}
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              opacity: visible ? 1 : 0,
              transform: visible
                ? `translateY(0px) rotate(${item.rot}deg)`
                : `translateY(-28px) rotate(${item.rot}deg)`,
              transition: `opacity 0.5s ease ${i * 40}ms, transform 0.5s ease ${i * 40}ms`,
            }}
          >
            <div
              style={{
                width: item.size,
                height: item.size,
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
                  width: item.size * 0.48,
                  height: item.size * 0.48,
                  filter: item.src ? "none" : "brightness(0) invert(1)",
                  userSelect: "none",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        ))}
      </div>

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
              background: "rgba(15,25,35,0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
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
              We will pay for any integration you may need. Completely free.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── RSVP Section ───────────────────────────────────────── */
function RsvpSection({ dir }: { dir: number }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden relative"
      style={{ background: "#F5F0E8" }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-4%",
          right: "-1%",
          fontSize: "22vw",
          fontWeight: 900,
          color: "rgba(15,25,35,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        JOIN
      </div>
      <motion.div
        className="w-full max-w-5xl mx-auto px-8 sm:px-12 text-center"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className="mb-6">
          <span
            className="font-sans text-xs font-bold uppercase tracking-,[0.25em]"
            style={{ color: "#FF5733" }}
          >
            Join Automake
          </span>
        </div>
        <h2
          className="font-sans font-extrabold mb-6 leading-tight"
          style={{ color: "#0F1923", fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
        >
          Ready to{" "}
          <span
            style={{
              display: "inline",
              background: "#00E5A0",
              borderRadius: "6px",
              padding: "0 10px 2px",
            }}
          >
            ship?
          </span>
        </h2>
        <p
          className="font-sans leading-relaxed mb-10 mx-auto"
          style={{
            color: "#0F1923",
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            maxWidth: "600px",
          }}
        >
          Build a real automation, submit it, earn credits, and unlock rewards.
          Guides are free and open to everyone, you don't need to sign up start.
        </p>
        <a href={RSVP_URL} target="_blank" rel="noopener noreferrer">
          <motion.span
            whileHover={{ rotate: -1, y: 2 }}
            whileTap={{ scale: 0.97 }}
            className="font-sans font-bold px-12 py-5 rounded-lg text-lg cursor-pointer inline-block transition-all"
            style={{
              background: "#0F1923",
              color: "#00E5A0",
              boxShadow: "4px 4px 0px #FF5733",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform =
                "translate(3px,3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "4px 4px 0px #FF5733";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            RSVP →
          </motion.span>
        </a>
        <div className="mt-10 flex items-center justify-center gap-4">
          <div
            style={{
              width: 48,
              height: 4,
              background: "#FF5733",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 24,
              height: 4,
              background: "#00E5A0",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 12,
              height: 4,
              background: "rgba(15,25,35,0.15)",
              borderRadius: 2,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────── */
function FaqSectionContent({ 
  dir, 
  onScrollComplete 
}: { 
  dir: number;
  onScrollComplete: (complete: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      onScrollComplete(isAtBottom);
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      // Check initial state
      checkScroll();

      return () => element.removeEventListener('scroll', checkScroll);
    }
  }, ,[onScrollComplete]);

  return (
    <div
      ref={scrollRef}
      className="w-full h-full flex flex-col items-center justify-start overflow-auto"
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

/* ─── Footer Section ─────────────────────────────────────── */
function FooterSection({ 
  dir,
  onScrollComplete 
}: { 
  dir: number;
  onScrollComplete: (complete: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      onScrollComplete(isAtBottom);
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      // Check initial state
      checkScroll();

      return () => element.removeEventListener('scroll', checkScroll);
    }
  }, ,[onScrollComplete]);

  return (
    <div
      ref={scrollRef}
      className="w-full h-full flex flex-col items-center justify-start overflow-auto"
      style={{ background: "#0F1923" }}
    >
      <motion.div
        className="w-full max-w-6xl mx-auto px-8 md:px-12 py-12"
        custom={dir}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <p
          className="mb-4 font-sans text-lg md:text-xl font-bold"
          style={{ color: "#F5F0E8" }}
        >
          A project by{" "}
          <a
            href="https://hackclub.com?utm_source=automake"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors"
            style={{ color: "#00E5A0" }}
          >
            Hack Club
          </a>{" "}
          built by @Oba.
        </p>
        <p
          className="font-sans text-sm md:text-base mb-10 max-w-3xl leading-relaxed"
          style={{ color: "rgba(245,240,232,0.7)" }}
        >
          Hack Club is a 501(c)(3) nonprofit and network of 60k+ technical high
          schoolers. We believe you learn best by building so we're creating
          community and providing grants so you can make awesome projects. In
          the past few years, we've{" "}
          <a
            href="https://summer.hackclub.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-,[#00E5A0] transition-colors"
            style={{ color: "rgba(245,240,232,0.7)" }}
          >
            partnered with GitHub to run Summer of Making
          </a>
          ,{" "}
          <a
            href="https://github.com/hackclub/the-hacker-zephyr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-,[#00E5A0] transition-colors"
            style={{ color: "rgba(245,240,232,0.7)" }}
          >
            hosted the world's longest hackathon on land
          </a>
          , and{" "}
          <a
            href="https://www.youtube.com/watch?v=QvCoISXfcE8"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-,[#00E5A0] transition-colors"
            style={{ color: "rgba(245,240,232,0.7)" }}
          >
            ran Canada's largest high school hackathon
          </a>
          .<br />
          <br />
          At Hack Club, students aren't just learning, they're shipping.
        </p>
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <div className="flex flex-col">
            <p
              className="mb-3 font-sans text-base md:text-lg font-extrabold"
              style={{ color: "#F5F0E8" }}
            >
              Hack Club
            </p>
            <div
              className="font-sans text-sm md:text-base space-y-2"
              style={{ color: "rgba(245,240,232,0.7)" }}
            >
              {,[
                {
                  label: "Philosophy",
                  href: "https://hackclub.com/philosophy/",
                },
                {
                  label: "Our Team & Board",
                  href: "https://hackclub.com/team/",
                },
                { label: "Branding", href: "https://hackclub.com/brand/" },
                { label: "Donate", href: "https://hackclub.com/philanthropy/" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-,[#00E5A0] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <p
              className="mb-3 font-sans text-base md:text-lg font-extrabold"
              style={{ color: "#F5F0E8" }}
            >
              Automake
            </p>
            <div
              className="font-sans text-sm md:text-base space-y-2"
              style={{ color: "rgba(245,240,232,0.7)" }}
            >
              {,[
                { label: "Showcase", href: "/showcase" },
                { label: "Guides", href: "/guides" },
                { label: "Shop", href: "/shop" },
              ].map((l) => (
                <Link key={l.label} href={l.href}>
                  <span className="block hover:text-,[#00E5A0] transition-colors cursor-pointer">
                    {l.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <p
              className="mb-3 font-sans text-base md:text-lg font-extrabold"
              style={{ color: "#F5F0E8" }}
            >
              Resources
            </p>
            <div
              className="font-sans text-sm md:text-base space-y-2"
              style={{ color: "rgba(245,240,232,0.7)" }}
            >
              {,[
                {
                  label: "Community Events",
                  href: "https://events.hackclub.com/",
                },
                { label: "Jams", href: "https://jams.hackclub.com/" },
                { label: "Workshops", href: "https://workshops.hackclub.com/" },
                {
                  label: "Code of Conduct",
                  href: "https://hackclub.com/conduct/",
                },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-,[#00E5A0] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
const TOTAL = 7;
const TRANSITION_MS = 900;
const INTEG_SECTION = 3;
const INTEG_HOLD = 2;

// Sections that require scrolling to bottom
const SCROLLABLE_SECTIONS = ,[5, 6]; // FAQ and Footer

export default function Landing() {
  const ,[current, setCurrent] = useState(0);
  const ,[dir, setDir] = useState(1);
  const transitioning = useRef(false);
  const touchStartY = useRef(0);
  const intScrollCount = useRef(0);
  const ,[integLogoY, setIntegLogoY] = useState(0);
  const ,[scrolledToBottom, setScrolledToBottom] = useState(false);

  useEffect(() => {
    if (current !== INTEG_SECTION) {
      intScrollCount.current = 0;
      setIntegLogoY(0);
    }
    // Reset scroll state when changing sections
    setScrolledToBottom(false);
  }, ,[current]);

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

      // Check if current section is scrollable and requires bottom scroll
      if (SCROLLABLE_SECTIONS.includes(current) && next > current && !scrolledToBottom) {
        return; // Prevent navigation if not scrolled to bottom
      }

      setDir(next > current ? 1 : -1);
      setCurrent(next);
      transitioning.current = true;
      setTimeout(() => {
        transitioning.current = false;
      }, TRANSITION_MS);
    },
    ,[current, scrolledToBottom],
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
  }, ,[current, go]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStartY.current = e.touches,[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches,[0].clientY;
      if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, ,[current, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") go(current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") go(current - 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, ,[current, go]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 90);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 70);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, ,[]);

  const containerVariants = {
    enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%", scale: 1 }),
    center: {
      y: 0,
      scale: 1,
      transition: { duration: 0.88, ease: ,[0.22, 1, 0.36, 1] },
    },
    exit: (d: number) => ({
      y: d > 0 ? "-18%" : "18%",
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.6, ease: ,[0.4, 0, 1, 1] },
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
            {current === 1 && <AboutSection dir={dir} />}
            {current === 2 && <HowItWorksSection dir={dir} />}
            {current === 3 && (
              <IntegrationsSection dir={dir} logoY={integLogoY} />
            )}
            {current === 4 && <RsvpSection dir={dir} />}
            {current === 5 && (
              <FaqSectionContent 
                dir={dir} 
                onScrollComplete={setScrolledToBottom}
              />
            )}
            {current === 6 && (
              <FooterSection 
                dir={dir}
                onScrollComplete={setScrolledToBottom}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute bottom-0 left-0 right-0 h-,[3px] z-50"
          style={{ background: "rgba(0,229,160,0.15)" }}
        >
          <motion.div
            className="h-full"
            style={{ background: "#00E5A0" }}
            animate={{ width: `${((current + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.6, ease: ,[0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
