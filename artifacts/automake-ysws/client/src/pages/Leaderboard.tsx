import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  name: string;
  credits: number;
}

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];
const RANK_LABELS = ["1st", "2nd", "3rd"];

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = sessionStorage.getItem("user_name") || null;

  useEffect(() => {
    fetch("/api/get-leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEntries(data.leaderboard);
        } else {
          setError("Failed to load leaderboard.");
        }
      })
      .catch(() => setError("Failed to load leaderboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p
            className="font-sans text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: "#FF5733" }}
          >
            Top builders
          </p>
          <h1
            className="font-sans font-extrabold leading-tight mb-3"
            style={{ color: "#0F1923", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Leaderboard
          </h1>
          <p
            className="font-sans"
            style={{ color: "rgba(15,25,35,0.55)", fontSize: "1.05rem" }}
          >
            Ranked by credits earned. Ship more, earn more.
          </p>
        </motion.div>

        {/* Top 3 podium */}
        {!loading && !error && entries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[entries[1], entries[0], entries[2]].map((entry, i) => {
              const actualRank = i === 1 ? 0 : i === 0 ? 1 : 2;
              const isFirst = actualRank === 0;
              const isCurrentUser = entry.name === currentUser;
              return (
                <div
                  key={entry.rank}
                  className="flex flex-col items-center rounded-2xl py-6 px-4 text-center"
                  style={{
                    background: isFirst ? "#0F1923" : "white",
                    border: `2px solid ${isCurrentUser ? "#00E5A0" : "#0F1923"}`,
                    boxShadow: isFirst
                      ? "4px 4px 0px #00E5A0"
                      : "3px 3px 0px #0F1923",
                    marginTop: isFirst ? 0 : "1.5rem",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ background: MEDAL_COLORS[actualRank] }}
                  >
                    <span
                      className="font-sans font-extrabold text-xs"
                      style={{ color: "#0F1923" }}
                    >
                      {RANK_LABELS[actualRank]}
                    </span>
                  </div>
                  <p
                    className="font-sans font-extrabold text-sm mb-1 truncate w-full"
                    style={{ color: isFirst ? "#F5F0E8" : "#0F1923" }}
                  >
                    {entry.name.split(" ")[0]}
                  </p>
                  <p
                    className="font-sans font-bold text-lg"
                    style={{ color: isFirst ? "#00E5A0" : "#FF5733" }}
                  >
                    {entry.credits}
                  </p>
                  <p
                    className="font-sans text-xs"
                    style={{
                      color: isFirst
                        ? "rgba(245,240,232,0.5)"
                        : "rgba(15,25,35,0.4)",
                    }}
                  >
                    credits
                  </p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Full list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-2"
        >
          {loading && (
            <div className="text-center py-16">
              <p
                className="font-sans text-sm font-semibold"
                style={{ color: "rgba(15,25,35,0.4)" }}
              >
                Loading...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p
                className="font-sans text-sm font-semibold"
                style={{ color: "#FF5733" }}
              >
                {error}
              </p>
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div
              className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
              style={{
                border: "2px dashed rgba(15,25,35,0.2)",
                background: "rgba(255,255,255,0.5)",
              }}
            >
              <p
                className="font-sans text-xl font-extrabold mb-2"
                style={{ color: "#0F1923" }}
              >
                No entries yet
              </p>
              <p
                className="font-sans text-sm"
                style={{ color: "rgba(15,25,35,0.5)" }}
              >
                Be the first to submit a project and claim the top spot.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            entries.map((entry, i) => {
              const isCurrentUser = entry.name === currentUser;
              const isTop3 = entry.rank <= 3;
              return (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.25 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl"
                  style={{
                    background: isCurrentUser
                      ? "rgba(0,229,160,0.08)"
                      : "white",
                    border: `2px solid ${isCurrentUser ? "#00E5A0" : "#0F1923"}`,
                    boxShadow: "2px 2px 0px #0F1923",
                  }}
                >
                  {/* Rank */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isTop3
                        ? MEDAL_COLORS[entry.rank - 1]
                        : "rgba(15,25,35,0.06)",
                    }}
                  >
                    <span
                      className="font-sans font-extrabold text-xs"
                      style={{
                        color: isTop3 ? "#0F1923" : "rgba(15,25,35,0.4)",
                      }}
                    >
                      #{entry.rank}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-sans font-bold text-sm truncate"
                      style={{ color: "#0F1923" }}
                    >
                      {entry.name}
                      {isCurrentUser && (
                        <span
                          className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "#00E5A0", color: "#0F1923" }}
                        >
                          you
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Credits */}
                  <div className="text-right shrink-0">
                    <p
                      className="font-sans font-extrabold text-base"
                      style={{ color: "#FF5733" }}
                    >
                      {entry.credits}
                    </p>
                    <p
                      className="font-sans text-xs"
                      style={{ color: "rgba(15,25,35,0.4)" }}
                    >
                      credits
                    </p>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      </div>
    </div>
  );
}
