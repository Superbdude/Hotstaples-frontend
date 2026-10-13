const BASE = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5001";

type Options = {
  token?: string | null;
  method?: string;
  body?: unknown;
};

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = opts.token ?? (typeof window !== "undefined" ? localStorage.getItem("hotstaple_token") : null);
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || (opts.body !== undefined ? "POST" : "GET"),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || `Request failed (${res.status})`);
  return data as T;
}

export async function uploadFile<T>(path: string, file: File): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("hotstaple_token") : null;
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || `Upload failed (${res.status})`);
  return data as T;
}

export const API_BASE = BASE;
