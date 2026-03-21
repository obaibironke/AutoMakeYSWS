import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

type Tab = "projects" | "credits" | "orders";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  ownerName: string;
  ownerSlackId: string;
  hoursLogged: number | null;
  creditsAwarded: number | null;
  repoUrl: string | null;
  howToTest: string | null;
}

interface User {
  id: string;
  slackId: string;
  name: string;
  credits: number;
}

interface Order {
  id: string;
  userName: string;
  itemName: string;
  creditsSpent: number;
  date: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Unsubmitted:      { bg: "rgba(15,25,35,0.08)", color: "#0F1923" },
  "Pending Review": { bg: "rgba(255,193,7,0.15)", color: "#856404" },
  Accepted:         { bg: "rgba(0,229,160,0.15)", color: "#007a52" },
  Rejected:         { bg: "rgba(255,87,51,0.15)", color: "#c0392b" },
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [awardSlackId, setAwardSlackId] = useState("");
  const [awardAmount, setAwardAmount] = useState("");
  const [awardMsg, setAwardMsg] = useState<string | null>(null);
  const [projectCredits, setProjectCredits] = useState<Record<string, string>>({});

  const slackId = sessionStorage.getItem("slack_id") || "";

  useEffect(() => {
    if (!slackId) { setLocation("/"); return; }
    fetch("/api/check-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slack_id: slackId }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.isAdmin) { setAuthed(true); } else { setLocation("/"); } })
      .catch(() => setLocation("/"))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    setError(null);
    if (tab === "projects") {
      fetch("/api/admin-get-projects", { method: "GET", headers: { "x-slack-id": slackId } })
        .then((r) => r.json())
        .then((d) => { if (d.projects) setProjects(d.projects); else setError("Failed to load projects."); })
        .catch(() => setError("Failed to load projects."))
        .finally(() => setLoading(false));
    } else if (tab === "credits") {
      fetch("/api/admin-get-users", { method: "GET", headers: { "x-slack-id": slackId } })
        .then((r) => r.json())
        .then((d) => { if (d.users) setUsers(d.users); else setError("Failed to load users."); })
        .catch(() => setError("Failed to load users."))
        .finally(() => setLoading(false));
    } else if (tab === "orders") {
      fetch("/api/admin-get-orders", { method: "GET", headers: { "x-slack-id": slackId } })
        .then((r) => r.json())
        .then((d) => { if (d.orders) setOrders(d.orders); else setError("Failed to load orders."); })
        .catch(() => setError("Failed to load orders."))
        .finally(() => setLoading(false));
    }
  }, [authed, tab]);

  const handleProjectAction = async (projectId: string, action: "approve" | "reject") => {
    const credits = action === "approve" ? Number(projectCredits[projectId] || 0) : 0;
    const res = await fetch("/api/admin-review-project", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-slack-id": slackId },
      body: JSON.stringify({ project_id: projectId, action, credits_awarded: credits }),
    });
    const data = await res.json();
    if (data.success) {
      setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, status: action === "approve" ? "Accepted" : "Rejected", creditsAwarded: credits } : p));
    } else {
      alert(data.error || "Action failed");
    }
  };

  const handleAwardCredits = async () => {
    if (!awardSlackId || !awardAmount) return;
    const res = await fetch("/api/admin-award-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-slack-id": slackId },
      body: JSON.stringify({ target_slack_id: awardSlackId, amount: Number(awardAmount) }),
    });
    const data = await res.json();
    if (data.success) {
      setAwardMsg(`Awarded ${awardAmount} credits to ${awardSlackId}`);
      setAwardSlackId("");
      setAwardAmount("");
      fetch("/api/admin-get-users", { method: "GET", headers: { "x-slack-id": slackId } })
        .then((r) => r.json()).then((d) => { if (d.users) setUsers(d.users); });
    } else {
      setAwardMsg(data.error || "Failed to award credits");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F1923" }}>
        <p className="font-sans text-sm" style={{ color: "rgba(245,240,232,0.4)" }}>Checking access...</p>
      </div>
    );
  }

  if (!authed) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "projects", label: "Project Reviews" },
    { key: "credits", label: "Award Credits" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0F1923" }}>
      <div style={{ borderBottom: "1px solid rgba(245,240,232,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] mb-1" style={{ color: "#FF5733" }}>Admin Panel</p>
            <h1 className="font-sans text-2xl font-extrabold" style={{ color: "#F5F0E8" }}>Automake Control</h1>
          </div>
          <button
            onClick={() => setLocation("/dashboard")}
            className="font-sans text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer"
            style={{ background: "rgba(245,240,232,0.06)", color: "rgba(245,240,232,0.6)", border: "1px solid rgba(245,240,232,0.1)" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setError(null); setAwardMsg(null); }}
              className="font-sans text-sm font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-all"
              style={{
                background: tab === t.key ? "#00E5A0" : "rgba(245,240,232,0.06)",
                color: tab === t.key ? "#0F1923" : "rgba(245,240,232,0.6)",
                border: tab === t.key ? "none" : "1px solid rgba(245,240,232,0.1)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && <p className="font-sans text-sm mb-6" style={{ color: "#FF5733" }}>{error}</p>}
        {loading && <p className="font-sans text-sm mb-6" style={{ color: "rgba(245,240,232,0.4)" }}>Loading...</p>}

        {/* Project Reviews */}
        {tab === "projects" && !loading && (
          <div className="flex flex-col gap-4 pb-16">
            {projects.length === 0 && (
              <p className="font-sans text-sm" style={{ color: "rgba(245,240,232,0.4)" }}>No projects yet.</p>
            )}
            {projects.map((p) => {
              const statusStyle = STATUS_COLORS[p.status] || STATUS_COLORS["Unsubmitted"];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-6"
                  style={{ background: "rgba(245,240,232,0.04)", border: "1px solid rgba(245,240,232,0.08)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-sans font-extrabold text-base mb-1" style={{ color: "#F5F0E8" }}>{p.name}</h3>
                      <p className="font-sans text-xs" style={{ color: "rgba(245,240,232,0.45)" }}>
                        By {p.ownerName || p.ownerSlackId} · {p.hoursLogged ?? 0} hrs logged
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setLocation(`/admin/project/${p.id}`)}
                        className="font-sans text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        style={{ background: "rgba(245,240,232,0.08)", color: "rgba(245,240,232,0.7)", border: "1px solid rgba(245,240,232,0.12)" }}
                      >
                        View
                      </button>
                      <span
                        className="font-sans text-xs font-bold px-3 py-1 rounded-full"
                        style={statusStyle}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-sm mb-4 leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>{p.description}</p>
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="font-sans text-xs underline block mb-1" style={{ color: "#00E5A0" }}>
                      Repo: {p.repoUrl}
                    </a>
                  )}
                  {p.howToTest && (
                    <p className="font-sans text-xs mb-4" style={{ color: "rgba(245,240,232,0.45)" }}>
                      How to test: {p.howToTest}
                    </p>
                  )}
                  {p.status === "Pending Review" && (
                    <div className="flex items-center gap-3 mt-4">
                      <input
                        type="number"
                        min={0}
                        placeholder="Credits to award"
                        value={projectCredits[p.id] || ""}
                        onChange={(e) => setProjectCredits((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        className="font-sans text-sm px-3 py-2 rounded-lg w-40"
                        style={{ background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.15)", color: "#F5F0E8", outline: "none" }}
                      />
                      <button
                        onClick={() => handleProjectAction(p.id, "approve")}
                        className="font-sans text-sm font-bold px-5 py-2 rounded-lg cursor-pointer"
                        style={{ background: "#00E5A0", color: "#0F1923" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProjectAction(p.id, "reject")}
                        className="font-sans text-sm font-bold px-5 py-2 rounded-lg cursor-pointer"
                        style={{ background: "rgba(255,87,51,0.15)", color: "#FF5733", border: "1px solid rgba(255,87,51,0.3)" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Award Credits */}
        {tab === "credits" && !loading && (
          <div className="pb-16">
            <div className="rounded-xl p-6 mb-8" style={{ background: "rgba(245,240,232,0.04)", border: "1px solid rgba(245,240,232,0.08)" }}>
              <h2 className="font-sans font-extrabold text-base mb-4" style={{ color: "#F5F0E8" }}>Manually Award Credits</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Slack ID"
                  value={awardSlackId}
                  onChange={(e) => setAwardSlackId(e.target.value)}
                  className="font-sans text-sm px-3 py-2 rounded-lg"
                  style={{ background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.15)", color: "#F5F0E8", outline: "none", width: "200px" }}
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Amount"
                  value={awardAmount}
                  onChange={(e) => setAwardAmount(e.target.value)}
                  className="font-sans text-sm px-3 py-2 rounded-lg w-32"
                  style={{ background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.15)", color: "#F5F0E8", outline: "none" }}
                />
                <button
                  onClick={handleAwardCredits}
                  className="font-sans text-sm font-bold px-5 py-2 rounded-lg cursor-pointer"
                  style={{ background: "#00E5A0", color: "#0F1923" }}
                >
                  Award
                </button>
              </div>
              {awardMsg && <p className="font-sans text-xs mt-3" style={{ color: "#00E5A0" }}>{awardMsg}</p>}
            </div>

            <h2 className="font-sans font-extrabold text-base mb-4" style={{ color: "#F5F0E8" }}>All Users</h2>
            <div className="flex flex-col gap-2">
              {users.length === 0 && <p className="font-sans text-sm" style={{ color: "rgba(245,240,232,0.4)" }}>No users yet.</p>}
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-4 rounded-xl" style={{ background: "rgba(245,240,232,0.04)", border: "1px solid rgba(245,240,232,0.08)" }}>
                  <div>
                    <p className="font-sans font-bold text-sm" style={{ color: "#F5F0E8" }}>{u.name}</p>
                    <p className="font-sans text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>{u.slackId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-extrabold text-base" style={{ color: "#00E5A0" }}>{u.credits}</p>
                    <p className="font-sans text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>credits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && !loading && (
          <div className="pb-16">
            <div className="flex flex-col gap-2">
              {orders.length === 0 && <p className="font-sans text-sm" style={{ color: "rgba(245,240,232,0.4)" }}>No orders yet.</p>}
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-4 rounded-xl" style={{ background: "rgba(245,240,232,0.04)", border: "1px solid rgba(245,240,232,0.08)" }}>
                  <div>
                    <p className="font-sans font-bold text-sm" style={{ color: "#F5F0E8" }}>{o.itemName}</p>
                    <p className="font-sans text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>Ordered by {o.userName} · {o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-extrabold text-base" style={{ color: "#FF5733" }}>{o.creditsSpent}</p>
                    <p className="font-sans text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>credits spent</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}