import { getProductsByCategory } from "@/lib/api";
import Link from "next/link";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

export default async function ProductCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }> | { page?: string };
}) {
  const { slug } = await params;
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const currentPage = Number(resolvedSearchParams.page ?? "1") || 1;
  const result = (await getProductsByCategory(slug, currentPage)) || {
    category: { name: "Category" },
    data: [],
    current_page: 1,
    last_page: 1,
  };

  const categoryName = result.category?.name || "Category";

  return (
    <main className="page-shell">
      <section className="content-card">
        <img
          src={DEFAULT_IMAGE}
          alt={categoryName}
          className="mb-6 block h-[220px] w-full rounded-2xl object-cover md:h-[280px]"
        />

        <h1 className="section-title">{categoryName} Products</h1>

        <div className="blog-grid">
          {result.data?.length ? (
            result.data.map((product: any) => (
              <article key={product.id} className="blog-card">
                <img
                  src={product.image || DEFAULT_IMAGE}
                  alt={product.title}
                  className="mb-4 block h-[180px] w-full rounded-xl object-cover"
                />
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p className="status-text font-bold text-slate-900">
                  ${Number(product.price || 0).toFixed(2)}
                </p>
                <p className="status-text">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-semibold text-blue-700 hover:text-blue-900"
                  >
                    View product →
                  </Link>
                </p>
              </article>
            ))
          ) : (
            <p className="status-text">
              No products available in {categoryName} yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
