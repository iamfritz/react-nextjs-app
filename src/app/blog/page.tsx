import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function getPosts() {
  try {
    const response = await fetch(`${apiUrl}/blog`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="page-shell">
      <nav className="top-nav">
        <div className="brand">Laravel AI</div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>

      <section className="content-card">
        <h1 className="section-title">Blog</h1>
        <div className="blog-grid">
          {posts.length > 0 ? (
            posts.map((post: { id: number; title: string; excerpt: string; published_at: string; slug: string }) => (
              <article key={post.id} className="blog-card">
                <time dateTime={post.published_at}>{post.published_at}</time>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <p className="status-text">
                  <Link href={`/blog/${post.slug}`}>Read article →</Link>
                </p>
              </article>
            ))
          ) : (
            <p className="status-text">No posts available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
