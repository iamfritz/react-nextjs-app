import { getProductBySlug } from "@/lib/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <main className="page-shell">
        <section className="content-card">
          <h1 className="section-title">Product not found</h1>
          <p className="copy-block">
            The requested product could not be loaded.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="content-card">
        <img
          src={product.image || DEFAULT_IMAGE}
          alt={product.title}
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            borderRadius: 18,
            display: "block",
            marginBottom: 24,
          }}
        />

        {product.category?.name ? (
          <div className="blog-categories">
            <div className="blog-category">{product.category.name}</div>
          </div>
        ) : null}

        <h1 className="section-title">{product.title}</h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            SKU: {product.sku}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
            ${Number(product.price || 0).toFixed(2)}
          </span>
        </div>

        <p className="copy-block">{product.description}</p>

        {product.tags?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {product.custom_fields?.length ? (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Custom fields
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {product.custom_fields.map((field: any, index: number) => (
                <div
                  key={`${field.name || index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {field.name || `Field ${index + 1}`}
                  </div>
                  <div className="mt-2 text-slate-800">{field.value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {product.variations?.length ? (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Variations
            </h2>
            <div className="space-y-4">
              {product.variations.map((variation: any, index: number) => (
                <div
                  key={`${variation.name || index}`}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <strong className="text-lg text-slate-900">
                      {variation.name || `Variation ${index + 1}`}
                    </strong>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      $
                      {Number(variation.price || product.price || 0).toFixed(2)}
                    </span>
                  </div>
                  {variation.attributes ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                      {Object.entries(variation.attributes).map(
                        ([key, value]) => (
                          <span
                            key={key}
                            className="rounded-full bg-slate-100 px-2 py-1"
                          >
                            {key}: {String(value)}
                          </span>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
