import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import DashboardNav from "../components/DashboardNav";
import { motion, AnimatePresence } from "framer-motion";

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
  ownerSlackId: string | null;
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
  Accepted: { bg: "rgba(0,229,160,0.15)", color: "#00A372" },
  Rejected: { bg: "rgba(255,87,51,0.15)", color: "#FF5733" },
};

function SubmitModal({
  onClose,
  onSubmit,
  loading,
  error,
}: {
  onClose: () => void;
  onSubmit: (
    repoUrl: string,
    howToTest: string,
    extraResources: string,
  ) => void;
  loading: boolean;
  error: string;
}) {
  const [repoUrl, setRepoUrl] = useState("");
  const [howToTest, setHowToTest] = useState("");
  const [extraResources, setExtraResources] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!repoUrl.trim()) {
      setValidationError("Please provide a GitHub repository URL.");
      return;
    }
    if (!howToTest.trim()) {
      setValidationError("Please describe how to test your workflow.");
      return;
    }
    setValidationError("");
    onSubmit(repoUrl, howToTest, extraResources);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(15,25,35,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl p-8 w-full max-w-lg"
        style={{
          border: "2px solid #0F1923",
          boxShadow: "6px 6px 0px #0F1923",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-sans text-2xl font-extrabold"
            style={{ color: "#0F1923" }}
          >
            Submit Project
          </h2>
          <button
            onClick={onClose}
            className="font-sans text-sm font-bold cursor-pointer"
            style={{ color: "rgba(15,25,35,0.4)" }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label
              className="font-sans text-xs font-bold uppercase tracking-widest block mb-2"
              style={{ color: "rgba(15,25,35,0.5)" }}
            >
              GitHub Repository URL <span style={{ color: "#FF5733" }}>*</span>
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/you/your-automation"
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
              How to Test Workflow <span style={{ color: "#FF5733" }}>*</span>
            </label>
            <textarea
              value={howToTest}
              onChange={(e) => setHowToTest(e.target.value)}
              placeholder="Describe how a reviewer can test your automation..."
              rows={4}
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
              Extra Resources Needed
              <span
                className="font-normal normal-case tracking-normal ml-2"
                style={{ color: "rgba(15,25,35,0.4)", fontSize: "0.7rem" }}
              >
                optional
              </span>
            </label>
            <textarea
              value={extraResources}
              onChange={(e) => setExtraResources(e.target.value)}
              placeholder="e.g. WhatsApp Business API Credits — needed to send messages via the WhatsApp node"
              rows={3}
              className="w-full font-sans text-sm px-4 py-3 rounded-lg outline-none resize-none"
              style={{
                border: "2px solid #0F1923",
                background: "#F5F0E8",
                color: "#0F1923",
              }}
            />
          </div>

          {(validationError || error) && (
            <p
              className="font-sans text-xs font-bold"
              style={{ color: "#FF5733" }}
            >
              {validationError || error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="font-sans font-bold px-5 py-3 rounded-lg text-sm cursor-pointer flex-1"
              style={{
                background: "white",
                color: "#0F1923",
                border: "2px solid #0F1923",
                boxShadow: "3px 3px 0px #0F1923",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="font-sans font-bold px-5 py-3 rounded-lg text-sm flex-1 transition-all"
              style={{
                background: loading ? "#ccc" : "#0F1923",
                color: loading ? "#888" : "#00E5A0",
                border: "none",
                boxShadow: loading ? "none" : "3px 3px 0px #FF5733",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit for Review →"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  // Check auth synchronously before first render — prevents any flash
  const currentSlackId = sessionStorage.getItem("slack_id");
  if (!currentSlackId) {
    window.location.href = HACK_CLUB_AUTH_URL;
    return null;
  }

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

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null,
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwner = !!(project && project.ownerSlackId === currentSlackId);

  const missingScreenshot = !project?.screenshot;
  const missingDescription = !project?.description?.trim();
  const missingSessions = sessions.length === 0;
  const canSubmit =
    !missingScreenshot && !missingDescription && !missingSessions;
  const missingItems = [
    missingScreenshot && "a project image",
    missingDescription && "a description",
    missingSessions && "at least one logged work session",
  ].filter(Boolean) as string[];

  useEffect(() => {
    const slackId = currentSlackId;

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
            data.sessions.reduce((sum: number, s: Session) => sum + s.hours, 0),
          );
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    };

    fetchProject();
    fetchSessions();
  }, [id]);

  const handleSubmitProject = async (
    repoUrl: string,
    howToTest: string,
    extraResources: string,
  ) => {
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/updateProject", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-slack-id": currentSlackId,
        },
        body: JSON.stringify({
          project_id: id,
          fields: {
            Status: "Pending Review",
            "Repo URL": repoUrl,
            "How to test?": howToTest,
            ...(extraResources.trim() && { "Extra Resources": extraResources }),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project");
      }
      setProject((prev) =>
        prev ? { ...prev, status: "Pending Review", repoUrl, howToTest } : null,
      );
      setSubmitSuccess(true);
      setShowSubmitModal(false);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit project.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

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
        headers: {
          "Content-Type": "application/json",
          "x-slack-id": currentSlackId,
        },
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
        headers: { "x-slack-id": currentSlackId },
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
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteScreenshot = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const response = await fetch("/api/deleteScreenshot", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-slack-id": currentSlackId,
        },
        body: JSON.stringify({ project_id: id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }
      setProject((prev) => (prev ? { ...prev, screenshot: null } : null));
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete image.",
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
      <DashboardNav />

      <AnimatePresence>
        {showSubmitModal && (
          <SubmitModal
            onClose={() => setShowSubmitModal(false)}
            onSubmit={handleSubmitProject}
            loading={submitLoading}
            error={submitError}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard">
          <span
            className="font-sans text-sm hover:underline cursor-pointer mb-8 inline-block"
            style={{ color: "#0F1923" }}
          >
            Back to Dashboard
          </span>
        </Link>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="font-sans text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {project.status}
            </span>
            {!isOwner && (
              <span
                className="font-sans text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(15,25,35,0.08)", color: "#6B7280" }}
              >
                View Only
              </span>
            )}
          </div>
          <h1
            className="font-sans text-4xl sm:text-5xl font-extrabold mb-2"
            style={{ color: "#0F1923" }}
          >
            {project.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "2px solid #0F1923" }}
            >
              {project.screenshot ? (
                <img
                  src={project.screenshot}
                  alt={project.name}
                  className="w-full object-cover"
                  style={{ display: "block" }}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-white">
                  <p
                    className="font-sans text-sm"
                    style={{ color: "rgba(15,25,35,0.4)" }}
                  >
                    No image provided
                  </p>
                </div>
              )}
            </div>

            {/* Upload / Delete Image — only for owner + Unsubmitted */}
            {isOwner && project.status === "Unsubmitted" && (
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
                  {project.screenshot ? "Update Image" : "Upload Image"}
                </h2>
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="font-sans font-bold px-6 py-4 rounded-lg text-base w-full flex items-center justify-center gap-3"
                    style={{
                      background: screenshotFile ? "#0F1923" : "#00E5A0",
                      color: screenshotFile ? "#00E5A0" : "#0F1923",
                      border: "2px solid #0F1923",
                      boxShadow: "3px 3px 0px #0F1923",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    {screenshotFile ? screenshotFile.name : "Choose Image"}
                  </button>
                  <p
                    className="font-sans text-xs text-center"
                    style={{ color: "rgba(15,25,35,0.5)" }}
                  >
                    Max file size: 5MB · PNG, JPG, GIF, WEBP
                  </p>
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
                      ? "✓ Image Uploaded!"
                      : uploadLoading
                        ? "Uploading..."
                        : "Upload Image"}
                  </button>
                  {project.screenshot && (
                    <div>
                      {deleteError && (
                        <p
                          className="font-sans text-xs font-bold mb-2"
                          style={{ color: "#FF5733" }}
                        >
                          {deleteError}
                        </p>
                      )}
                      <button
                        onClick={handleDeleteScreenshot}
                        disabled={deleteLoading || deleteSuccess}
                        className="font-sans font-bold px-6 py-3 rounded-lg text-sm transition-all w-full"
                        style={{
                          background: deleteSuccess
                            ? "#00E5A0"
                            : deleteLoading
                              ? "#ccc"
                              : "transparent",
                          color: deleteSuccess
                            ? "#0F1923"
                            : deleteLoading
                              ? "#888"
                              : "#FF5733",
                          cursor:
                            deleteLoading || deleteSuccess
                              ? "not-allowed"
                              : "pointer",
                          border: "2px solid",
                          borderColor: deleteSuccess
                            ? "#00E5A0"
                            : deleteLoading
                              ? "#ccc"
                              : "#FF5733",
                        }}
                      >
                        {deleteSuccess
                          ? "✓ Image Removed"
                          : deleteLoading
                            ? "Removing..."
                            : "Delete Image"}
                      </button>
                    </div>
                  )}
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

            {/* Log a session — only for owner */}
            {isOwner && (
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
            )}

            {/* Session history — visible to everyone */}
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
                        <p
                          className="font-sans text-xs font-bold"
                          style={{ color: "#0F1923" }}
                        >
                          Lapse:{" "}
                          <span
                            className="underline cursor-pointer"
                            onClick={() =>
                              window.open(session.lapseSession, "_blank")
                            }
                          >
                            View Session
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Submit button — only for owner + Unsubmitted */}
            {isOwner && project.status === "Unsubmitted" && (
              <div className="space-y-3">
                {!canSubmit && (
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(255,87,51,0.08)",
                      border: "1px solid rgba(255,87,51,0.2)",
                    }}
                  >
                    <p
                      className="font-sans text-xs font-bold mb-1"
                      style={{ color: "#FF5733" }}
                    >
                      Before submitting you need:
                    </p>
                    {missingItems.map((item) => (
                      <p
                        key={item}
                        className="font-sans text-xs"
                        style={{ color: "#FF5733" }}
                      >
                        · {item}
                      </p>
                    ))}
                  </div>
                )}
                {submitSuccess && (
                  <p
                    className="font-sans text-xs font-bold"
                    style={{ color: "#00A372" }}
                  >
                    ✓ Submitted for Review!
                  </p>
                )}
                <button
                  onClick={() => canSubmit && setShowSubmitModal(true)}
                  disabled={!canSubmit || submitSuccess}
                  className="font-sans font-bold px-6 py-4 rounded-lg text-base transition-all w-full"
                  style={{
                    background: submitSuccess
                      ? "#00E5A0"
                      : !canSubmit
                        ? "#ccc"
                        : "#0F1923",
                    color: submitSuccess
                      ? "#0F1923"
                      : !canSubmit
                        ? "#888"
                        : "#00E5A0",
                    cursor:
                      !canSubmit || submitSuccess ? "not-allowed" : "pointer",
                    boxShadow:
                      !canSubmit || submitSuccess
                        ? "none"
                        : "3px 3px 0px #FF5733",
                  }}
                >
                  {submitSuccess ? "✓ Submitted for Review!" : "Submit Project"}
                </button>
              </div>
            )}

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

            {project.repoUrl && (
              <div
                className="rounded-xl p-5 bg-white cursor-pointer transition-all"
                style={{
                  border: "2px solid #0F1923",
                  boxShadow: "3px 3px 0px #0F1923",
                }}
                onClick={() => window.open(project.repoUrl!, "_blank")}
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
            )}

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
                  Fill in the remaining details and submit when you're ready.
                </p>
              )}
              {project.status === "Pending Review" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Your project has been submitted and willbe reviewed soon.
                </p>
              )}
              {project.status === "Accepted" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Your project has been approved and the credits have been added
                  to your account.
                </p>
              )}
              {project.status === "Approved" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Your project has been approved and the credits have been added
                  to your account.
                </p>
              )}
              {project.status === "Rejected" && (
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  Your project was rejected. Make changes and resubmit when
                  you're ready.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
