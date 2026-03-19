import { useEffect, useState } from "react";
import ShopItemCard from "../components/ShopItemCard";
import { useLocation } from "wouter";
import DashboardNav from "../components/DashboardNav";

const HACK_CLUB_AUTH_URL =
  "https://auth.hackclub.com/oauth/authorize?client_id=c89f85642fe94c65cbead982b0b7e9b8&redirect_uri=http://automake.dino.icu/auth&response_type=code&scope=profile%20email%20name%20slack_id%20verification_status";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const [authLoading, setAuthLoading] = useState(true);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [credits, setCredits] = useState(
    Number(sessionStorage.getItem("credits")) || 0,
  );
  const [purchaseState, setPurchaseState] = useState<{
    itemId: string | null;
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ itemId: null, status: "idle", message: "" });

  useEffect(() => {
    const slackId = sessionStorage.getItem("slack_id");
    if (!slackId) {
      window.location.href = HACK_CLUB_AUTH_URL;
      return;
    }
    setAuthLoading(false);

    // Fetch shop items from Airtable via backend
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/getShopItems");
        const data = await res.json();
        if (data.items) setShopItems(data.items);
      } catch (err) {
        console.error("Failed to load shop items:", err);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handlePurchase = async (item: ShopItem) => {
    const slackId = sessionStorage.getItem("slack_id");
    if (!slackId) return;

    setPurchaseState({ itemId: item.id, status: "loading", message: "" });

    try {
      const res = await fetch("/api/purchaseItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slack_id: slackId, item_id: item.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data.error === "Insufficient credits"
            ? `You need ${data.required} credits but only have ${data.available}.`
            : data.error || "Purchase failed.";
        setPurchaseState({ itemId: item.id, status: "error", message: msg });
        setTimeout(
          () => setPurchaseState({ itemId: null, status: "idle", message: "" }),
          3000,
        );
        return;
      }

      // Update credits locally immediately
      setCredits(data.newBalance);
      sessionStorage.setItem("credits", String(data.newBalance));

      setPurchaseState({
        itemId: item.id,
        status: "success",
        message: "Item Unlocked!",
      });
      setTimeout(
        () => setPurchaseState({ itemId: null, status: "idle", message: "" }),
        3000,
      );
    } catch (err) {
      setPurchaseState({
        itemId: item.id,
        status: "error",
        message: "Something went wrong.",
      });
      setTimeout(
        () => setPurchaseState({ itemId: null, status: "idle", message: "" }),
        3000,
      );
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <DashboardNav />

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
              You have{" "}
              <span style={{ color: "#00E5A0" }}>{credits} credits</span> to
              spend
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          {itemsLoading ? (
            <div className="flex justify-center py-24">
              <div
                className="w-8 h-8 rounded-full border-4 animate-spin"
                style={{
                  borderColor: "#00E5A0",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shopItems.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  userCredits={credits}
                  purchaseState={
                    purchaseState.itemId === item.id
                      ? purchaseState
                      : { itemId: null, status: "idle", message: "" }
                  }
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
