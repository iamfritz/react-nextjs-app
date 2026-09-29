import Link from "next/link";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="site-header">
        <div className="page-shell header-inner">
          <Link href="/" className="brand">
            Laravel AI
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            <Link href="/" className="transition hover:text-blue-700">
              Home
            </Link>
            <Link href="/about" className="transition hover:text-blue-700">
              About
            </Link>
            <Link href="/blog" className="transition hover:text-blue-700">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <div>{children}</div>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <div>
            <div className="brand">Laravel AI</div>
            <p>Build smarter digital experiences with Laravel and Next.js.</p>
          </div>

          <div className="footer-links">
            <Link href="/" className="transition hover:text-blue-700">
              Home
            </Link>
            <Link href="/about" className="transition hover:text-blue-700">
              About
            </Link>
            <Link href="/blog" className="transition hover:text-blue-700">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
