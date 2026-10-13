import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { AuthGate } from "@/components/store/AuthGate";
import hero from "@/assets/hero-perfume.jpg";
import story from "@/assets/story-perfumes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "HOTSTAPLE — Curated Luxury Fashion & Fragrance" }] }),
  component: Home,
});
const cats = ["Perfumes", "Clothing", "Bags", "Shoes"];
function Home() {
  const { products } = useStore();
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center"><p className="font-display text-3xl tracking-[.08em]">HOTSTAPLE</p></div>;
  if (!user) return <AuthGate next="/" />;
  const featured = products.filter((p) => p.featured).slice(0, 4);
  return (
    <div>
      <section className="relative min-h-[calc(100svh-7rem)] overflow-hidden bg-secondary">
        <video src="/hotstaplesVideo.mp4" poster={hero} autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1440px] items-center px-6 pb-24 pt-16 sm:px-10 lg:px-12">
          <div className="max-w-2xl">
            <p className="eyebrow">THE SIGNATURE EDIT · 2026</p>
            <h1 className="mt-6 font-display text-5xl leading-[.96] sm:text-7xl lg:text-8xl">Pieces That Become Your Signature</h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-foreground/75 sm:text-lg">Exceptional perfume, clothing, bags and shoes — curated to make getting dressed feel deeply personal.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/shop" search={{ category: "", department: "" }}>Explore the collection <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/about">Our point of view</Link></Button>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="section">
        <div className="section-head"><div><p className="eyebrow">SHOP BY MOOD</p><h2>Your edit, your way</h2></div>
          <Button asChild variant="link"><Link to="/shop" search={{ category: "", department: "" }}>View all <ArrowRight /></Link></Button></div>
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {cats.map((c, i) => (
            <Link key={c} to="/shop" search={{ category: "", department: c }} className={`group grid aspect-[.85] place-items-end overflow-hidden p-5 text-center ${i % 2 ? "bg-blush" : "bg-secondary"}`}>
              <div><span className="font-display text-2xl">{c}</span><div className="mx-auto mt-3 h-px w-8 bg-primary transition-all group-hover:w-16" /></div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section pt-0">
        <div className="section-head"><div><p className="eyebrow">THE HOTSTAPLE EDIT</p><h2>Pieces worth remembering</h2></div></div>
        {featured.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-8">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : (
          <div className="bg-secondary p-12 text-center"><p className="font-display text-3xl">The edit is being curated</p><p className="mt-2 text-sm text-muted-foreground">New pieces added in the admin dashboard will appear here.</p></div>
        )}
      </section>
      <section className="grid bg-foreground text-background lg:grid-cols-2">
        <img src={story} alt="Curated fragrance collection" width={1408} height={1008} loading="lazy" className="h-full min-h-[420px] w-full object-cover" />
        <div className="flex items-center px-7 py-16 sm:px-14 lg:px-20"><div className="max-w-xl">
          <p className="eyebrow text-champagne">OUR CURATION</p>
          <h2 className="mt-5 font-display text-4xl sm:text-6xl">Chosen for character, never convention.</h2>
          <p className="mt-7 leading-7 text-background/70">Each piece earns its place through quality, point of view and the feeling it leaves behind.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">{["Authentic, sourced with care", "A personal, considered edit"].map((x) => <div key={x} className="flex items-center gap-3 text-sm"><Check className="size-4 text-champagne" />{x}</div>)}</div>
        </div></div>
      </section>
      <section className="bg-blush px-6 py-20 text-center">
        <p className="eyebrow">PRIVATE NOTES</p><h2 className="mt-4">Stay in the Edit</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">New arrivals, private edits and stories from the boutique, sent occasionally.</p>
        <form className="mx-auto mt-8 flex max-w-md border-b border-foreground" onSubmit={(e) => { e.preventDefault(); toast.success("Welcome to the private list"); }}>
          <input required type="email" placeholder="Email address" aria-label="Email address" className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-muted-foreground" />
          <Button type="submit" variant="ghost">Join <ArrowRight /></Button>
        </form>
      </section>
    </div>
  );
}