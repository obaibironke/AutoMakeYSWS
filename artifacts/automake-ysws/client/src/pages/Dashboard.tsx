import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardNav from "../components/DashboardNav";
import axios from "axios";

export default function Dashboard() {
  const [userName, setUserName] = useState(
    sessionStorage.getItem("user_name") || "User",
  );
  const [credits, setCredits] = useState(
    Number(sessionStorage.getItem("credits") || 0),
  );
  const [verified, setVerified] = useState(false);

  const fetchUserData = async () => {
    const slackId = sessionStorage.getItem("slack_id");
    if (!slackId) return false; // not signed in

    try {
      const res = await axios.get(`/api/getUser?slack_id=${slackId}`);
      const user = res.data.user;
      if (!user) return false;

      setCredits(user.credits ?? 0);
      setUserName(user.name ?? "User");
      setVerified(user.verified ?? false);

      sessionStorage.setItem("credits", String(user.credits ?? 0));
      sessionStorage.setItem("user_name", user.name ?? "User");

      return true;
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      return false;
    }
  };

  useEffect(() => {
    const slackId = sessionStorage.getItem("slack_id");
    if (!slackId) {
      window.location.href = "/auth";
      return;
    }

    fetchUserData();

    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, []);

  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <DashboardNav credits={credits} userName={userName} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
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

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          <div
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
              Credits Earned
            </p>
            <p
              className="font-sans text-3xl font-extrabold"
              style={{ color: "#00E5A0" }}
            >
              {credits}
            </p>
          </div>
          <div
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
              Projects Submitted
            </p>
            <p
              className="font-sans text-3xl font-extrabold"
              style={{ color: "#FF5733" }}
            >
              0
            </p>
          </div>
        </motion.div>

        {/* Projects section */}
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

          {/* Empty state */}
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
                Submit your first project
              </button>
              <a href="/guides">
                <span
                  className="font-sans font-bold px-6 py-3 rounded-lg text-sm cursor-pointer transition-all inline-block"
                  style={{
                    background: "white",
                    color: "#0F1923",
                    border: "2px solid #0F1923",
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
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
