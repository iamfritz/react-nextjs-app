import Link from "next/link";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function getPost(slug: string) {
  try {
    const response = await fetch(`${apiUrl}/blog/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <main className="page-shell">
      <section className="content-card">
        {post ? (
          <>
            <img
              src={post.photo || DEFAULT_IMAGE}
              alt={post.title}
              style={{
                width: "100%",
                height: 320,
                objectFit: "cover",
                borderRadius: 16,
                display: "block",
                marginBottom: 24,
              }}
            />
            {post.category?.name ? (
              <div className="blog-categories">
                <div className="blog-category">{post.category.name}</div>
              </div>
            ) : null}

            <h1 className="section-title">{post.title}</h1>
            <p className="copy-block">{post.content}</p>
          </>
        ) : (
          <>
            <h1 className="section-title">Post not found</h1>
            <p className="copy-block">
              The requested blog post could not be loaded.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
