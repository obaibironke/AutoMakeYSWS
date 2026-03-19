import { useEffect, useState } from "react";
import ShopItemCard from "../components/ShopItemCard";
import { shopItems } from "../data/shopItems";
import { useLocation } from "wouter";

const HACK_CLUB_AUTH_URL =
  "https://auth.hackclub.com/oauth/authorize?client_id=c89f85642fe94c65cbead982b0b7e9b8&redirect_uri=http://automake.dino.icu/auth&response_type=code&scope=profile%20email%20name%20slack_id%20verification_status";

export default function Shop() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slackId = sessionStorage.getItem("slack_id");

    if (!slackId) {
      window.location.href = HACK_CLUB_AUTH_URL;
      return;
    }

    setLoading(false);
  }, []);

  // 🚫 Block render until auth check finishes
  if (loading) return null;

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-16" style={{ background: "#F5F0E8" }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 text-center">
          <h1
            className="font-sans font-extrabold mb-4"
            style={{ color: "#0F1923", fontSize: "clamp(3rem, 6vw, 7rem)" }}
          >
            Shop
          </h1>

          <p
            className="font-sans max-w-3xl mx-auto"
            style={{ color: "#0F1923", fontSize: "clamp(1rem, 1.4vw, 1.5rem)" }}
          >
            Earn currency by submitting approved projects, then spend it here on
            tools, gadgets, and once-in-a-lifetime rewards.
          </p>

          <div
            className="mt-6 inline-flex items-center gap-2 bg-white rounded-xl px-6 py-4"
            style={{ border: "2px solid #0F1923" }}
          >
            <span
              className="font-sans font-bold"
              style={{
                color: "#0F1923",
                fontSize: "clamp(0.85rem, 1vw, 1.1rem)",
              }}
            >
              Submit an approved project to earn your first credits
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shopItems.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
