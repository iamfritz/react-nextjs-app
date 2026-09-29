import { getPageBySlug } from "@/lib/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  return (
    <main className="page-shell">
      <section className="content-card">
        <img
          src={page?.photo || DEFAULT_IMAGE}
          alt={page?.title || "About"}
          className="mb-6 block h-[320px] w-full rounded-2xl object-cover"
        />
        <h1 className="section-title">{page?.title || "About"}</h1>
        <div
          className="copy-block"
          dangerouslySetInnerHTML={{
            __html:
              page?.content ||
              "<p>Laravel AI is a starter architecture for teams that want a clean split between a dependable backend and a polished frontend.</p>",
          }}
        />
      </section>
    </main>
  );
}
