import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/StoreContext";
import { productImage } from "@/components/store/ProductCard";
import type { Product } from "@/types/store";
import { money } from "@/utils/store";
import { ProductDialog, blankProduct } from "@/components/admin/ProductDialog";
export const Route = createFileRoute("/admin_/products")({
  head: () => ({ meta: [{ title: "Products Manager — HOTSTAPLE" }] }),
  component: Products,
});
function Products() {
  const { products, saveProduct, deleteProduct } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const visible = products.filter((p) => `${p.brand} ${p.name} ${p.department}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminShell title="Products" description="Add, edit, merchandise, and remove products across all four departments.">
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} className="bg-background pl-9" placeholder="Search products" />
        </div>
        <Button onClick={() => setEditing(null)}><Plus /> Add product</Button>
      </div>
      <div className="mt-5 overflow-x-auto bg-background shadow-soft">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b bg-secondary"><tr>{["Image", "Product", "Department", "Category", "Price", "Stock", "Tags", "Actions"].map((x) => <th key={x} className="p-4 font-medium">{x}</th>)}</tr></thead>
          <tbody>{visible.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-4"><img src={productImage(p)} alt={p.name} className="size-12 rounded object-cover" /></td>
              <td className="p-4"><strong>{p.name}</strong><p className="text-xs text-muted-foreground">{p.brand}</p></td>
              <td className="p-4">{p.department}</td>
              <td className="p-4">{p.category}</td>
              <td className="p-4">{money(p.price)}</td>
              <td className="p-4">{p.stock}</td>
              <td className="p-4">{p.featured && <span className="status-badge mr-1">Featured</span>}{p.bestseller && <span className="status-badge">Bestseller</span>}</td>
              <td className="p-4">
                <Button variant="ghost" size="icon" onClick={() => setEditing(p)}><Pencil /></Button>
                <Button variant="ghost" size="icon" onClick={async () => { if (!confirm(`Delete ${p.name}?`)) return; try { await deleteProduct(p.id); toast.success("Product deleted"); } catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); } }}><Trash2 /></Button>
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <ProductDialog value={editing ?? blankProduct} open={editing !== undefined} close={() => setEditing(undefined)} save={async (p) => { try { await saveProduct(p); setEditing(undefined); toast.success("Product saved"); } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); } }} />
    </AdminShell>
  );
}
