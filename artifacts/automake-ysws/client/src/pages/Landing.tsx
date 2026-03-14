import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import MarqueeStrip from "../components/MarqueeStrip";
import ProjectCard from "../components/ProjectCard";
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

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function WaveDivider({ flip = false, fill = "#D1DCCF" }: { flip?: boolean; fill?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`}>
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#3B2F3E]/20 rounded-xl overflow-hidden">
      <button
        className="w-full text-left flex items-center justify-between px-6 py-5 bg-white hover:bg-[#D1DCCF]/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans font-semibold text-[#3B2F3E] text-base pr-4">{q}</span>
        <motion.span
          className="text-[#3B2F3E] text-xl font-bold shrink-0"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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

export default function Landing() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-[#D1DCCF] pt-20 pb-16 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block bg-[#3B2F3E]/10 border border-[#3B2F3E]/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="font-sans text-xs font-semibold text-[#3B2F3E] uppercase tracking-widest">
                Hack Club presents
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#3B2F3E] leading-tight mb-6"
            >
              Automake YSWS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-xl sm:text-2xl text-[#424242] max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Build automation projects. Earn currency. Unlock rewards.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/showcase">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="font-sans font-semibold bg-[#3B2F3E] text-white px-8 py-4 rounded-lg text-base hover:bg-[#2d2330] transition-colors cursor-pointer inline-block"
                >
                  Explore Projects
                </motion.span>
              </Link>
              <Link href="/guides">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="font-sans font-semibold border-2 border-[#3B2F3E] text-[#3B2F3E] px-8 py-4 rounded-lg text-base hover:bg-[#3B2F3E] hover:text-white transition-colors cursor-pointer inline-block"
                >
                  Browse Guides
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Wave divider */}
      <WaveDivider fill="#D1DCCF" />

      {/* ── How It Works ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">
              Here's How It Works
            </h2>
            <p className="font-sans text-[#424242] text-lg max-w-2xl mx-auto">
              Four simple steps from idea to reward. Anyone can do it.
            </p>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[#D1DCCF]/30 border border-[#D1DCCF] rounded-xl p-8 text-center hover:bg-[#D1DCCF]/50 transition-colors cursor-default"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="font-sans text-xs font-bold text-[#3B2F3E]/50 uppercase tracking-widest mb-2">
                  Step {i + 1}
                </div>
                <p className="font-sans font-semibold text-[#3B2F3E] text-base">{step.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <ScrollReveal className="text-center mt-10" delay={0.1}>
            <Link href="/guides">
              <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                Follow the Guides →
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <MarqueeStrip />

      {/* Wave */}
      <WaveDivider fill="white" />

      {/* ── Featured Projects ── */}
      <section className="bg-[#D1DCCF] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">
              Projects shipped so far
            </h2>
            <p className="font-sans text-[#424242] text-lg max-w-2xl mx-auto">
              Real automation projects built by real teens, just like you.
            </p>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {featuredProjects.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </motion.div>

          <ScrollReveal className="text-center mt-10" delay={0.1}>
            <Link href="/showcase">
              <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                See all projects →
              </span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-[#D1DCCF] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-4">FAQ</h2>
            <p className="font-sans text-[#424242] text-lg">Got questions? We've got answers.</p>
          </ScrollReveal>

          <motion.div
            className="flex flex-col gap-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <FaqItem q={item.q} a={item.a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
