const PAYSTACK_SDK = "https://js.paystack.co/v2/inline.js";
const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;

type PaystackCallbacks = {
  onSuccess?: (tx: { reference: string; id?: number; message?: string }) => void;
  onCancel?: () => void;
  onError?: (err: { message: string }) => void;
};

let loadPromise: Promise<void> | null = null;

/** Load the Paystack inline JS (v2) once. */
export function loadPaystack(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if ((window as unknown as { PaystackPop?: unknown }).PaystackPop) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PAYSTACK_SDK}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack")));
      return;
    }
    const script = document.createElement("script");
    script.src = PAYSTACK_SDK;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.head.appendChild(script);
  });
  return loadPromise;
}

type PaystackPopCtor = new () => {
  resumeTransaction: (accessCode: string, callbacks: PaystackCallbacks) => void;
};

/**
 * Resume a transaction created on the server using its access code.
 * Resolves with the transaction reference on success, an empty string if cancelled.
 */
export async function payWithPaystack(params: {
  accessCode: string;
  email: string;
  onClose?: () => void;
}): Promise<{ reference: string }> {
  await loadPaystack();
  const key = PUBLIC_KEY || "";
  if (!key) throw new Error("Missing VITE_PAYSTACK_PUBLIC_KEY in frontend .env");
  if (!params.accessCode) throw new Error("Missing payment access code.");

  return new Promise<{ reference: string }>((resolve, reject) => {
    const Pop = (window as unknown as { PaystackPop: PaystackPopCtor }).PaystackPop;
    const pop = new Pop();
    pop.resumeTransaction(params.accessCode, {
      onSuccess: (tx) => resolve({ reference: tx.reference }),
      onCancel: () => {
        params.onClose?.();
        resolve({ reference: "" });
      },
      onError: (err) => reject(new Error(err?.message || "Payment failed")),
    });
  });
}

