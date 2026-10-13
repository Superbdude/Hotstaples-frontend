import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/store/AuthGate";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ next: typeof s["next"] === "string" ? s["next"] : "/account" }),
  head: () => ({
    meta: [
      { title: "Sign In — HOTSTAPLE" },
      { name: "description", content: "Sign in or create your HOTSTAPLE account." },
      { property: "og:title", content: "Sign In — HOTSTAPLE" },
      { property: "og:description", content: "Access your HOTSTAPLE account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const { next } = Route.useSearch();
  return <AuthGate next={next} />;
}
