import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Department,
  Family,
  Gender,
  Product,
  ProductImage,
} from "@/types/store";
import { API_BASE, uploadFile } from "@/lib/api";
import { productImage } from "@/components/store/ProductCard";

const DEPARTMENTS: Department[] = ["Perfumes", "Clothing", "Bags", "Shoes"];
const GENDERS: Gender[] = ["Women", "Men", "Unisex"];
const FAMILIES: Family[] = ["Floral", "Woody", "Oriental", "Fresh", "Gourmand"];

// Fallback preset image chosen automatically per department.
const DEPT_IMAGE: Record<Department, ProductImage> = {
  Perfumes: "blush",
  Clothing: "clothing",
  Bags: "bag",
  Shoes: "shoe",
};

export const blankProduct: Product = {
  id: "",
  brand: "",
  name: "",
  description: "",
  price: 0,
  department: "Perfumes",
  category: "",
  gender: "Women",
  family: "Floral",
  material: "",
  rating: 0,
  reviews: 0,
  stock: 0,
  sizes: [],
  featured: false,
  bestseller: false,
  isNew: false,
  popularity: 0,
  image: "blush",
  imageUrl: "",
  notes: { top: [], heart: [], base: [] },
  longevity: "",
  sillage: "",
};

export function ProductDialog({
  value,
  open,
  close,
  save,
}: {
  value: Product;
  open: boolean;
  close: () => void;
  save: (p: Product) => void | Promise<void>;
}) {
  const [form, setForm] = useState<Product>(value);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Re-seed the form whenever a different product (or blank) is opened.
  useEffect(() => {
    setForm(value);
    setPreview(null);
    setUploading(false);
  }, [value]);

  const isNew = !form.id;
  const isPerfume = form.department === "Perfumes";

  function upd<K extends keyof Product>(key: K, val: Product[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // Resolve what to show in the preview box.
  const previewSrc =
    preview ||
    (form.imageUrl
      ? form.imageUrl.startsWith("http")
        ? form.imageUrl
        : `${API_BASE}${form.imageUrl}`
      : productImage(form.image));

  async function onPickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadFile<{ imageUrl: string }>(
        "/api/products/upload",
        file,
      );
      upd("imageUrl", res.imageUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage() {
    upd("imageUrl", "");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit() {
    if (!form.name.trim() || !form.brand.trim()) {
      toast.error("Name and brand are required");
      return;
    }
    const id =
      form.id ||
      `${form.brand}-${form.name}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const payload: Product = {
      ...form,
      id,
      image: form.image || DEPT_IMAGE[form.department],
    };
    setSaving(true);
    try {
      await save(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add product" : "Edit product"}</DialogTitle>
        </DialogHeader>

        {/* Image */}
        <div className="grid gap-2">
          <Label>Product image</Label>
          <div className="flex items-center gap-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded border bg-secondary">
              <img
                src={previewSrc}
                alt={form.name || "Preview"}
                className="size-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 grid place-content-center bg-background/70">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={onPickFile}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload /> {form.imageUrl ? "Replace" : "Upload image"}
                </Button>
                {form.imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={uploading}
                    onClick={removeImage}
                  >
                    <X /> Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or WebP · max 5MB. Shown across storefront, cart and
                checkout.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input value={form.name} onChange={(e) => upd("name", e.target.value)} />
          </Field>
          <Field label="Brand">
            <Input value={form.brand} onChange={(e) => upd("brand", e.target.value)} />
          </Field>

          <SelectField
            label="Department"
            value={form.department}
            onValueChange={(v) => {
              const dept = v as Department;
              setForm((f) => ({
                ...f,
                department: dept,
                image: f.image || DEPT_IMAGE[dept],
              }));
            }}
            options={DEPARTMENTS}
          />
          <Field label="Category">
            <Input value={form.category} onChange={(e) => upd("category", e.target.value)} placeholder="e.g. Eau de Parfum" />
          </Field>

          <SelectField
            label="Gender"
            value={form.gender}
            onValueChange={(v) => upd("gender", v as Gender)}
            options={GENDERS}
          />
          {isPerfume ? (
            <SelectField
              label="Fragrance family"
              value={form.family ?? "Floral"}
              onValueChange={(v) => upd("family", v as Family)}
              options={FAMILIES}
            />
          ) : (
            <Field label="Material">
              <Input value={form.material ?? ""} onChange={(e) => upd("material", e.target.value)} />
            </Field>
          )}

          <Field label="Price">
            <Input
              type="number"
              min={0}
              value={String(form.price)}
              onChange={(e) => upd("price", Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Stock">
            <Input
              type="number"
              min={0}
              value={String(form.stock)}
              onChange={(e) => upd("stock", Number(e.target.value) || 0)}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Sizes (comma separated)">
              <Input
                value={form.sizes.join(", ")}
                onChange={(e) =>
                  upd(
                    "sizes",
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="e.g. 30ml, 50ml, 100ml"
              />
            </Field>
          </div>

          {isPerfume && (
            <>
              <NotesField
                label="Top notes (comma separated)"
                value={form.notes?.top ?? []}
                onChange={(v) => upd("notes", { ...(form.notes ?? {}), top: v })}
              />
              <NotesField
                label="Heart notes (comma separated)"
                value={form.notes?.heart ?? []}
                onChange={(v) => upd("notes", { ...(form.notes ?? {}), heart: v })}
              />
              <NotesField
                label="Base notes (comma separated)"
                value={form.notes?.base ?? []}
                onChange={(v) => upd("notes", { ...(form.notes ?? {}), base: v })}
              />
              <Field label="Longevity">
                <Input value={form.longevity ?? ""} onChange={(e) => upd("longevity", e.target.value)} placeholder="e.g. 8+ hours" />
              </Field>
              <Field label="Sillage">
                <Input value={form.sillage ?? ""} onChange={(e) => upd("sillage", e.target.value)} placeholder="e.g. Moderate" />
              </Field>
            </>
          )}

          <div className="sm:col-span-2">
            <Field label="Description">
              <Input value={form.description} onChange={(e) => upd("description", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <Toggle label="Featured" checked={form.featured} onChange={(v) => upd("featured", v)} />
          <Toggle label="Bestseller" checked={form.bestseller} onChange={(v) => upd("bestseller", v)} />
          <Toggle label="New arrival" checked={form.isNew} onChange={(v) => upd("isNew", v)} />
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={close} type="button">
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={saving || uploading} type="button">
            {saving ? "Saving…" : "Save product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


/* ---------- Helpers (module scope = stable identity so inputs keep focus) ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function NotesField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <Field label={label}>
      <Input
        value={value.join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          )
        }
      />
    </Field>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(!!v)}
      />
      {label}
    </label>
  );
}
