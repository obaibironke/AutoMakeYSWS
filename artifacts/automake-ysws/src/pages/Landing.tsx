import { useState } from "react";
import { Link } from "wouter";
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
        <span className="text-[#3B2F3E] text-xl font-bold shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-6 py-5 bg-white border-t border-[#D1DCCF]">
          <p className="font-sans text-[#424242] text-base leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#D1DCCF] pt-20 pb-0 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-[#3B2F3E]/10 border border-[#3B2F3E]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="font-sans text-xs font-semibold text-[#3B2F3E] uppercase tracking-widest">
              Youth Startup Weekend — YSWS
            </span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#3B2F3E] leading-tight mb-6">
            Automake YSWS
          </h1>
          <p className="font-sans text-xl sm:text-2xl text-[#424242] max-w-2xl mx-auto mb-10 leading-relaxed">
            Build automation projects. Earn currency. Unlock rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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

          {/* Hero illustration */}
          <div className="relative mx-auto max-w-3xl">
            <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl rounded-t-2xl">
              <rect width="800" height="320" rx="16" fill="#3B2F3E" />
              {/* Decorative circuit lines */}
              <line x1="100" y1="80" x2="300" y2="80" stroke="#D1DCCF" strokeWidth="2" strokeDasharray="8 4" />
              <line x1="300" y1="80" x2="300" y2="160" stroke="#D1DCCF" strokeWidth="2" strokeDasharray="8 4" />
              <line x1="300" y1="160" x2="500" y2="160" stroke="#D1DCCF" strokeWidth="2" strokeDasharray="8 4" />
              <line x1="500" y1="160" x2="500" y2="240" stroke="#D1DCCF" strokeWidth="2" strokeDasharray="8 4" />
              <line x1="500" y1="240" x2="700" y2="240" stroke="#D1DCCF" strokeWidth="2" strokeDasharray="8 4" />
              {/* Nodes */}
              {[
                [100, 80], [300, 80], [300, 160], [500, 160], [500, 240], [700, 240]
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="10" fill="#D1DCCF" />
              ))}
              {/* Center text */}
              <text x="400" y="148" textAnchor="middle" fill="white" fontSize="20" fontFamily="serif" fontWeight="bold">Automate Everything</text>
              <text x="400" y="175" textAnchor="middle" fill="#D1DCCF" fontSize="13" fontFamily="sans-serif">🔧 Build → 📋 Submit → ✅ Approve → 🪙 Earn</text>
              {/* Icons */}
              <text x="100" y="55" textAnchor="middle" fontSize="22">⚙️</text>
              <text x="700" y="215" textAnchor="middle" fontSize="22">🚀</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <WaveDivider fill="#D1DCCF" />

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] text-center mb-4">
            Here's How It Works
          </h2>
          <p className="font-sans text-[#424242] text-center text-lg mb-14 max-w-2xl mx-auto">
            Four simple steps from idea to reward. Anyone can do it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-[#D1DCCF]/30 border border-[#D1DCCF] rounded-xl p-8 text-center hover:bg-[#D1DCCF]/50 transition-colors"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="font-sans text-xs font-bold text-[#3B2F3E]/50 uppercase tracking-widest mb-2">
                  Step {i + 1}
                </div>
                <p className="font-sans font-semibold text-[#3B2F3E] text-base">{step.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/guides">
              <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                Follow the Guides →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <MarqueeStrip />

      {/* Wave */}
      <WaveDivider fill="white" />

      {/* Featured Projects */}
      <section className="bg-[#D1DCCF] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] text-center mb-4">
            Projects shipped so far
          </h2>
          <p className="font-sans text-[#424242] text-center text-lg mb-14 max-w-2xl mx-auto">
            Real automation projects built by real teens, just like you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/showcase">
              <span className="font-sans font-semibold text-[#3B2F3E] text-base hover:underline cursor-pointer">
                See all projects →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider flip fill="#D1DCCF" />

      {/* Join Community */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image left */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <rect width="600" height="400" fill="#D1DCCF" />
                <rect x="60" y="60" width="480" height="280" rx="16" fill="white" />
                {/* People illustrations */}
                {[
                  { cx: 150, cy: 200, label: "🌍", name: "Builder" },
                  { cx: 300, cy: 200, label: "💻", name: "Maker" },
                  { cx: 450, cy: 200, label: "🚀", name: "Creator" },
                ].map((item, i) => (
                  <g key={i}>
                    <circle cx={item.cx} cy={item.cy - 30} r="40" fill="#3B2F3E" />
                    <text x={item.cx} y={item.cy - 20} textAnchor="middle" fontSize="28">{item.label}</text>
                    <text x={item.cx} y={item.cy + 30} textAnchor="middle" fill="#3B2F3E" fontSize="14" fontFamily="sans-serif" fontWeight="bold">{item.name}</text>
                  </g>
                ))}
                <text x="300" y="330" textAnchor="middle" fill="#3B2F3E" fontSize="16" fontFamily="serif" fontWeight="bold">
                  Join 100+ teen builders
                </text>
              </svg>
            </div>

            {/* Text right */}
            <div>
              <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] mb-6 leading-tight">
                Join a community of young builders
              </h2>
              <p className="font-sans text-[#424242] text-lg leading-relaxed mb-8">
                Automake YSWS is a program for teens who want to build real automation projects and get rewarded for it. Submit your work, earn currency, and unlock tools, gadgets, and more.
              </p>
              <p className="font-sans text-[#424242] text-base leading-relaxed mb-10">
                Whether you're a first-time builder or already shipping projects, there's a place for you here. Learn from guides, get inspired by other builders, and turn your ideas into reality.
              </p>
              <Link href="/guides">
                <span className="font-sans font-semibold bg-[#3B2F3E] text-white px-8 py-4 rounded-lg text-base hover:bg-[#2d2330] transition-colors cursor-pointer inline-block">
                  Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wave */}
      <WaveDivider fill="white" />

      {/* FAQ */}
      <section id="faq" className="bg-[#D1DCCF] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-[#3B2F3E] text-center mb-4">
            FAQ
          </h2>
          <p className="font-sans text-[#424242] text-center text-lg mb-12">
            Got questions? We've got answers.
          </p>
          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
