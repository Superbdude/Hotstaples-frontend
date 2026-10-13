import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { useStore } from "@/context/StoreContext";
import { money } from "@/utils/store";
export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Overview — HOTSTAPLE" }] }),
  component: Admin,
});
function Admin() {
  const { orders, products } = useStore();
  const total = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status !== "Delivered").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const processing = orders.filter((o) => o.status === "Processing" || o.status === "Confirmed").length;
  const stats = [["Total sales", money(total)], ["Total orders", String(orders.length)], ["Pending", String(pending)], ["Delivered", String(delivered)], ["Products", String(products.length)]];
  const status = [{ name: "Delivered", value: delivered }, { name: "Processing", value: processing }, { name: "Pending", value: Math.max(0, pending - processing) }];
  const monthly = buildMonthly(orders);
  return (
    <AdminShell title="Overview" description="A current view of boutique performance and operations.">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{stats.map(([l, v]) => <div key={l} className="bg-background p-5 shadow-soft"><p className="text-xs text-muted-foreground">{l}</p><p className="mt-3 font-display text-3xl">{v}</p></div>)}</div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="bg-background p-5 shadow-soft"><h2 className="font-display text-2xl">Sales trend</h2><div className="mt-4 h-72">
          {monthly.some((m) => m.v > 0) ? (
            <ResponsiveContainer><AreaChart data={monthly}><defs><linearGradient id="sales" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity=".35" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Area dataKey="v" stroke="var(--primary)" fill="url(#sales)" /></AreaChart></ResponsiveContainer>
          ) : <EmptyChart text="No sales yet — revenue will chart here once orders arrive." />}
        </div></div>
        <div className="bg-background p-5 shadow-soft"><h2 className="font-display text-2xl">Order status</h2><div className="mt-4 h-72">
          {orders.length ? (
            <ResponsiveContainer><PieChart><Pie data={status} dataKey="value" innerRadius={60} outerRadius={95}>{status.map((_, i) => <Cell key={i} fill={["var(--primary)", "var(--champagne)", "var(--muted-foreground)"][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          ) : <EmptyChart text="No orders yet." />}
        </div></div>
      </div>
    </AdminShell>
  );
}
function buildMonthly(orders: { date: string; total: number }[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const out: { m: string; v: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const v = orders.filter((o) => { const od = new Date(o.date); return `${od.getFullYear()}-${od.getMonth()}` === key; }).reduce((s, o) => s + o.total, 0);
    out.push({ m: months[d.getMonth()] as string, v });
  }
  return out;
}
function EmptyChart({ text }: { text: string }) {
  return <div className="grid h-full place-items-center p-8 text-center text-sm text-muted-foreground">{text}</div>;
}
