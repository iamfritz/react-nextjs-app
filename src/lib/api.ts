const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const FALLBACK_CATEGORIES = [
  { id: 1, name: "Office", slug: "office" },
  { id: 2, name: "Lifestyle", slug: "lifestyle" },
  { id: 3, name: "Electronics", slug: "electronics" },
  { id: 4, name: "Home", slug: "home" },
  { id: 5, name: "Accessories", slug: "accessories" },
];

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    slug: "ergonomic-office-chair",
    title: "Ergonomic Office Chair",
    description:
      "Supportive seating with lumbar adjustment and breathable mesh for all-day productivity.",
    price: 429,
    category: { id: 1, name: "Office", slug: "office" },
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    slug: "leather-travel-bag",
    title: "Leather Travel Bag",
    description:
      "A refined leather carry-all made for daily commuting, weekend escapes, and polished travel.",
    price: 265,
    category: { id: 2, name: "Lifestyle", slug: "lifestyle" },
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    slug: "4k-action-camera",
    title: "4K Action Camera",
    description:
      "Compact action camera with 4K stabilization, waterproof housing, and sharp motion capture.",
    price: 399.99,
    category: { id: 3, name: "Electronics", slug: "electronics" },
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    slug: "ceramic-coffee-set",
    title: "Ceramic Coffee Set",
    description:
      "Minimal ceramic coffee set for slow mornings, handcrafted detail, and elevated home rituals.",
    price: 74,
    category: { id: 4, name: "Home", slug: "home" },
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    slug: "solar-powered-backpack",
    title: "Solar Powered Backpack",
    description:
      "A weather-ready backpack with integrated solar charging for commuting and outdoor adventures.",
    price: 189,
    category: { id: 5, name: "Accessories", slug: "accessories" },
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    slug: "wireless-mechanical-keyboard",
    title: "Wireless Mechanical Keyboard",
    description:
      "Quiet mechanical keyboard with premium keys, low-latency wireless connectivity, and a compact layout.",
    price: 159.99,
    category: { id: 3, name: "Electronics", slug: "electronics" },
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
  },
];

const FALLBACK_BLOG_POSTS = [
  {
    id: 1,
    slug: "designing-better-workflows",
    title: "Designing better workflows",
    excerpt:
      "A practical approach to simplifying digital systems without sacrificing performance.",
    published_at: "2025-01-03T00:00:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    category: { id: 1, name: "Office", slug: "office" },
  },
  {
    id: 2,
    slug: "content-marketing-for-modern-products",
    title: "Content marketing for modern products",
    excerpt:
      "How teams can align product stories with the buying journey and build trust earlier.",
    published_at: "2025-01-10T00:00:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    category: { id: 2, name: "Lifestyle", slug: "lifestyle" },
  },
  {
    id: 3,
    slug: "why-product-ux-still-matters",
    title: "Why product UX still matters",
    excerpt:
      "The interface may be polished, but great experiences are built on clarity and momentum.",
    published_at: "2025-01-18T00:00:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    category: { id: 3, name: "Electronics", slug: "electronics" },
  },
  {
    id: 4,
    slug: "building-a-home-office-that-works",
    title: "Building a home office that works",
    excerpt:
      "Small upgrades can dramatically improve focus, comfort, and output across the week.",
    published_at: "2025-02-01T00:00:00.000Z",
    photo:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    category: { id: 4, name: "Home", slug: "home" },
  },
];

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

    const response = await fetch(url, {
      ...options,
      cache: options.cache ?? "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getSiteData() {
  return fetchApi<any>("/site");
}

export async function getPageBySlug(slug: string) {
  const page = await fetchApi<any>(`/pages/${slug}`);
  return page ?? { title: slug, content: "" };
}

export async function getCategories() {
  const categories = await fetchApi<any>(`/categories`);
  return categories && categories.length ? categories : FALLBACK_CATEGORIES;
}

export async function getBlogPosts(page = 1) {
  const response = await fetchApi<any>(`/blog?page=${page}`);

  if (!response || !Array.isArray(response.data)) {
    return {
      data: FALLBACK_BLOG_POSTS,
      current_page: page,
      last_page: 1,
    };
  }

  return {
    ...response,
    data: response.data.length ? response.data : FALLBACK_BLOG_POSTS,
    current_page: response.current_page ?? page,
    last_page: response.last_page ?? 1,
  };
}

export async function getCategoryPosts(slug: string, page = 1) {
  const response = await fetchApi<any>(`/categories/${slug}/blog?page=${page}`);

  if (!response || !Array.isArray(response.data)) {
    const category = FALLBACK_CATEGORIES.find((item) => item.slug === slug) ?? {
      name: "Category",
      slug,
    };

    return {
      category,
      data: FALLBACK_BLOG_POSTS.filter(
        (post) =>
          post.category?.slug === slug || post.category?.name === category.name,
      ),
      current_page: page,
      last_page: 1,
    };
  }

  return {
    ...response,
    data: response.data.length
      ? response.data
      : FALLBACK_BLOG_POSTS.filter((post) => post.category?.slug === slug),
    category:
      response.category ??
      FALLBACK_CATEGORIES.find((item) => item.slug === slug),
    current_page: response.current_page ?? page,
    last_page: response.last_page ?? 1,
  };
}

export async function getProducts(page = 1) {
  const response = await fetchApi<any>(`/products?page=${page}`);

  if (!response || !Array.isArray(response.data)) {
    return {
      data: FALLBACK_PRODUCTS,
      current_page: page,
      last_page: 1,
    };
  }

  return {
    ...response,
    data: response.data.length ? response.data : FALLBACK_PRODUCTS,
    current_page: response.current_page ?? page,
    last_page: response.last_page ?? 1,
  };
}

export async function getProductBySlug(slug: string) {
  const product = await fetchApi<any>(`/products/${slug}`);
  return (
    product ?? FALLBACK_PRODUCTS.find((item) => item.slug === slug) ?? null
  );
}

export async function getProductsByCategory(slug: string, page = 1) {
  const response = await fetchApi<any>(
    `/products/category/${slug}?page=${page}`,
  );

  if (!response || !Array.isArray(response.data)) {
    const category = FALLBACK_CATEGORIES.find((item) => item.slug === slug) ?? {
      name: "Category",
      slug,
    };

    return {
      category,
      data: FALLBACK_PRODUCTS.filter(
        (product) => product.category?.slug === slug,
      ),
      current_page: page,
      last_page: 1,
    };
  }

  return {
    ...response,
    data: response.data.length
      ? response.data
      : FALLBACK_PRODUCTS.filter((product) => product.category?.slug === slug),
    category:
      response.category ??
      FALLBACK_CATEGORIES.find((item) => item.slug === slug),
    current_page: response.current_page ?? page,
    last_page: response.last_page ?? 1,
  };
}

export async function getProductsByTag(tag: string, page = 1) {
  const response = await fetchApi<any>(
    `/products/tag/${encodeURIComponent(tag)}?page=${page}`,
  );

  if (!response || !Array.isArray(response.data)) {
    return {
      tag,
      data: FALLBACK_PRODUCTS.filter(
        (product) =>
          product.category?.slug?.toLowerCase() === tag.toLowerCase(),
      ),
      current_page: page,
      last_page: 1,
    };
  }

  return {
    ...response,
    data: response.data.length ? response.data : FALLBACK_PRODUCTS,
    current_page: response.current_page ?? page,
    last_page: response.last_page ?? 1,
  };
}

export async function getProductCategories() {
  const categories = await fetchApi<any>(`/product-categories`);
  return categories && categories.length ? categories : FALLBACK_CATEGORIES;
}

export async function getProductTags() {
  const tags = await fetchApi<any>(`/product-tags`);
  return tags && tags.length
    ? tags
    : ["featured", "office", "home", "electronics"];
}
