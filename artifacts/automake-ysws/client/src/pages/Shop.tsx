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

  const filtered = active === "All" ? shopItems : shopItems.filter((i) => i.category === active);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero */}
      <section className="py-16" style={{ background: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-sans text-5xl font-extrabold mb-4" style={{ color: "#0F1923" }}>Shop</h1>
          <p className="font-sans text-lg max-w-2xl mx-auto" style={{ color: "#0F1923" }}>
            Earn currency by submitting approved projects, then spend it here on tools, gadgets, and once-in-a-lifetime rewards.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white rounded-xl px-5 py-3" style={{ border: "2px solid #0F1923" }}>
            <span className="font-sans text-sm font-bold" style={{ color: "#0F1923" }}>Submit an approved project to earn your first coins</span>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="font-sans text-sm font-bold px-5 py-2 rounded-full border-2 transition-all"
                style={
                  active === cat
                    ? { background: "#00E5A0", color: "#0F1923", borderColor: "#00E5A0" }
                    : { background: "transparent", color: "#0F1923", borderColor: "#0F1923" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
