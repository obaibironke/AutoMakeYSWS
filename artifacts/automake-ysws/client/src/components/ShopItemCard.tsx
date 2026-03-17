import type { ShopItem } from "../data/shopItems";

interface ShopItemCardProps {
  item: ShopItem;
}

export default function ShopItemCard({ item }: ShopItemCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-6 flex flex-col transition-all duration-200"
      style={{ border: "2px solid #0F1923", boxShadow: "3px 3px 0px #0F1923" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "5px 5px 0px #0F1923")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "3px 3px 0px #0F1923")
      }
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="font-sans text-lg font-bold leading-tight flex-1"
          style={{ color: "#0F1923" }}
        >
          {item.name}
        </h3>
        <span
          className="font-sans text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{ background: "#00E5A0", color: "#0F1923" }}
        >
          {item.category}
        </span>
      </div>

      <p
        className="font-sans text-sm leading-relaxed flex-1 mb-6"
        style={{ color: "#0F1923" }}
      >
        {item.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          <span
            className="font-sans text-2xl font-bold"
            style={{ color: "#0F1923" }}
          >
            {item.cost.toLocaleString()} credits
          </span>
        </div>
        <button
          disabled
          className="font-sans text-sm font-semibold px-5 py-2.5 rounded-lg cursor-not-allowed"
          style={{
            background: "#ccc",
            color: "#888",
            border: "1px solid #bbb",
          }}
        >
          Locked
        </button>
      </div>
    </div>
  );
}
