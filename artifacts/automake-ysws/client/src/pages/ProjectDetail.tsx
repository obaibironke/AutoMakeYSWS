import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";

const HACK_CLUB_AUTH_URL =
  "https://auth.hackclub.com/oauth/authorize?client_id=c89f85642fe94c65cbead982b0b7e9b8&redirect_uri=http://automake.dino.icu/auth&response_type=code&scope=profile%20email%20name%20slack_id%20verification_status";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  repoUrl: string | null;
  howToTest: string | null;
  screenshot: string | null;
  creditsAwarded: number | null;
  hoursLogged: number | null;
}

interface Session {
  id: string;
  hours: number;
  notes: string;
  date: string;
  lapseSession: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  Unsubmitted: { bg: "rgba(15,25,35,0.08)", color: "#6B7280" },
  "Pending Review": { bg: "rgba(255,193,7,0.15)", color: "#B8860B" },
  Approved: { bg: "rgba(0,229,160,0.15)", color: "#00A372" },
  Rejected: { bg: "rgba(255,87,51,0.15)", color: "#FF5733" },
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [sessionHours, setSessionHours] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionLapse, setSessionLapse] = useState("");
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [sessionSuccess, setSessionSuccess] = useState(false);

  // Screenshot upload state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Screenshot delete state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [screenshotHovered, setScreenshotHovered] = useState(false);

  useEffect(() => {
    const slackId = sessionStorage.getItem("slack_id");
    if (!slackId) {
      window.location.href = HACK_CLUB_AUTH_URL;
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/getProject?id=${id}`);
        const data = await res.json();
        if (res.ok && data.project) {
          setProject(data.project);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/getSessions?project_id=${id}`);
        const data = await res.json();
        if (data.sessions) {
          setSessions(data.sessions);
          setTotalHours(
            data.sessions.reduce((sum: number, s: Session) => sum + s.hours, 0)
          );
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };

    fetchProject();
    fetchSessions();
  }, [id]);

  const handleLogSession = async () => {
    if (!sessionHours || Number(sessionHours) <= 0) {
      setSessionError("Please enter a valid number of hours.");
      return;
    }
    if (!sessionNotes.trim()) {
      setSessionError("Please describe what you worked on.");
      return;
    }
    if (!sessionLapse.trim()) {
      setSessionError("Please provide a link to your Lapse session.");
      return;
    }

    setSessionLoading(true);
    setSessionError("");

    try {
      const res = await fetch("/api/logSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          hours: Number(sessionHours),
          notes: sessionNotes,
          lapseSession: sessionLapse,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSessionError(data.error || "Failed to log session.");
        setSessionLoading(false);
        return;
      }

      const newSession: Session = {
        id: data.session.id,
        hours: data.session.hours,
        notes: data.session.notes,
        date: data.session.date,
        lapseSession: data.session.lapseSession,
      };

      setSessions((prev) => [newSession, ...prev]);
      setTotalHours((prev) => prev + newSession.hours);
      setSessionHours("");
      setSessionNotes("");
      setSessionLapse("");
      setSessionSuccess(true);
      setTimeout(() => setSessionSuccess(false), 3000);
    } catch (err) {
      setSessionError("Something went wrong.");
    } finally {
      setSessionLoading(false);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }
      setScreenshotFile(file);
      setUploadError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadError("Please select a valid image file");
    }
  };

  const handleUploadScreenshot = async () => {
    if (!screenshotFile) return;

    setUploadLoading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", screenshotFile);
      formData.append("project_id", id);

      const response = await fetch("/api/uploadToCDN", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      setProject((prev) => (prev ? { ...prev, screenshot: data.url } : null));
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteScreenshot = async () => {
    if (!project?.screenshot) return;

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const response = await fetch("/api/deleteScreenshot", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }

      // Clear screenshot from local state
      setProject((prev) => (prev ? { ...prev, screenshot: null } : null));
      setScreenshotHovered(false);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete screenshot."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F5F0E8" }}
      >
        <div
          className="w-8 h-8 rounded-full border-4 animate-spin"
          style={{ borderColor: "#00E5A0", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#F5F0E8" }}
      >
        <h1
          className="font-sans text-3xl font-extrabold"
          style={{ color: "#0F1923" }}
        >
          Project not found
        </h1>
        <Link href="/dashboard">
          <span
            className="font-sans cursor-pointer underline"
            style={{ color: "#0F1923" }}
          >
            Back to Dashboard
          </span>
        </Link>
      </div>
    );
  }

  const statusStyle = statusColors[project.status] ?? {
    bg: "rgba(15,25,35,0.08)",
    color: "#6B7280",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard">
          <span
            className="font-sans text-sm hover:underline cursor-pointer mb-8 inline-block"
            style={{ color: "#0F1923" }}
          >
            ← Back to Dashboard
          </span>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="font-sans text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {project.status}
            </span>
          </div>
          <h1
            className="font-sans text-4xl sm:text-5xl font-extrabold mb-2"
            style={{ color: "#0F1923" }}
          >
            {project.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">

            {/* Screenshot */}
            <div
              className="rounded-xl overflow-hidden relative"
              style={{ border: "2px solid #0F1923" }}
              onMouseEnter={() => project.screenshot && project.status === "Unsubmitted" && setScreenshotHovered(true)}
              onMouseLeave={() => setScreenshotHovered(false)}
            >
              {project.screenshot ? (
                <>
                  <img
                    src={project.screenshot}
                    alt={project.name}
                    className="w-full object-cover"
                    style={{ display: "block" }}
                  />
                  {/* Delete overlay — only on Unsubmitted projects */}
                  {project.status === "Unsubmitted" && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(255,87,51,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: screenshotHovered ? 1 : 0,
                        transition: "opacity 0.2s ease",
                        pointerEvents: screenshotHovered ? "auto" : "none",
                      }}
                    >
                      <button
                        onClick={handleDeleteScreenshot}
                        disabled={deleteLoading}
                        title="Delete screenshot"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          border: "2px solid white",
                          borderRadius: "50%",
                          width: 52,
                          height: 52,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: deleteLoading ? "not-allowed" : "pointer",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {deleteLoading ? (
                          // Spinner
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              border: "3px solid white",
                              borderTopColor: "transparent",
                              borderRadius: "50%",
                              animation: "spin 0.7s linear infinite",
                            }}
                          />
                        ) : (
                          // Trash icon
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-white">
                  <p
                    className="font-sans text-sm"
                    style={{ color: "rgba(15,25,35,0.4)" }}
                  >
                    No screenshot provided
                  </p>
                </div>
              )}
            </div>

            {/* Delete error */}
            {deleteError && (
              <p className="font-sans text-xs font-bold" style={{ color: "#FF5733" }}>
                {deleteError}
              </p>
            )}

            {/* Upload Screenshot (only show for Unsubmitted projects) */}
            {project.status === "Unsubmitted" && (
              <div
                className="rounded-xl p-6 bg-white"
                style={{
                  border: "2px solid #0F1923",
                  boxShadow: "3px 3px 0px #0F1923",
                }}
              >
                <h2
                  className="font-sans text-xl font-extrabold mb-5"
                  style={{ color: "#0F1923" }}
                >
                  {project.screenshot ? "Update Screenshot" : "Upload Screenshot"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      className="font-sans text-xs font-bold uppercase tracking-widest block mb-2"
                      style={{ color: "rgba(15,25,35,0.5)" }}
                    >
                      Project Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="font-sans text-sm w-full"
                      style={{ color: "#0F1923" }}
                    />
                    <p
                      className="font-sans text-xs mt-1"
                      style={{ color: "rgba(15,25,35,0.5)" }}
                    >
                      Max file size: 5MB
                    </p>
                  </div>

                  {screenshotPreview && (
                    <div
                      className="rounded-lg overflow-hidden"
                      style={{ border: "2px solid #0F1923" }}
                    >
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        className="w-full object-cover max-h-64"
                      />
                    </div>
                  )}

                  {uploadError && (
                    <p
                      className="font-sans text-xs font-bold"
                      style={{ color: "#FF5733" }}
                    >
                      {uploadError}
                    </p>
                  )}

                  <button
                    onClick={handleUploadScreenshot}
                    disabled={!screenshotFile || uploadLoading || uploadSuccess}
                    className="font-sans font-bold px-6 py-3 rounded-lg text-sm transition-all w-full"
                    style={{
                      background: uploadSuccess
                        ? "#00E5A0"
                        : uploadLoading || !screenshotFile
                          ? "#ccc"
                          : "#0F1923",
                      color: uploadSuccess
                        ? "#0F1923"
                        : uploadLoading || !screenshotFile
                          ? "#888"
                          : "#00E5A0",
                      cursor:
                        uploadLoading || uploadSuccess || !screenshotFile
                          ? "not-allowed"
                          : "pointer",
                      boxShadow:
                        uploadLoading || uploadSuccess || !screenshotFile
                          ? "none"
                          : "3px 3px 0px #FF5733",
                    }}
                  >
                    {uploadSuccess
                      ? "✓ Screenshot Uploaded!"
                      : uploadLoading
                        ? "Uploading to Hack Club CDN..."
                        : "Upload Screenshot"}
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div
              className="rounded-xl p-6 bg-white"
              style={{
                border: "2px solid #0F1923",
                boxShadow: "3px 3px 0px #0F1923",
              }}
            >
              <h2
                className="font-sans text-xl font-extrabold mb-3"
                style={{ color: "#0F1923" }}
              >
                Description
              </h2>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "#0F1923" }}
              >
                {project.description}
              </p>
            </div>

            {/* How to test */}
            {project.howToTest && (
              <div
                className="rounded-xl p-6 bg-white"
                style={{
                  border: "2px solid #0F1923",
                  boxShadow: "3px 3px 0px #0F1923",
                }}
              >
                <h2
                  className="font-sans text-xl font-extrabold mb-3"
                  style={{ color: "#0F1923" }}
                >
                  How to Test
                </h2>
                <p
                  className="font-sans text-sm leading-relaxed"
                  style={{ color: "#0F1923" }}
                >
                  {project.howToTest}
                </p>
              </div>
            )}

            {/* Log a session */}
            <div
              className="rounded-xl p-6 bg-white"
              style={{
                border: "2px solid #0F1923",
                boxShadow: "3px 3px 0px #0F1923",
              }}
            >
              <h2
                className="font-sans text-xl font-extrabold mb-5"
                style={{ color: "#0F1923" }}
              >
                Log a Work Session
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    className="font-sans text-xs font-bold uppercase tracking-widest block mb-2"
                    style={{ color: "rgba(15,25,35,0.5)" }}
                  >
                    Hours Spent
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={sessionHours}
                    onChange={(e) => setSessionHours(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full font-sans text-sm px-4 py-3 rounded-lg outline-none"
                    style={{
                      border: "2px solid #0F1923",
                      background: "#F5F0E8",
                      color: "#0F1923",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="font-sans text-xs font-bold uppercase tracking-widest block mb-2"
                    style={{ color: "rgba(15,25,35,0.5)" }}
                  >
                    What did you work on?
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="e.g. Built the Slack webhook integration and tested with 3 scenarios"
                    rows={3}
                    className="w-full font-sans text-sm px-4 py-3 rounded-lg outline-none resize-none"
                    style={{
                      border: "2px solid #0F1923",
                      background: "#F5F0E8",
                      color: "#0F1923",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="font-sans text-xs font-bold uppercase tracking-widest block mb-2"
                    style={{ color: "rgba(15,25,35,0.5)" }}
                  >
                    Lapse Session Link
                  </label>
                  <input
                    type="url"
                    value={sessionLapse}
                    onChange={(e) => setSessionLapse(e.target.value)}
                    placeholder="https://lapse.hackclub.com/..."
                    className="w-full font-sans text-sm px-4 py-3 rounded-lg outline-none"
                    style={{
                      border: "2px solid #0F1923",
                      background: "#F5F0E8",
                      color: "#0F1923",
                    }}
                  />
                </div>

                {sessionError && (
                  <p
                    className="font-sans text-xs font-bold"
                    style={{ color: "#FF5733" }}
                  >
                    {sessionError}
                  </p>
                )}

                <button
                  onClick={handleLogSession}
                  disabled={sessionLoading || sessionSuccess}
                  className="font-sans font-bold px-6 py-3 rounded-lg text-sm transition-all w-full"
                  style={{
                    background: sessionSuccess
                      ? "#00E5A0"
                      : sessionLoading
                        ? "#ccc"
                        : "#0F1923",
                    color: sessionSuccess
                      ? "#0F1923"
                      : sessionLoading
                        ? "#888"
                        : "#00E5A0",
                    cursor:
                      sessionLoading || sessionSuccess
                        ? "not-allowed"
                        : "pointer",
                    boxShadow:
                      sessionLoading || sessionSuccess
                        ? "none"
                        : "3px 3px 0px #FF5733",
                  }}
                >
                  {sessionSuccess
                    ? "✓ Session Logged!"
                    : sessionLoading
                      ? "Logging..."
                      : "Log Session"}
                </button>
              </div>
            </div>

            {/* Session history */}
            {sessions.length > 0 && (
              <div
                className="rounded-xl p-6 bg-white"
                style={{
                  border: "2px solid #0F1923",
                  boxShadow: "3px 3px 0px #0F1923",
                }}
              >
                <h2
                  className="font-sans text-xl font-extrabold mb-5"
                  style={{ color: "#0F1923" }}
                >
                  Work Sessions
                </h2>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-lg p-4"
                      style={{
                        background: "#F5F0E8",
                        border: "1px solid rgba(15,25,35,0.1)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="font-sans font-extrabold text-sm"
                          style={{ color: "#0F1923" }}
                        >
                          {session.hours}{" "}
                          {session.hours === 1 ? "hour" : "hours"}
                        </span>
                        {session.date && (
                          <span
                            className="font-sans text-xs"
                            style={{ color: "rgba(15,25,35,0.4)" }}
                          >
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {session.notes && (
                        <p
                          className="font-sans text-sm leading-relaxed mb-2"
                          style={{ color: "rgba(15,25,35,0.7)" }}
                        >
                          {session.notes}
                        </p>
                      )}
                      {session.lapseSession && (

                          href={session.lapseSession}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-xs font-bold underline"
                          style={{ color: "#0F1923" }}
                        >
                          View Lapse Session →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Stats */}
            <div
              className="rounded-xl p-5 bg-white"
              style={{
                border: "2px solid #0F1923",
                boxShadow: "3px 3px 0px #0F1923",
              }}
            >
              <h3
                className="font-sans font-extrabold text-sm uppercase tracking-widest mb-4"
                style={{ color: "rgba(15,25,35,0.45)" }}
              >
                Stats
              </h3>
              <div className="space-y-3">
                <div>
                  <p
                    className="font-sans text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: "rgba(15,25,35,0.45)" }}
                  >
                    Credits Awarded
                  </p>
                  <p
                    className="font-sans text-2xl font-extrabold"
                    style={{ color: "#00E5A0" }}
                  >
                    {project.creditsAwarded ?? (
                      <span style={{ color: "rgba(15,25,35,0.3)" }}>
                        Pending
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className="font-sans text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: "rgba(15,25,35,0.45)" }}
                  >
                    Total Hours
                  </p>
                  <p
                    className="font-sans text-2xl font-extrabold"
                    style={{ color: "#0F1923" }}
                  >
                    {totalHours > 0 ? (
                      totalHours
                    ) : (
                      <span style={{ color: "rgba(15,25,35,0.3)" }}>—</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Repo link */}
            {project.repoUrl && (

                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div
                  className="rounded-xl p-5 bg-white transition-all cursor-pointer"
                  style={{
                    border: "2px solid #0F1923",
                    boxShadow: "3px 3px 0px #0F1923",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.boxShadow =
                      "5px 5px 0px #0F1923")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.boxShadow =
                      "3px 3px 0px #0F1923")
                  }
                >
                  <h3
                    className="font-sans font-bold text-sm mb-1"
                    style={{ color: "#0F1923" }}
                  >
                    Repository
                  </h3>
                  <p
                    className="font-sans text-xs truncate"
                    style={{ color: "rgba(15,25,35,0.5)" }}
                  >
                    {project.repoUrl}
                  </p>
                </div>
              </a>
            )}

            {/* Status card */}
            <div className="rounded-xl p-5" style={{ background: "#0F1923" }}>
              <h3
                className="font-sans text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "rgba(245,240,232,0.5)" }}
              >
                Review Status
              </h3>
              <p
                className="font-sans font-extrabold text-lg"
                style={{ color: statusStyle.color }}
              >
                {project.status}
              </p>
              {project.status === "Unsubmitted" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Fill in the remaining details and submit when ready.
                </p>
              )}
              {project.status === "Pending Review" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Your project is in the queue. Hang tight!
                </p>
              )}
              {project.status === "Approved" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Your project has been approved and credits awarded.
                </p>
              )}
              {project.status === "Rejected" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Your project was not approved this time.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe for spinner inside delete button */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}