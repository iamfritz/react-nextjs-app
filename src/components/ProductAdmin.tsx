"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

type Product = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  sku: string;
  price: number | string;
  category_id?: number | null;
  tags: string[];
  custom_fields: Array<{ name: string; value: string }>;
  variations: Array<{
    name: string;
    price: number | string;
    attributes?: Record<string, string>;
  }>;
  status: "draft" | "published";
};

const emptyProduct: Product = {
  title: "",
  slug: "",
  description: "",
  image: "",
  sku: "",
  price: 0,
  category_id: null,
  tags: [],
  custom_fields: [{ name: "", value: "" }],
  variations: [{ name: "", price: 0, attributes: {} }],
  status: "draft",
};

export function ProductAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>(emptyProduct);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [role, setRole] = useState<"admin" | "editor">("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canManage = useMemo(
    () => role === "admin" || role === "editor",
    [role],
  );

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products-admin`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load products.");
    }
  }

  function updateField<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addCustomField() {
    setForm((current) => ({
      ...current,
      custom_fields: [
        ...(current.custom_fields || []),
        { name: "", value: "" },
      ],
    }));
  }

  function updateCustomField(
    index: number,
    field: "name" | "value",
    value: string,
  ) {
    setForm((current) => {
      const custom_fields = [...(current.custom_fields || [])];
      custom_fields[index] = { ...custom_fields[index], [field]: value };
      return { ...current, custom_fields };
    });
  }

  function addVariation() {
    setForm((current) => ({
      ...current,
      variations: [
        ...(current.variations || []),
        { name: "", price: 0, attributes: {} },
      ],
    }));
  }

  function updateVariation(
    index: number,
    field: "name" | "price",
    value: string | number,
  ) {
    setForm((current) => {
      const variations = [...(current.variations || [])];
      variations[index] = { ...variations[index], [field]: value };
      return { ...current, variations };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!canManage) {
      setError("Only admin or editor role can manage products.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      ...form,
      tags: (form.tags || []).filter(Boolean),
      custom_fields: (form.custom_fields || []).filter(
        (field) => field.name || field.value,
      ),
      variations: (form.variations || []).filter(
        (variation) => variation.name || variation.price,
      ),
      price: Number(form.price || 0),
    };

    try {
      const response = await fetch(
        editingId
          ? `${API_BASE_URL}/products-admin/${editingId}`
          : `${API_BASE_URL}/products-admin`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Product could not be saved.");
      }

      setForm(emptyProduct);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: number) {
    if (!id || !canManage) {
      setError("You do not have permission to delete products.");
      return;
    }

    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products-admin/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  function editProduct(product: Product) {
    setEditingId(product.id ?? null);
    setForm({
      ...product,
      tags: product.tags || [],
      custom_fields: product.custom_fields?.length
        ? product.custom_fields
        : [{ name: "", value: "" }],
      variations: product.variations?.length
        ? product.variations
        : [{ name: "", price: 0, attributes: {} }],
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="section-title">Product management</h1>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2">
          <label className="text-sm font-semibold text-slate-700">Role</label>
          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "admin" | "editor")
            }
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>
      </div>

      {!canManage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          This account does not have product management permission.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="content-card space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Title
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Slug
            <input
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Image URL
            <input
              value={form.image}
              onChange={(event) => updateField("image", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            SKU
            <input
              value={form.sku}
              onChange={(event) => updateField("sku", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Price
            <input
              type="number"
              min={0}
              step="0.01"
              value={Number(form.price || 0)}
              onChange={(event) =>
                updateField("price", Number(event.target.value))
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as "draft" | "published",
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Tags
          </label>
          <input
            value={(form.tags || []).join(", ")}
            onChange={(event) =>
              updateField(
                "tags",
                event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
            placeholder="summer, new, featured"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Custom fields
            </label>
            <button
              type="button"
              onClick={addCustomField}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
            >
              + Add field
            </button>
          </div>

          <div className="space-y-3">
            {(form.custom_fields || []).map((field, index) => (
              <div
                key={`field-${index}`}
                className="grid gap-3 md:grid-cols-[1fr_1.5fr]"
              >
                <input
                  value={field.name}
                  onChange={(event) =>
                    updateCustomField(index, "name", event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                  placeholder="Field name"
                />
                <input
                  value={field.value}
                  onChange={(event) =>
                    updateCustomField(index, "value", event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                  placeholder="Field value"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Variations
            </label>
            <button
              type="button"
              onClick={addVariation}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
            >
              + Add variation
            </button>
          </div>

          <div className="space-y-3">
            {(form.variations || []).map((variation, index) => (
              <div
                key={`variation-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={variation.name}
                    onChange={(event) =>
                      updateVariation(index, "name", event.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                    placeholder="Variation name"
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={Number(variation.price || 0)}
                    onChange={(event) =>
                      updateVariation(
                        index,
                        "price",
                        Number(event.target.value),
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                    placeholder="Variation price"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading || !canManage}
            className="primary-btn disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update product"
                : "Create product"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyProduct);
              }}
              className="secondary-btn"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <section className="content-card">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Current products
        </h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id || product.sku}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-600">{product.sku}</p>
                <p className="text-sm text-slate-600">
                  Status: {product.status}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editProduct(product)}
                  className="primary-btn"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="secondary-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
