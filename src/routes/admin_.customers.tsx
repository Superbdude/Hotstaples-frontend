import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { money } from "@/utils/store";
import { api } from "@/lib/api";
export const Route = createFileRoute("/admin_/customers")({ component: Customers });
type Row = { id: string; email: string; fullName: string; phone: string; orders: number; spent: number };
function Customers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api<Row[]>("/api/users").then(setRows).catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);
  const avg = rows.length ? rows.reduce((s, r) => s + r.spent, 0) / Math.max(1, rows.reduce((s, r) => s + r.orders, 0)) : 0;
  return (
    <AdminShell title="Customers" description="Registered accounts from MongoDB and their order value.">
      {error && <p className="mb-4 bg-destructive/10 p-3 text-sm text-destructive">{error} — is the backend running with MONGODB_URI set?</p>}
      <div className="grid gap-3 sm:grid-cols-3">
        {[["Client profiles", String(rows.length)], ["Orders", String(rows.reduce((s, r) => s + r.orders, 0))], ["Average order", money(avg)]].map(([l, v]) => (
          <div className="bg-background p-5" key={l}><p className="text-xs text-muted-foreground">{l}</p><p className="mt-2 font-display text-3xl">{v}</p></div>
        ))}
      </div>
      <div className="mt-5 overflow-x-auto bg-background">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-secondary"><tr><th className="p-4">Customer</th><th className="p-4">Email</th><th className="p-4">Orders</th><th className="p-4">Lifetime value</th></tr></thead>
          <tbody>{rows.map((c) => (<tr className="border-b" key={c.id}><td className="p-4 font-medium">{c.fullName || "New client"}</td><td className="p-4 text-muted-foreground">{c.email}</td><td className="p-4">{c.orders}</td><td className="p-4">{money(c.spent)}</td></tr>))}</tbody>
        </table>
        {!rows.length && !error && <p className="p-12 text-center text-muted-foreground">Registered customers will appear here.</p>}
      </div>
    </AdminShell>
  );
}
