import { useEffect, useState } from "react";
import DashboardNav from "../components/DashboardNav";
import axios from "axios";

export default function Dashboard() {
  const [userName, setUserName] = useState(sessionStorage.getItem("user_name") || "User");
  const [credits, setCredits] = useState(Number(sessionStorage.getItem("credits") || 0));
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

      // keep sessionStorage updated
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
      // user not signed in — redirect
      window.location.href = "/auth";
      return;
    }

    // initial fetch
    fetchUserData();

    // poll every 30 seconds for updated credits
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <DashboardNav credits={credits} userName={userName} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="font-sans font-extrabold text-4xl mb-4">
          Hey, {userName.split(" ")[0] || "there"}
        </h1>
        <p className="font-sans mb-6">
          Here's your Automake dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl p-6" style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}>
            <p className="font-sans text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(15,25,35,0.45)" }}>
              Credits Earned
            </p>
            <p className="font-sans text-3xl font-extrabold" style={{ color: "#00E5A0" }}>
              {credits}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6" style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}>
            <p className="font-sans text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(15,25,35,0.45)" }}>
              Projects Submitted
            </p>
            <p className="font-sans text-3xl font-extrabold" style={{ color: "#FF5733" }}>
              0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}