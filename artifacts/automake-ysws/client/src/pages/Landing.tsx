// ONLY CHANGES ARE MARKED WITH "FIX"

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
    a: "Build an automation, log your hours, submit it, and get approved.",
  },
];

/* KEEP ALL YOUR COMPONENTS EXACTLY THE SAME (HeroSection, etc.) */

/* ─── Main ───────────────────────────────────────────────── */
const TOTAL = 7;
const TRANSITION_MS = 900;
const INTEG_SECTION = 3;
const INTEG_HOLD = 2;
const SCROLLABLE_INDICES = [5, 6];

export default function Landing() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const transitioning = useRef(false);
  const intScrollCount = useRef(0);
  const [integLogoY, setIntegLogoY] = useState(0);
  const [scrollState, setScrollState] = useState({
    isAtTop: true,
    isAtBottom: true,
  });

  useEffect(() => {
    if (current !== INTEG_SECTION) {
      intScrollCount.current = 0;
      setIntegLogoY(0);
    }
    if (!SCROLLABLE_INDICES.includes(current)) {
      setScrollState({ isAtTop: true, isAtBottom: true });
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
      const scrollDir = e.deltaY > 0 ? 1 : -1;
      const isScrollableSection = SCROLLABLE_INDICES.includes(current);

      if (current === INTEG_SECTION && !transitioning.current) {
        e.preventDefault();
        intScrollCount.current += 1;
        setIntegLogoY((prev) =>
          Math.max(-70, Math.min(70, prev + scrollDir * -35)),
        );
        if (intScrollCount.current >= INTEG_HOLD) {
          intScrollCount.current = 0;
          go(current + scrollDir);
        } else {
          transitioning.current = true;
          setTimeout(() => (transitioning.current = false), 460);
        }
        return;
      }

      if (isScrollableSection) {
        if (scrollDir > 0 && !scrollState.isAtBottom) return;
        if (scrollDir < 0 && !scrollState.isAtTop) return;
        e.preventDefault();
        if (Math.abs(e.deltaY) < 15) return;
        go(current + scrollDir);
        return;
      }

      e.preventDefault();
      if (Math.abs(e.deltaY) < 25) return;
      if (transitioning.current) return;
      go(current + scrollDir);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [current, go, scrollState]);

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

  // ✅ FIXED (no zoom scale)
  const containerVariants = {
    enter: (d: number) => ({
      y: d > 0 ? "100%" : "-100%",
    }),
    center: {
      y: 0,
      transition: {
        duration: 0.88,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (d: number) => ({
      y: d > 0 ? "-18%" : "18%",
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 1, 1],
      },
    }),
  };

  const blobProps = {
    blobX: { b1: b1x, b2: b2x, b3: b3x, b4: b4x },
    blobY: { b1: b1y, b2: b2y, b3: b3y, b4: b4y },
  };

  return (
    <div>
      {/* ✅ SAFE IMPROVEMENT */}
      <div
        style={{
          height: "calc(100vh - 64px)",
          overflow: "hidden",
          position: "relative",
          maxWidth: "1600px",
          margin: "0 auto",
          width: "100%",
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
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "center center",
            }}
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
                onScrollStateChange={setScrollState}
              />
            )}
            {current === 6 && (
              <FooterSection dir={dir} onScrollStateChange={setScrollState} />
            )}
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] z-50"
          style={{ background: "rgba(0,229,160,0.15)" }}
        >
          <motion.div
            className="h-full"
            style={{ background: "#00E5A0" }}
            animate={{
              width: `${((current + 1) / TOTAL) * 100}%`,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </div>
    </div>
  );
}
