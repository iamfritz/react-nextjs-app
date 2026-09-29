import Link from "next/link";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

type BlogCategory = {
  name?: string;
  slug?: string;
};

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  published_at: string;
  slug: string;
  photo?: string | null;
  category?: BlogCategory | null;
};

export function BlogGrid({
  posts,
  currentPage,
  lastPage,
  basePath,
  title,
  emptyMessage = "No posts available yet.",
}: {
  posts: BlogPost[];
  currentPage: number;
  lastPage: number;
  basePath: string;
  title: string;
  emptyMessage?: string;
}) {
  const buildPageUrl = (page: number) => {
    return page <= 1 ? basePath : `${basePath}?page=${page}`;
  };

  return (
    <section className="content-card">
      <img
        src={DEFAULT_IMAGE}
        alt={title}
        className="mb-6 block h-[220px] w-full rounded-2xl object-cover md:h-[280px]"
      />
      <h1 className="section-title">{title}</h1>

      <div className="blog-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="blog-card">
              <img
                src={post.photo || DEFAULT_IMAGE}
                alt={post.title}
                className="mb-4 block h-[180px] w-full rounded-xl object-cover"
              />
              {post.category?.name ? (
                <div>
                  <Link
                    href={`/category/${post.category.slug || post.category.name}`}
                    className="blog-category"
                  >
                    {post.category.name}
                  </Link>
                </div>
              ) : null}
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <p className="status-text">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-blue-700 hover:text-blue-900"
                >
                  Read article →
                </Link>
              </p>
            </article>
          ))
        ) : (
          <p className="status-text">{emptyMessage}</p>
        )}
      </div>

      {lastPage > 1 ? (
        <div className="pagination">
          <Link
            href={buildPageUrl(currentPage > 1 ? currentPage - 1 : 1)}
            className={`pagination-link ${currentPage === 1 ? "disabled" : ""}`}
            aria-disabled={currentPage === 1}
          >
            Prev
          </Link>

          {Array.from({ length: lastPage }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Link
                key={pageNumber}
                href={buildPageUrl(pageNumber)}
                className={`pagination-item ${
                  pageNumber === currentPage ? "active" : ""
                }`}
              >
                {pageNumber}
              </Link>
            ),
          )}

          <Link
            href={buildPageUrl(
              currentPage < lastPage ? currentPage + 1 : lastPage,
            )}
            className={`pagination-link ${
              currentPage === lastPage ? "disabled" : ""
            }`}
            aria-disabled={currentPage === lastPage}
          >
            Next
          </Link>
        </div>
      ) : null}
    </section>
  );
}
