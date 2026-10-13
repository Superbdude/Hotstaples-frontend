import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
export const Route = createFileRoute("/reset-password")({ component: Reset });
function Reset() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const { updatePassword, user } = useAuth();
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setBusy(true);
    try { await updatePassword(password); toast.success("Password updated"); await nav({ to: "/account" }); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Update failed"); }
    finally { setBusy(false); }
  };
  return (
    <div className="section max-w-lg">
      <p className="eyebrow">ACCOUNT RECOVERY</p>
      <h1 className="mt-3 font-display text-5xl">Choose a new password</h1>
      {!user && <p className="mt-4 text-sm text-muted-foreground">Please sign in first, then set a new password for this browser account.</p>}
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div><Label>New password</Label><Input type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" /></div>
        <div><Label>Confirm password</Label><Input type="password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-2" /></div>
        <Button className="w-full" disabled={busy || !user}>{busy ? "Updating…" : "Update password"}</Button>
      </form>
    </div>
  );
}
