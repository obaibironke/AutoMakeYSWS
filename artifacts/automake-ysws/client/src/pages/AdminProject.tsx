import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";

const STATUSES = ["Pending Review", "Accepted", "Rejected"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Unsubmitted: { bg: "rgba(15,25,35,0.08)", color: "#0F1923" },
  "Pending Review": { bg: "rgba(255,193,7,0.15)", color: "#856404" },
  Accepted: { bg: "rgba(0,229,160,0.15)", color: "#007a52" },
  Rejected: { bg: "rgba(255,87,51,0.15)", color: "#c0392b" },
};

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
  screenshot: string | null;
  reviewerNotes: string | null;
}

export default function AdminProject() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const slackId = sessionStorage.getItem("slack_id") || "";

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [credits, setCredits] = useState("");

  useEffect(() => {
    if (!slackId) {
      setLocation("/");
      return;
    }
    fetch("/api/check-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slack_id: slackId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.isAdmin) setLocation("/");
      })
      .catch(() => setLocation("/"));
  }, []);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/getProject?id=${projectId}`, {
      headers: { "x-slack-id": slackId },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.project) {
          setProject(d.project);
          setSelectedStatus(d.project.status);
          setCredits(d.project.creditsAwarded?.toString() || "");
        } else {
          setError("Project not found.");
        }
      })
      .catch(() => setError("Failed to load project."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/admin-review-project", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-slack-id": slackId },
        body: JSON.stringify({
          project_id: project.id,
          action: selectedStatus === "Accepted" ? "approve" : "reject",
          status_override: selectedStatus,
          credits_awarded: Number(credits || 0),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProject((prev) =>
          prev
            ? {
                ...prev,
                status: selectedStatus,
                creditsAwarded: Number(credits || 0),
              }
            : prev,
        );
        setSaveMsg("Saved successfully.");
      } else {
        setSaveMsg(data.error || "Failed to save.");
      }
    } catch {
      setSaveMsg("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F1923" }}
      >
        <p
          className="font-sans text-sm"
          style={{ color: "rgba(245,240,232,0.4)" }}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F1923" }}
      >
        <p className="font-sans text-sm" style={{ color: "#FF5733" }}>
          {error || "Project not found."}
        </p>
      </div>
    );
  }

  const statusStyle =
    STATUS_COLORS[project.status] || STATUS_COLORS["Unsubmitted"];

  return (
    <div className="min-h-screen" style={{ background: "#0F1923" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(245,240,232,0.08)" }}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/admin")}
              className="font-sans text-sm font-semibold cursor-pointer"
              style={{
                color: "rgba(245,240,232,0.5)",
                background: "none",
                border: "none",
              }}
            >
              ← Back to Admin
            </button>
            <span style={{ color: "rgba(245,240,232,0.2)" }}>|</span>
            <p
              className="font-sans text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: "#FF5733" }}
            >
              Project Review
            </p>
          </div>
          <span
            className="font-sans text-xs font-bold px-3 py-1 rounded-full"
            style={statusStyle}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Project name + owner */}
          <h1
            className="font-sans font-extrabold mb-2"
            style={{ color: "#F5F0E8", fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
            {project.name}
          </h1>
          <p
            className="font-sans text-sm mb-8"
            style={{ color: "rgba(245,240,232,0.4)" }}
          >
            By {project.ownerName || project.ownerSlackId} ·{" "}
            {project.hoursLogged ?? 0} hours logged
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Description */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(245,240,232,0.04)",
                border: "1px solid rgba(245,240,232,0.08)",
              }}
            >
              <p
                className="font-sans text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(245,240,232,0.35)" }}
              >
                Description
              </p>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "rgba(245,240,232,0.8)" }}
              >
                {project.description}
              </p>
            </div>

            {/* How to test */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "rgba(245,240,232,0.04)",
                border: "1px solid rgba(245,240,232,0.08)",
              }}
            >
              <p
                className="font-sans text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(245,240,232,0.35)" }}
              >
                How to Test
              </p>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "rgba(245,240,232,0.8)" }}
              >
                {project.howToTest || "No instructions provided."}
              </p>
            </div>
          </div>

          {/* Repo URL */}
          {project.repoUrl && (
            <div
              className="rounded-xl p-5 mb-6"
              style={{
                background: "rgba(245,240,232,0.04)",
                border: "1px solid rgba(245,240,232,0.08)",
              }}
            >
              <p
                className="font-sans text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "rgba(245,240,232,0.35)" }}
              >
                Repository
              </p>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm underline"
                style={{ color: "#00E5A0" }}
              >
                {project.repoUrl}
              </a>
            </div>
          )}

          {/* Screenshot */}
          {project.screenshot && (
            <div
              className="rounded-xl overflow-hidden mb-6"
              style={{ border: "1px solid rgba(245,240,232,0.08)" }}
            >
              <p
                className="font-sans text-xs font-bold uppercase tracking-widest px-5 py-3"
                style={{
                  color: "rgba(245,240,232,0.35)",
                  borderBottom: "1px solid rgba(245,240,232,0.08)",
                }}
              >
                Screenshot
              </p>
              <img
                src={project.screenshot}
                alt="Project screenshot"
                className="w-full"
                style={{
                  maxHeight: "400px",
                  objectFit: "contain",
                  background: "rgba(245,240,232,0.02)",
                }}
              />
            </div>
          )}

          {/* Review actions */}
          <div
            className="rounded-xl p-6"
            style={{
              background: "rgba(0,229,160,0.04)",
              border: "1px solid rgba(0,229,160,0.12)",
            }}
          >
            <p
              className="font-sans text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "rgba(245,240,232,0.35)" }}
            >
              Review Actions
            </p>

            <div className="flex flex-wrap items-end gap-4">
              {/* Status selector */}
              <div>
                <p
                  className="font-sans text-xs mb-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Status
                </p>
                <div className="flex gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStatus(s)}
                      className="font-sans text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
                      style={{
                        background:
                          selectedStatus === s
                            ? s === "Accepted"
                              ? "#00E5A0"
                              : s === "Rejected"
                                ? "#FF5733"
                                : "rgba(255,193,7,0.3)"
                            : "rgba(245,240,232,0.06)",
                        color:
                          selectedStatus === s
                            ? s === "Accepted"
                              ? "#0F1923"
                              : "white"
                            : "rgba(245,240,232,0.5)",
                        border: "1px solid transparent",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Credits input */}
              <div>
                <p
                  className="font-sans text-xs mb-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Credits to award
                </p>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="font-sans text-sm px-3 py-2 rounded-lg w-28"
                  style={{
                    background: "rgba(245,240,232,0.06)",
                    border: "1px solid rgba(245,240,232,0.15)",
                    color: "#F5F0E8",
                    outline: "none",
                  }}
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="font-sans text-sm font-bold px-6 py-2.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: saving ? "rgba(0,229,160,0.4)" : "#00E5A0",
                  color: "#0F1923",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {saveMsg && (
              <p
                className="font-sans text-xs mt-4"
                style={{
                  color: saveMsg.includes("success") ? "#00E5A0" : "#FF5733",
                }}
              >
                {saveMsg}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
