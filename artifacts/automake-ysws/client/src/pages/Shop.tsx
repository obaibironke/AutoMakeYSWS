import { useState } from "react";
import ShopItemCard from "../components/ShopItemCard";
import { shopItems } from "../data/shopItems";
import type { ShopItem } from "../data/shopItems";

const categories: (ShopItem["category"] | "All")[] = [
  "All",
  "Automation Tools",
  "Tech & Gadgets",
  "Fun & Quirky",
  "Learning",
  "Milestone Rewards",
];

export default function Shop() {
  const [active, setActive] = useState<ShopItem["category"] | "All">("All");
  const filtered =
    active === "All"
      ? shopItems
      : shopItems.filter((i) => i.category === active);

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

      {/* Filter + Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="font-sans font-bold rounded-full border-2 transition-all"
                style={{
                  fontSize: "clamp(0.8rem, 1vw, 1.1rem)",
                  padding: "clamp(6px, 0.6vw, 10px) clamp(16px, 1.5vw, 28px)",
                  ...(active === cat
                    ? {
                        background: "#00E5A0",
                        color: "#0F1923",
                        borderColor: "#00E5A0",
                      }
                    : {
                        background: "transparent",
                        color: "#0F1923",
                        borderColor: "#0F1923",
                      }),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
