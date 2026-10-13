import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { useStore } from "@/context/StoreContext";
import { money } from "@/utils/store";
export const Route = createFileRoute("/admin_/analytics")({
  head: () => ({ meta: [{ title: "Analytics — HOTSTAPLE" }] }),
  component: Analytics,
});
function Analytics() {
  const { orders, products, wishlist } = useStore();
  const departments = ["Perfumes", "Clothing", "Bags", "Shoes"].map((name) => ({
    name,
    products: products.filter((p) => p.department === name).length,
    stock: products.filter((p) => p.department === name).reduce((s, p) => s + p.stock, 0),
    sales: orders.flatMap((o) => o.items).filter((i) => i.department === name).reduce((s, i) => s + i.price * i.quantity, 0),
  }));
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const average = orders.length ? revenue / orders.length : 0;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const hasSales = revenue > 0;
  const hasStock = products.length > 0;
  return (
    <AdminShell title="Analytics" description="Live performance derived from products, orders, and client activity.">
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart title="Sales by department">{hasSales ? <ResponsiveContainer><BarChart data={departments}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="sales" fill="var(--primary)" /></BarChart></ResponsiveContainer> : <Empty text="No sales yet." />}</Chart>
        <Chart title="Inventory by department">{hasStock ? <ResponsiveContainer><BarChart data={departments}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="stock" fill="var(--champagne)" /></BarChart></ResponsiveContainer> : <Empty text="No products yet — add some in Products." />}</Chart>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[["Revenue", money(revenue)], ["Average order", money(average)], ["Delivered", String(delivered)], ["Wishlist saves", String(wishlist.length)]].map(([a, b]) => (
          <div key={a} className="bg-background p-5"><p className="text-xs text-muted-foreground">{a}</p><p className="mt-2 font-display text-3xl">{b}</p></div>
        ))}
      </div>
    </AdminShell>
  );
}
function Chart({ title, children }: { title: string; children: ReactNode }) {
  return <div className="bg-background p-5"><h2 className="font-display text-2xl">{title}</h2><div className="mt-5 h-80">{children}</div></div>;
}
function Empty({ text }: { text: string }) {
  return <div className="grid h-full place-items-center p-8 text-center text-sm text-muted-foreground">{text}</div>;
}
