import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function getSiteData() {
  try {
    const response = await fetch(`${apiUrl}/site`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const site = await getSiteData();
  const features = site?.features || [
    "Fast Laravel backend services",
    "Modern Next.js frontend experience",
    "Reusable content and blog structure",
    "Clean architecture for product teams",
  ];
  const hero = site?.hero || {
    title: "Power your next product with Laravel and Next.js.",
    subtitle:
      "A simple setup for building content-driven websites, business apps, and API-first experiences.",
  };

  return (
    <main className="page-shell">
      <nav className="top-nav">
        <div className="brand">{site?.name || "Laravel AI"}</div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack starter</p>
          <h1>{hero.title}</h1>
          <p className="lead">{hero.subtitle}</p>
          <div className="cta-row">
            <Link href="/blog" className="primary-btn">View blog</Link>
            <Link href="/about" className="secondary-btn">Learn more</Link>
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
