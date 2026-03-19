import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import DashboardNav from "../components/DashboardNav";

const HACK_CLUB_AUTH_URL =
  "https://auth.hackclub.com/oauth/authorize?client_id=c89f85642fe94c65cbead982b0b7e9b8&redirect_uri=http://automake.dino.icu/auth&response_type=code&scope=profile%20email%20name%20slack_id%20verification_status";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("");
  const [credits, setCredits] = useState(0);
  const [projectsSubmitted, setProjectsSubmitted] = useState(0);

  useEffect(() => {
    const slackId = sessionStorage.getItem("slack_id");
    if (!slackId) {
      window.location.href = HACK_CLUB_AUTH_URL;
      return;
    }

    setUserName(sessionStorage.getItem("user_name") || "");
    setCredits(Number(sessionStorage.getItem("credits")) || 0);
    setProjectsSubmitted(
      Number(sessionStorage.getItem("projects_submitted")) || 0,
    );

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/getCredits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slack_id: slackId }),
        });
        const data = await res.json();
        if (typeof data.credits === "number") {
          setCredits(data.credits);
          sessionStorage.setItem("credits", String(data.credits));
        }
        if (typeof data.projectsSubmitted === "number") {
          setProjectsSubmitted(data.projectsSubmitted);
          sessionStorage.setItem(
            "projects_submitted",
            String(data.projectsSubmitted),
          );
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <DashboardNav />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p
            className="font-sans text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: "#FF5733" }}
          >
            Dashboard
          </p>
          <h1
            className="font-sans font-extrabold leading-tight mb-2"
            style={{ color: "#0F1923", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Hey, {firstName || "there"}
          </h1>
          <p
            className="font-sans"
            style={{ color: "rgba(15,25,35,0.6)", fontSize: "1.1rem" }}
          >
            Here's your Automake dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
        >
          {[
            { label: "Credits", value: credits, accent: "#00E5A0" },
            {
              label: "Projects Submitted",
              value: projectsSubmitted,
              accent: "#FF5733",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6"
              style={{
                border: "2px solid #0F1923",
                boxShadow: "3px 3px 0px #0F1923",
              }}
            >
              <p
                className="font-sans text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "rgba(15,25,35,0.45)" }}
              >
                {stat.label}
              </p>
              <p
                className="font-sans text-3xl font-extrabold"
                style={{ color: stat.accent }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-sans text-2xl font-extrabold"
              style={{ color: "#0F1923" }}
            >
              Your Projects
            </h2>
            <button
              className="font-sans text-sm font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-all"
              style={{
                background: "#0F1923",
                color: "#00E5A0",
                boxShadow: "3px 3px 0px #FF5733",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform =
                  "translate(2px,2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "3px 3px 0px #FF5733";
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              + Submit Project
            </button>
          </div>

          <div
            className="flex flex-col items-center justify-center rounded-2xl py-24 text-center"
            style={{
              border: "2px dashed rgba(15,25,35,0.2)",
              background: "rgba(255,255,255,0.5)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: "rgba(0,229,160,0.12)",
                border: "2px solid rgba(0,229,160,0.3)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00E5A0"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
                <line x1="12" y1="13" x2="12" y2="17" />
                <line x1="10" y1="15" x2="14" y2="15" />
              </svg>
            </div>
            <h3
              className="font-sans text-xl font-extrabold mb-2"
              style={{ color: "#0F1923" }}
            >
              No projects yet
            </h3>
            <p
              className="font-sans text-sm mb-8 max-w-sm"
              style={{ color: "rgba(15,25,35,0.55)" }}
            >
              Build an automation, submit it, and earn credits. Follow a guide
              to get started.
            </p>
            <div className="flex gap-3">
              <button
                className="font-sans font-bold px-6 py-3 rounded-lg text-sm cursor-pointer transition-all"
                style={{
                  background: "#00E5A0",
                  color: "#0F1923",
                  boxShadow: "3px 3px 0px #0F1923",
                }}
              >
                Submit your first project
              </button>
              <Link href="/guides">
                <span
                  className="font-sans font-bold px-6 py-3 rounded-lg text-sm cursor-pointer transition-all inline-block"
                  style={{
                    background: "white",
                    color: "#0F1923",
                    border: "2px solid #0F1923",
                    boxShadow: "3px 3px 0px #0F1923",
                  }}
                >
                  Browse Guides
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
