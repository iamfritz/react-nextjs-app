import Link from "next/link";
import { getProducts } from "@/lib/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }> | { page?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const currentPage = Number(resolvedSearchParams.page ?? "1") || 1;
  const result = (await getProducts(currentPage)) || {
    data: [],
    current_page: 1,
    last_page: 1,
  };

  return (
    <main className="page-shell">
      <section className="content-card">
        <img
          src={DEFAULT_IMAGE}
          alt="Products"
          className="mb-6 block h-[220px] w-full rounded-2xl object-cover md:h-[280px]"
        />

        <h1 className="section-title">Products</h1>

        <div className="blog-grid">
          {result.data?.length ? (
            result.data.map((product: any) => (
              <article key={product.id} className="blog-card">
                <img
                  src={product.image || DEFAULT_IMAGE}
                  alt={product.title}
                  className="mb-4 block h-[180px] w-full rounded-xl object-cover"
                />

                {product.category?.name ? (
                  <Link
                    href={`/products/category/${product.category.slug || product.category.name}`}
                    className="blog-category"
                  >
                    {product.category.name}
                  </Link>
                ) : null}

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
            <p className="status-text">No products available yet.</p>
          )}
        </div>

        {result.last_page > 1 ? (
          <div className="pagination">
            <Link
              href={
                currentPage > 1
                  ? `/products?page=${currentPage - 1}`
                  : "/products"
              }
              className={`pagination-link ${currentPage === 1 ? "disabled" : ""}`}
              aria-disabled={currentPage === 1}
            >
              Prev
            </Link>

            {Array.from(
              { length: result.last_page },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/products?page=${pageNumber}`}
                className={`pagination-item ${pageNumber === currentPage ? "active" : ""}`}
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href={
                currentPage < result.last_page
                  ? `/products?page=${currentPage + 1}`
                  : `/products?page=${result.last_page}`
              }
              className={`pagination-link ${currentPage === result.last_page ? "disabled" : ""}`}
              aria-disabled={currentPage === result.last_page}
            >
              Next
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
