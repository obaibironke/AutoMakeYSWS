import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import axios from "axios";

const links = [
  { label: "Showcase", href: "/showcase" },
  { label: "Guides", href: "/guides" },
];

export default function DashboardNav() {
  const [location, setLocation] = useLocation();
  const [credits, setCredits] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      const slackId = sessionStorage.getItem("slack_id");
      if (!slackId) return;

      const res = await axios.get(`/api/getUser?slack_id=${slackId}`);
      const newCredits = res.data.user?.credits ?? 0;
      setCredits(newCredits);
      sessionStorage.setItem("credits", String(newCredits));
    } catch (err) {
      console.error("Failed to fetch credits:", err);
    }
  };

  useEffect(() => {
    const slackId = sessionStorage.getItem("slack_id");
    if (!slackId) {
      setLoading(false);
      return;
    }

    setUserName(sessionStorage.getItem("user_name") || "User");
    const initialCredits = Number(sessionStorage.getItem("credits")) || 0;
    setCredits(initialCredits);

    fetchCredits(); // initial fetch
    const interval = setInterval(fetchCredits, 30000); // every 30s
    setLoading(false);

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    sessionStorage.clear();
    setLocation("/");
  };

  if (loading) return null; // prevent rendering until we know user state

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm"
      style={{ background: "#0F1923", borderBottom: "1px solid rgba(0,229,160,0.15)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="font-sans text-2xl font-extrabold tracking-tight cursor-pointer" style={{ color: "#00E5A0" }}>
              Automake
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="font-sans text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: location === link.href ? "#00E5A0" : "#F5F0E8",
                    borderBottom: location === link.href ? "2px solid #00E5A0" : "none",
                    paddingBottom: location === link.href ? "2px" : undefined,
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Dashboard button */}
            <button
              onClick={() => setLocation("/dashboard")}
              className="font-sans text-sm font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
              style={{
                color: location === "/dashboard" ? "#00E5A0" : "#F5F0E8",
                borderBottom: location === "/dashboard" ? "2px solid #00E5A0" : "none",
                paddingBottom: location === "/dashboard" ? "2px" : undefined,
              }}
            >
              Dashboard
            </button>

            {/* Credits pill */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)" }}>
              <span className="font-sans text-xs font-bold" style={{ color: "#00E5A0" }}>
                {credits ?? 0} credits
              </span>
            </div>

            {/* User + sign out */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-sm font-semibold" style={{ color: "#F5F0E8" }}>
                {userName.split(" ")[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="font-sans text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: "rgba(255,87,51,0.15)",
                  color: "#FF5733",
                  border: "1px solid rgba(255,87,51,0.3)",
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}