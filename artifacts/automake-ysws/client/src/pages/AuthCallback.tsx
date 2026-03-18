import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState("INITIALIZING_HANDSHAKE...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAuth = async () => {
      // 1. Get the code from the URL provided by Hack Club
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setError("NO_AUTH_CODE_FOUND");
        setTimeout(() => setLocation("/"), 2000);
        return;
      }

      try {
        setStatus("VERIFYING_CREDENTIALS...");

        // 2. Exchange code for User Data & Airtable sync
        // You will need to create this API route in your backend
        const response = await fetch("/api/verify-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("SYNC_COMPLETE...");
          // Store basic info in sessionStorage so the Shop knows who they are
          sessionStorage.setItem("slack_id", data.user.slack_id);
          sessionStorage.setItem("user_name", data.user.name);

          // 3. Redirect to Shop to show their "Level Up" progress
          setTimeout(() => setLocation("/shop"), 1000);
        } else {
          throw new Error(data.error || "AUTH_FAILED");
        }
      } catch (err: any) {
        setError(err.message);
        setTimeout(() => setLocation("/"), 3000);
      }
    };

    performAuth();
  }, [setLocation]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F1923] p-6">
      <div className="max-w-md w-full border-2 border-[#00E5A0] p-8 rounded-lg shadow-[4px_4px_0px_#00E5A0]">
        <h2 className="font-mono text-[#00E5A0] text-xl mb-4 font-bold uppercase tracking-tighter">
          {error ? ">> ERROR_DETECTED" : ">> SYSTEM_AUTH"}
        </h2>

        <p
          className="font-mono text-sm mb-6"
          style={{ color: error ? "#FF5733" : "rgba(0,229,160,0.7)" }}
        >
          {error ? `CAUSE: ${error}` : `STATUS: ${status}`}
        </p>

        {!error && (
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#00E5A0]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        )}

        {error && (
          <button
            onClick={() => setLocation("/")}
            className="mt-4 px-4 py-2 bg-[#FF5733] text-white font-bold text-xs uppercase"
          >
            Return_Home
          </button>
        )}
      </div>
    </div>
  );
}
