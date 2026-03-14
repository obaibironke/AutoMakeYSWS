import type { ShopItem } from "../data/shopItems";

const categoryColors: Record<ShopItem["category"], string> = {
  "Automation Tools": "bg-purple-100 text-purple-800",
  "Tech & Gadgets": "bg-blue-100 text-blue-800",
  "Fun & Quirky": "bg-pink-100 text-pink-800",
  "Learning": "bg-green-100 text-green-800",
  "Milestone Rewards": "bg-yellow-100 text-yellow-800",
};

interface ShopItemCardProps {
  item: ShopItem;
}

export default function ShopItemCard({ item }: ShopItemCardProps) {
  return (
    <div className="bg-white border border-[#D1DCCF] rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-lg font-bold text-[#3B2F3E] leading-tight flex-1">
          {item.name}
        </h3>
        <span
          className={`font-sans text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${categoryColors[item.category]}`}
        >
          {item.category}
        </span>
      </div>

      <p className="font-sans text-sm text-[#424242] leading-relaxed flex-1 mb-6">
        {item.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🪙</span>
          <span className="font-sans text-2xl font-bold text-[#3B2F3E]">{item.cost.toLocaleString()}</span>
        </div>
        <button
          disabled
          className="font-sans text-sm font-semibold bg-gray-100 text-gray-400 px-5 py-2.5 rounded-lg cursor-not-allowed border border-gray-200"
        >
          🔒 Locked
        </button>
      </div>
    </div>
  );
}
