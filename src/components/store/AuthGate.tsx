import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import loginVisual from "@/assets/story-perfumes.jpg";
export function safeNext(v: string) {
  return v.startsWith("/") && !v.startsWith("//") ? v : "/";
}
export function AuthGate({ next = "/" }: { next?: string }) {
  const nav = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      if (mode === "signup") { await signUp(email, password, name); toast.success("Account created"); }
      else { await signIn(email, password); toast.success("Welcome back"); }
      await nav({ to: safeNext(next) });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Unable to continue"); }
    finally { setBusy(false); }
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-14 sm:px-12">
        <div className="w-full max-w-md">
          <p className="font-display text-3xl font-semibold tracking-[.08em]">HOTSTAPLE</p>
          <p className="eyebrow mt-10">PRIVATE CLIENT ACCESS</p>
          <h1 className="mt-3 font-display text-5xl">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
          <form onSubmit={submit} className="mt-8 space-y-5">
            {mode === "signup" && (<div><Label htmlFor="name">Full name</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2" /></div>)}
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" /></div>
            <Button className="w-full" size="lg" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}</Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {mode === "signin" ? (<button onClick={() => setMode("signup")} className="underline">Create account</button>) : (<button onClick={() => setMode("signin")} className="underline">Back to sign in</button>)}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">Need help? <Link to="/contact" className="underline">Contact us</Link></p>
        </div>
      </div>
      <div className="relative min-h-56 overflow-hidden bg-foreground max-lg:order-first lg:min-h-0">
        <video src="/hotstaplesVideo.mp4" poster={loginVisual} autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-foreground/30" />
        <div className="absolute bottom-0 left-0 p-6 text-background sm:p-8 lg:p-12">
          <p className="eyebrow text-champagne">THE SIGNATURE EDIT · 2026</p>
          <p className="mt-3 max-w-sm font-display text-2xl leading-tight sm:text-3xl lg:mt-4 lg:text-4xl">Perfume, clothing, bags & shoes—curated to become your signature.</p>
        </div>
      </div>
    </div>
  );
}
