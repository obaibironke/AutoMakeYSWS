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

const statusColors: Record<string, { bg: string; color: string }> = {
  "Pending Review": { bg: "rgba(255,193,7,0.15)", color: "#B8860B" },
  Approved: { bg: "rgba(0,229,160,0.15)", color: "#00A372" },
  Rejected: { bg: "rgba(255,87,51,0.15)", color: "#FF5733" },
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F0E8" }}>
        <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: "#00E5A0", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#F5F0E8" }}>
        <h1 className="font-sans text-3xl font-extrabold" style={{ color: "#0F1923" }}>Project not found</h1>
        <Link href="/dashboard">
          <span className="font-sans cursor-pointer underline" style={{ color: "#0F1923" }}>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const statusStyle = statusColors[project.status] ?? { bg: "rgba(15,25,35,0.1)", color: "#0F1923" };

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Link href="/dashboard">
          <span className="font-sans text-sm hover:underline cursor-pointer mb-8 inline-block" style={{ color: "#0F1923" }}>
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
          <h1 className="font-sans text-4xl sm:text-5xl font-extrabold mb-2" style={{ color: "#0F1923" }}>
            {project.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">

            {/* Screenshot */}
            <div className="rounded-xl overflow-hidden" style={{ border: "2px solid #0F1923" }}>
              {project.screenshot ? (
                <img src={project.screenshot} alt={project.name} className="w-full object-cover" />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-white">
                  <p className="font-sans text-sm" style={{ color: "rgba(15,25,35,0.4)" }}>No screenshot provided</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="rounded-xl p-6 bg-white" style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}>
              <h2 className="font-sans text-xl font-extrabold mb-3" style={{ color: "#0F1923" }}>Description</h2>
              <p className="font-sans text-sm leading-relaxed" style={{ color: "#0F1923" }}>{project.description}</p>
            </div>

            {/* How to test */}
            {project.howToTest && (
              <div className="rounded-xl p-6 bg-white" style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}>
                <h2 className="font-sans text-xl font-extrabold mb-3" style={{ color: "#0F1923" }}>How to Test</h2>
                <p className="font-sans text-sm leading-relaxed" style={{ color: "#0F1923" }}>{project.howToTest}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Stats */}
            <div className="rounded-xl p-5 bg-white" style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}>
              <h3 className="font-sans font-extrabold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(15,25,35,0.45)" }}>Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(15,25,35,0.45)" }}>Credits Awarded</p>
                  <p className="font-sans text-2xl font-extrabold" style={{ color: "#00E5A0" }}>
                    {project.creditsAwarded ?? <span style={{ color: "rgba(15,25,35,0.3)" }}>Pending</span>}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(15,25,35,0.45)" }}>Hours Logged</p>
                  <p className="font-sans text-2xl font-extrabold" style={{ color: "#0F1923" }}>
                    {project.hoursLogged ?? <span style={{ color: "rgba(15,25,35,0.3)" }}>—</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Repo link */}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div
                  className="rounded-xl p-5 bg-white transition-all cursor-pointer"
                  style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "5px 5px 0px #0F1923")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0px #0F1923")}
                >
                  <h3 className="font-sans font-bold text-sm mb-1" style={{ color: "#0F1923" }}>Repository</h3>
                  <p className="font-sans text-xs truncate" style={{ color: "rgba(15,25,35,0.5)" }}>{project.repoUrl}</p>
                </div>
              </a>
            )}

            {/* Status card */}
            <div className="rounded-xl p-5" style={{ background: "#0F1923" }}>
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(245,240,232,0.5)" }}>Review Status</h3>
              <p className="font-sans font-extrabold text-lg" style={{ color: statusStyle.color }}>{project.status}</p>
              {project.status === "Pending Review" && (
                <p className="font-sans text-xs mt-2" style={{ color: "rgba(245,240,232,0.5)" }}>Your project is in the queue. Hang tight!</p>
              )}
              {project.status === "Approved" && (
                <p className="font-sans text-xs mt-2" style={{ color: "rgba(245,240,232,0.5)" }}>Your project has been approved and credits awarded.</p>
              )}
              {project.status === "Rejected" && (
                <p className="font-sans text-xs mt-2" style={{ color: "rgba(245,240,232,0.5)" }}>Your project was not approved this time.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}