import { BlogGrid } from "@/components/BlogGrid";
import { getCategoryPosts } from "@/lib/api";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }> | { page?: string };
}) {
  const { slug } = await params;
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const currentPage = Number(resolvedSearchParams.page ?? "1") || 1;
  const result = (await getCategoryPosts(slug, currentPage)) || {
    category: { name: "Category" },
    data: [],
    current_page: 1,
    last_page: 1,
  };

  const categoryName = result.category?.name || "Category";

  return (
    <main className="page-shell">
      <BlogGrid
        posts={result.data || []}
        currentPage={currentPage}
        lastPage={result.last_page || 1}
        basePath={`/category/${slug}`}
        title={`Blog - ${categoryName}`}
        emptyMessage={`No posts available in ${categoryName} yet.`}
      />
    </main>
  );
}
