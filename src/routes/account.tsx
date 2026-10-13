import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { money, safeRead } from "@/utils/store";
export const Route = createFileRoute("/account")({ component: Account });
function Account() {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const { orders, wishlist, recent, products } = useStore();
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<string[]>(() => safeRead("hotstaple_addresses", []));
  useEffect(() => { setFullName(profile?.full_name ?? ""); setPhone(profile?.phone ?? ""); }, [profile]);
  useEffect(() => { try { localStorage.setItem("hotstaple_addresses", JSON.stringify(addresses)); } catch {} }, [addresses]);
  if (loading) return <div className="section text-center"><p className="eyebrow">OPENING YOUR ACCOUNT</p></div>;
  if (!user) return <div className="section max-w-2xl text-center"><h1 className="font-display text-5xl">Your private collection awaits</h1><Button asChild className="mt-7"><Link to="/login" search={{ next: "/account" }}>Sign in</Link></Button></div>;
  const wished = products.filter((p) => wishlist.includes(p.id));
  const save = async () => { await updateProfile({ full_name: fullName, phone }); toast.success("Profile updated"); };
  return (
    <div className="section">
      <p className="eyebrow">WELCOME BACK</p>
      <h1 className="mt-3 font-display text-5xl">{profile?.full_name || "Your wardrobe"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      <h2 className="mt-10 font-display text-3xl">Orders ({orders.length})</h2>
      <div className="mt-4 space-y-3">{orders.map((o) => (<div key={o.id} className="flex justify-between border p-4"><span>{o.id} · {o.status}</span><strong>{money(o.total)}</strong></div>))}</div>
      <h2 className="mt-10 font-display text-3xl">Wishlist</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">{wished.map((p) => (<ProductCard key={p.id} product={p} />))}</div>
      <h2 className="mt-10 font-display text-3xl">Profile</h2>
      <div className="mt-4 grid max-w-xl gap-4"><div><Label>Full name</Label><Input className="mt-2" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div><div><Label>Phone</Label><Input className="mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} /></div><Button onClick={save}>Save profile</Button></div>
      <h2 className="mt-10 font-display text-3xl">Addresses</h2>
      <Button variant="outline" className="mt-3" onClick={() => setAddresses((a) => [...a, `${fullName || "Client"} · ${phone || "phone"} · ${new Date().toLocaleDateString()}`])}>Add address</Button>
      <div className="mt-3 space-y-2">{addresses.map((a, i) => (<p key={i} className="bg-secondary p-3 text-sm">{a}</p>))}</div>
      <p className="mt-6 text-xs text-muted-foreground">Recently viewed: {recent.length}</p>
      <Button variant="ghost" className="mt-4" onClick={async () => { await signOut(); await nav({ to: "/" }); }}>Sign out</Button>
    </div>
  );
}
