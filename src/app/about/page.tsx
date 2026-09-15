import Link from "next/link";

export default function AboutPage() {
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
        <h1 className="section-title">About</h1>
        <p className="copy-block">
          Laravel AI is a starter architecture for teams that want a clean split between a dependable backend and a polished frontend.
          The Laravel API handles data, validation, and service logic, while Next.js brings the interface to life for end users.
        </p>
        <p className="copy-block" style={{ marginTop: 18 }}>
          This structure is ideal for content sites, SaaS products, and internal tools where speed, clarity, and maintainability matter.
        </p>
      </section>
    </main>
  );
}
