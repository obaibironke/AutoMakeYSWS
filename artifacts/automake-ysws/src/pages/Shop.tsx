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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#D1DCCF] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-[#3B2F3E] mb-4">Shop</h1>
          <p className="font-sans text-lg text-[#424242] max-w-2xl mx-auto">
            Earn currency by submitting approved projects, then spend it here on tools, gadgets, and once-in-a-lifetime rewards.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white border border-[#D1DCCF] rounded-xl px-5 py-3 shadow-sm">
            <span className="text-xl">🪙</span>
            <span className="font-sans text-sm font-semibold text-[#3B2F3E]">Submit an approved project to earn your first coins</span>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-sans text-sm font-semibold px-5 py-2 rounded-full border transition-colors ${
                  active === cat
                    ? "bg-[#3B2F3E] text-white border-[#3B2F3E]"
                    : "bg-white text-[#424242] border-[#D1DCCF] hover:border-[#3B2F3E] hover:text-[#3B2F3E]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
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
