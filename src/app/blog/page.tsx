import Link from "next/link";
import { BlogGrid } from "@/components/BlogGrid";
import { getBlogPosts, getCategories, getCategoryPosts } from "@/lib/api";

export default async function BlogPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ page?: string; category?: string }>
    | { page?: string; category?: string };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const currentPage = Number(resolvedSearchParams.page ?? "1") || 1;
  const selectedCategory = resolvedSearchParams.category ?? "";
  const categories = (await getCategories()) || [];
  const result =
    selectedCategory && selectedCategory !== "all"
      ? (await getCategoryPosts(selectedCategory, currentPage)) || {
          category: { name: "Category" },
          data: [],
          current_page: 1,
          last_page: 1,
        }
      : (await getBlogPosts(currentPage)) || {
          data: [],
          current_page: 1,
          last_page: 1,
        };

  return (
    <main className="page-shell">
      <section className="content-card">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className={`blog-category ${!selectedCategory || selectedCategory === "all" ? "active" : ""}`}
          >
            All
          </Link>
          {(categories || []).map((category: any) => {
            const slug = category.slug || category.name;
            const isActive = selectedCategory === slug;

            return (
              <Link
                key={slug}
                href={`/blog?category=${encodeURIComponent(slug)}`}
                className={`blog-category ${isActive ? "active" : ""}`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        <BlogGrid
          posts={result.data || []}
          currentPage={currentPage}
          lastPage={result.last_page || 1}
          basePath={
            selectedCategory
              ? `/blog?category=${encodeURIComponent(selectedCategory)}`
              : "/blog"
          }
          title={
            selectedCategory &&
            selectedCategory !== "all" &&
            result.category?.name
              ? `${result.category.name} Blog`
              : "Blog"
          }
          emptyMessage={
            selectedCategory && selectedCategory !== "all"
              ? `No posts available in ${result.category?.name || "this category"} yet.`
              : "No posts available yet."
          }
        />
      </section>
    </main>
  );
}
