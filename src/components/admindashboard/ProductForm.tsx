"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client/react";

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $description: String
    $price: Float
    $image: String
    $stock: Int
    $category: String
    $isNew: Boolean
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      image: $image
      stock: $stock
      category: $category
      isNew: $isNew
    ) {
      id
      name
      price
      stock
      category
      isNew
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: Float!
    $image: String
    $stock: Int!
    $category: String!
    $isNew: Boolean
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      image: $image
      stock: $stock
      category: $category
      isNew: $isNew
    ) {
      id
      name
      price
      stock
      category
      isNew
    }
  }
`;

type ProductFormProps = {
  productId?: string;

  initialData?: {
    name?: string;
    description?: string;
    price?: string;
    stock?: string;
    category?: string;
    image?: string;
    isNew?: boolean;
  };
  mode: "add" | "edit";
};

const CATEGORIES = [
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
  "Footwear",
  "Activewear",
];

const inputClass =
  "w-full px-4 py-3 text-sm font-['DM_Sans'] outline-none border transition-all";
const inputStyle = (extra = {}) => ({
  backgroundColor: "var(--bg-primary)",
  borderColor: "var(--border)",
  color: "var(--text-primary)",
  ...extra,
});
const labelClass =
  "text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans'] block mb-1.5";

export default function ProductForm({
  initialData = {},
  mode,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData.name ?? "",
    description: initialData.description ?? "",
    price: initialData.price ?? "",
    stock: initialData.stock ?? "",
    category: initialData.category ?? "",
    image: initialData.image ?? "",
    isNew: initialData.isNew ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: ["GetProducts"], // ✅ refresh list page
  });

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: ["GetProducts"],
  });

  const update = (key: string, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fanmid_products"); // your preset

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    console.log("CLOUDINARY RESPONSE:", data);
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (mode === "edit" && productId) {
        await updateProduct({
          variables: {
            id: productId,
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
            category: form.category,
            image: form.image,
            isNew: form.isNew,
          },
        });
      } else if (mode === "add") {
        await createProduct({
          variables: {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
            category: form.category,
            image: form.image,
            isNew: form.isNew,
          },
        });
      }

      setSaved(true);
      setTimeout(() => router.push("/admin/products"), 800);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-['DM_Sans'] hover:opacity-60 transition-opacity"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={12} /> Back to Products
      </Link>

      <div>
        <h2
          className="text-2xl font-black font-['Playfair_Display']"
          style={{ color: "var(--text-primary)" }}
        >
          {mode === "add" ? "Add New Product" : "Edit Product"}
        </h2>
        <p
          className="text-sm font-['DM_Sans'] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          {mode === "add"
            ? "Fill in the details to add a new product to the store."
            : "Update the product details below."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image preview */}
        <div
          className="border p-6"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <label className={labelClass} style={{ color: "var(--text-muted)" }}>
            Product Image URL
          </label>
          <div className="flex gap-4 items-start">
            <div
              className="w-24 h-28 flex-shrink-0 overflow-hidden border"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              {form.image ? (
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload size={20} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className={inputClass}
              style={inputStyle()}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setSaving(true);
                try {
                  const url = await uploadImage(file);
                  update("image", url); // ✅ store Cloudinary URL
                } catch (err) {
                  console.error("Upload failed:", err);
                } finally {
                  setSaving(false);
                }
              }}
            />
            {saving && <p>Uploading image...</p>}
          </div>
        </div>

        {/* Basic info */}
        <div
          className="border p-6 space-y-5"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <h3
            className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
            style={{ color: "var(--text-muted)" }}
          >
            Basic Information
          </h3>

          <div>
            <label
              className={labelClass}
              style={{ color: "var(--text-muted)" }}
            >
              Product Name *
            </label>
            <input
              required
              className={inputClass}
              style={inputStyle()}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Minimalist Leather Jacket"
            />
          </div>

          <div>
            <label
              className={labelClass}
              style={{ color: "var(--text-muted)" }}
            >
              Description *
            </label>
            <textarea
              required
              rows={4}
              className={inputClass}
              style={inputStyle({ resize: "none" })}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the product in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={labelClass}
                style={{ color: "var(--text-muted)" }}
              >
                Category *
              </label>
              <select
                required
                className={inputClass}
                style={inputStyle()}
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={labelClass}
                style={{ color: "var(--text-muted)" }}
              >
                Price (₦) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className={inputClass}
                style={inputStyle()}
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={labelClass}
                style={{ color: "var(--text-muted)" }}
              >
                Stock Quantity *
              </label>
              <input
                required
                type="number"
                min="0"
                className={inputClass}
                style={inputStyle()}
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => update("isNew", e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-10 h-5 rounded-full transition-colors"
                    style={{
                      backgroundColor: form.isNew
                        ? "var(--accent)"
                        : "var(--border)",
                    }}
                  >
                    <div
                      className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{
                        transform: form.isNew
                          ? "translateX(20px)"
                          : "translateX(0)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-sm font-['DM_Sans']"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Mark as New
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-3.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] border hover:opacity-70 transition-opacity"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || saved}
            className="flex items-center gap-2 px-8 py-3.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-all disabled:opacity-60"
            style={{
              backgroundColor: saved ? "#22c55e" : "var(--accent)",
              color: "#000",
            }}
          >
            <Save size={13} />
            {saved
              ? "Saved!"
              : saving
                ? "Saving..."
                : mode === "add"
                  ? "Add Product"
                  : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
