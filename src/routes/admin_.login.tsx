import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
export const Route = createFileRoute("/admin_/login")({ component: AdminLogin });
function AdminLogin() {
  const [email, setEmail] = useState("admin@hotstaple.local");
  const [password, setPassword] = useState("admin12345");
  const [busy, setBusy] = useState(false);
  const { signIn, isAdmin } = useAuth();
  const nav = useNavigate();
  return (
    <div className="grid min-h-screen place-items-center bg-admin px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault(); setBusy(true);
          try {
            await signIn(email, password);
            if (!isAdmin && email.toLowerCase() !== "admin@hotstaple.local") toast.error("This account is not an administrator");
            await nav({ to: "/admin" });
          } catch (err) { toast.error(err instanceof Error ? err.message : "Sign in failed"); setBusy(false); }
        }}
        className="w-full max-w-md bg-background p-8 shadow-soft"
      >
        <p className="eyebrow mt-2">SECURE ADMINISTRATION</p>
        <h1 className="mt-3 font-display text-5xl">Admin sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">Local demo: admin@hotstaple.local / admin12345</p>
        <div className="mt-8 space-y-5">
          <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" /></div>
          <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" /></div>
          <Button className="w-full" size="lg" disabled={busy}>{busy ? "Checking…" : "Sign in securely"}</Button>
        </div>
        <Button asChild variant="link" className="mt-4 w-full"><Link to="/">Return to boutique</Link></Button>
      </form>
    </div>
  );
}
