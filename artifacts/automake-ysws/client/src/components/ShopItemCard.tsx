import type { ShopItem } from "../pages/Shop";

interface PurchaseState {
  itemId: string | null;
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

interface ShopItemCardProps {
  item: ShopItem;
  userCredits: number;
  purchaseState: PurchaseState;
  onPurchase: (item: ShopItem) => void;
}

export default function ShopItemCard({
  item,
  userCredits,
  purchaseState,
  onPurchase,
}: ShopItemCardProps) {
  const canAfford = userCredits >= item.cost;
  const isLoading = purchaseState.status === "loading";
  const isSuccess = purchaseState.status === "success";
  const isError = purchaseState.status === "error";

  const buttonStyle = isSuccess
    ? { background: "#00E5A0", color: "#0F1923", border: "none" }
    : isError
      ? {
          background: "rgba(255,87,51,0.15)",
          color: "#FF5733",
          border: "1px solid rgba(255,87,51,0.3)",
        }
      : canAfford
        ? { background: "#0F1923", color: "#00E5A0", border: "none" }
        : { background: "#ccc", color: "#888", border: "1px solid #bbb" };

  const buttonLabel = isLoading
    ? "Processing..."
    : isSuccess
      ? "✓ Unlocked!"
      : isError
        ? purchaseState.message
        : canAfford
          ? "Unlock"
          : "Locked";

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
      <div className="mb-3">
        <h3
          className="font-sans text-lg font-bold leading-tight"
          style={{ color: "#0F1923" }}
        >
          {item.name}
        </h3>
      </div>
      <p
        className="font-sans text-sm leading-relaxed flex-1 mb-6"
        style={{ color: "#0F1923" }}
      >
        {item.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span
          className="font-sans text-2xl font-bold"
          style={{ color: "#0F1923" }}
        >
          {item.cost.toLocaleString()} credits
        </span>
        <button
          disabled={!canAfford || isLoading || isSuccess}
          onClick={() => onPurchase(item)}
          className="font-sans text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
          style={{
            ...buttonStyle,
            cursor:
              canAfford && !isLoading && !isSuccess ? "pointer" : "not-allowed",
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
