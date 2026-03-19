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

        {/* Session history FIX */}
        {sessions.length > 0 && (
          <div>
            {sessions.map((session) => (
              <div key={session.id}>
                {session.lapseSession && (
                  <a
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
        )}
      </div>
    </div>
  );
}
