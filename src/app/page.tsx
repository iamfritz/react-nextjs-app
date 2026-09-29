import Link from "next/link";
import { getPageBySlug, getSiteData } from "@/lib/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

export default async function HomePage() {
  const page = await getPageBySlug("home");
  const site = await getSiteData();
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
            <Link href="/blog" className="primary-btn">
              View blog
            </Link>
            <Link href="/about" className="secondary-btn">
              Learn more
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
    </main>
  );
}
