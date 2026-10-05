import Link from "next/link";
import {
  getBlogPosts,
  getPageBySlug,
  getProducts,
  getSiteData,
} from "@/lib/api";
import { FeaturedProductSlider } from "@/components/FeaturedProductSlider";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

export default async function HomePage() {
  const page = await getPageBySlug("home");
  const site = await getSiteData();
  const productsResult = (await getProducts(1)) || { data: [] };
  const blogResult = (await getBlogPosts(1)) || { data: [] };
  const featuredProducts = (productsResult.data || []).slice(0, 6);
  const latestPosts = (blogResult.data || []).slice(0, 3);

  const features = site?.features || [
    "Fast Laravel backend services",
    "Modern Next.js frontend experience",
    "Reusable content and blog structure",
    "Clean architecture for product teams",
  ];
  const pageTitle =
    page?.meta_fields?.hero_title ||
    page?.title ||
    "Power your next product with Laravel and Next.js.";
  const pageContent =
    page?.content ||
    "<p>A simple setup for building content-driven websites, business apps, and API-first experiences.</p>";

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="mb-6">
          <img
            src={page?.photo || DEFAULT_IMAGE}
            alt={pageTitle}
            className="block h-[420px] w-full rounded-[18px] object-cover"
          />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Full-stack starter</p>
          <h1>{pageTitle}</h1>
          <div
            className="lead"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
          <div className="cta-row">
            <Link href="/products" className="primary-btn">
              View products
            </Link>
            <Link href="/blog" className="secondary-btn">
              View blog
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card">
            <span className="panel-label">Stack</span>
            <h3>Laravel API + Next.js UI</h3>
            <ul>
              {features.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Featured collection</p>
            <h2 className="section-title-sm">Featured products</h2>
          </div>
          <Link href="/products" className="text-link">
            View all products →
          </Link>
        </div>

        <FeaturedProductSlider products={featuredProducts} />
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Fresh ideas</p>
            <h2 className="section-title-sm">Latest blog</h2>
          </div>
          <Link href="/blog" className="text-link">
            Read all posts →
          </Link>
        </div>

        <div className="latest-grid">
          {latestPosts.length > 0 ? (
            latestPosts.map((post: any) => (
              <article key={post.id} className="listing-card">
                <img
                  src={post.photo || DEFAULT_IMAGE}
                  alt={post.title}
                  className="listing-image"
                />
                {post.category?.name ? (
                  <span className="listing-tag">{post.category.name}</span>
                ) : null}
                <div className="listing-body">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="listing-meta">
                    <time className="muted-date">
                      {post.published_at || "Recently"}
                    </time>
                    <Link href={`/blog/${post.slug}`} className="text-link">
                      Read article
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="status-text">No blog posts available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
