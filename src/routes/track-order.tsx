import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { orderStatuses, money } from "@/utils/store";

export const Route = createFileRoute("/track-order")({
  validateSearch: (s: Record<string, unknown>) => ({ order: typeof s["order"] === "string" ? s["order"] : "" }),
  head: () => ({ meta: [
    { title: "Track Your Order — HOTSTAPLE" },
    { name: "description", content: "Track the progress of your HOTSTAPLE orders." },
    { property: "og:title", content: "Track Your Order — HOTSTAPLE" },
    { property: "og:description", content: "Follow your HOTSTAPLE orders." },
    { property: "og:type", content: "website" },
  ] }),
  component: Track,
});

function StatusTimeline({ status }: { status: string }) {
  const pos = orderStatuses.indexOf(status as (typeof orderStatuses)[number]);
  return (
    <div className="mt-6">
      {orderStatuses.map((s, i) => (
        <div key={s} className="grid grid-cols-[32px_1fr] gap-4">
          <div className="flex flex-col items-center">
            <div className={`grid size-8 place-items-center rounded-full border ${i <= pos ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>
              {i <= pos ? <Check className="size-4" /> : i + 1}
            </div>
            {i < orderStatuses.length - 1 && <div className={`h-10 w-px ${i < pos ? "bg-primary" : "bg-border"}`} />}
          </div>
          <div className="pt-1">
            <p className={i <= pos ? "font-medium" : "text-muted-foreground"}>{s}</p>
            {i === pos && <p className="mt-1 text-xs text-primary">Current status</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Track() {
  const { user, loading } = useAuth();
  const { orders } = useStore();
  const { order: highlight } = Route.useSearch();

  if (loading) return <div className="section text-center"><p className="eyebrow">LOADING YOUR ORDERS</p></div>;

  if (!user) {
    return (
      <div className="section max-w-2xl text-center">
        <PackageSearch className="mx-auto size-9 text-primary" />
        <p className="eyebrow mt-5">ORDER JOURNEY</p>
        <h1 className="mt-3 font-display text-5xl sm:text-7xl">Track your orders</h1>
        <p className="mt-4 text-muted-foreground">Sign in to see every order you've placed and its live status.</p>
        <Button asChild className="mt-7"><Link to="/login" search={{ next: "/track-order" }}>Sign in to track</Link></Button>
      </div>
    );
  }

  const sorted = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="section max-w-4xl">
      <div className="text-center">
        <PackageSearch className="mx-auto size-9 text-primary" />
        <p className="eyebrow mt-5">ORDER JOURNEY</p>
        <h1 className="mt-3 font-display text-5xl sm:text-7xl">Track your orders</h1>
        <p className="mt-4 text-muted-foreground">Here is every order on your account and its current status.</p>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-12 bg-secondary p-8 text-center">
          <h2 className="font-display text-3xl">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">Once you place an order it will appear here for tracking.</p>
          <Button asChild className="mt-6"><Link to="/shop" search={{ category: "", department: "" }}>Start shopping</Link></Button>
        </div>
      ) : (
        <div className="mt-12 space-y-6">
          {sorted.map((o) => (
            <div key={o.id} className={`border p-6 sm:p-8 ${highlight === o.id ? "border-primary" : "border-border"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-5">
                <div>
                  <p className="eyebrow">{o.id}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Placed {new Date(o.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <strong>{o.status}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{money(o.total)} · {o.items.length} {o.items.length === 1 ? "item" : "items"}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                {o.items.map((i) => (
                  <div key={`${i.productId}-${i.size}`} className="flex justify-between gap-4">
                    <span>{i.brand} · {i.name} × {i.quantity}</span>
                    <span>{money(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <StatusTimeline status={o.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
