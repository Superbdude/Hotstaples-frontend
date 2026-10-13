import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Address, CartItem, Order, OrderStatus, Product } from "@/types/store";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
type StoreValue = {
  products: Product[]; cart: CartItem[]; wishlist: string[]; orders: Order[];
  recent: string[]; cartOpen: boolean; setCartOpen: (v: boolean) => void;
  addToCart: (id: string, size?: string, qty?: number) => void;
  updateCart: (id: string, size: string, qty: number) => void;
  removeFromCart: (id: string, size: string) => void;
  toggleWishlist: (id: string) => Promise<void>;
  markViewed: (id: string) => void;
  placeOrder: (address: Address) => Promise<Order>;
  initiatePayment: (address: Address) => Promise<{ accessCode: string; email: string; orderNumber: string }>;
  verifyPayment: (reference: string) => Promise<Order>;
  saveProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setStock: (id: string, stock: number) => Promise<void>;
  setOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  refresh: () => Promise<void>;
};
const C = createContext<StoreValue | undefined>(undefined);
const read = <T,>(key: string, fb: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fb; } catch { return fb; }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
};
export function StoreProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const refresh = async () => {
    try {
      const list = await api<Product[]>("/api/products");
      setProducts(Array.isArray(list) ? list : []);
    } catch { setProducts([]); }
    try {
      if (user) {
        const path = isAdmin ? "/api/orders" : "/api/orders/mine";
        const list = await api<Order[]>(path);
        setOrders(Array.isArray(list) ? list : []);
      } else { setOrders([]); }
    } catch { /* keep */ }
  };
  useEffect(() => { void refresh(); }, [user?.id, isAdmin]);
  useEffect(() => {
    setCart(read("hotstaple_cart", [] as CartItem[]));
    setWishlist(read("hotstaple_wishlist", [] as string[]));
    setRecent(read("hotstaple_recent", [] as string[]));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    write("hotstaple_cart", cart);
    write("hotstaple_recent", recent);
    if (!user) write("hotstaple_wishlist", wishlist);
  }, [hydrated, cart, recent, wishlist, user]);
  const addToCart = (id: string, size?: string, qty = 1) => {
    const selected = size ?? products.find((p) => p.id === id)?.sizes[0] ?? "One Size";
    setCart((c) => {
      const found = c.find((x) => x.productId === id && x.size === selected);
      if (found) return c.map((x) => (x === found ? { ...x, quantity: x.quantity + qty } : x));
      return [...c, { productId: id, size: selected, quantity: qty }];
    });
    setCartOpen(true);
  };
  const updateCart = (id: string, size: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((x) => !(x.productId === id && x.size === size)) : c.map((x) => (x.productId === id && x.size === size ? { ...x, quantity: qty } : x))));
  const removeFromCart = (id: string, size: string) => setCart((c) => c.filter((x) => !(x.productId === id && x.size === size)));
  const toggleWishlist = async (id: string) => {
    const next = wishlist.includes(id) ? wishlist.filter((x) => x !== id) : [...wishlist, id];
    setWishlist(next);
    if (user) { try { await api("/api/auth/me", { method: "PATCH", body: { wishlist: next } }); } catch { /* ignore */ } }
  };
  const markViewed = (id: string) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 6));
  const placeOrder = async (address: Address) => {
    const order = await api<Order>("/api/orders", { body: { address, items: cart } });
    setOrders((o) => [order, ...o]);
    setCart([]);
    write("hotstaple_latest_order", order.id);
    await refresh();
    return order;
  };
  const initiatePayment = async (address: Address) => {
    const res = await api<{ accessCode: string; email: string; orderNumber: string }>("/api/payments/initialize", { body: { address, items: cart } });
    return res;
  };
  const verifyPayment = async (reference: string) => {
    const order = await api<Order>("/api/payments/verify", { body: { reference } });
    setOrders((o) => [order, ...o.filter((x) => x.id !== order.id)]);
    setCart([]);
    write("hotstaple_latest_order", order.id);
    await refresh();
    return order;
  };
  const saveProduct = async (p: Product) => {
    const saved = await api<Product>("/api/products", { body: p });
    setProducts((ps) => (ps.some((x) => x.id === saved.id) ? ps.map((x) => (x.id === saved.id ? saved : x)) : [...ps, saved]));
  };
  const deleteProduct = async (id: string) => {
    await api(`/api/products/${id}`, { method: "DELETE" });
    setProducts((ps) => ps.filter((p) => p.id !== id));
  };
  const setStock = async (id: string, stock: number) => {
    const saved = await api<Product>(`/api/products/${id}/stock`, { method: "PATCH", body: { stock } });
    setProducts((ps) => ps.map((x) => (x.id === id ? saved : x)));
  };
  const setOrderStatus = async (id: string, status: OrderStatus) => {
    const saved = await api<Order>(`/api/orders/${id}/status`, { method: "PATCH", body: { status } });
    setOrders((os) => os.map((o) => (o.id === id ? saved : o)));
  };
  const value = useMemo(() => ({
    products, cart, wishlist, orders, recent, cartOpen, setCartOpen,
    addToCart, updateCart, removeFromCart, toggleWishlist, markViewed,
    placeOrder, initiatePayment, verifyPayment, saveProduct, deleteProduct, setStock, setOrderStatus, refresh,
  }), [products, cart, wishlist, orders, recent, cartOpen]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export function useStore() {
  const v = useContext(C);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}
