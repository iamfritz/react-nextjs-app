const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

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
  return fetchApi<any>(`/pages/${slug}`);
}

export async function getBlogPosts(page = 1) {
  return fetchApi<any>(`/blog?page=${page}`);
}

export async function getCategoryPosts(slug: string, page = 1) {
  return fetchApi<any>(`/categories/${slug}/blog?page=${page}`);
}

export async function getProducts(page = 1) {
  return fetchApi<any>(`/products?page=${page}`);
}

export async function getProductBySlug(slug: string) {
  return fetchApi<any>(`/products/${slug}`);
}

export async function getProductsByCategory(slug: string, page = 1) {
  return fetchApi<any>(`/products/category/${slug}?page=${page}`);
}

export async function getProductsByTag(tag: string, page = 1) {
  return fetchApi<any>(`/products/tag/${encodeURIComponent(tag)}?page=${page}`);
}

export async function getProductCategories() {
  return fetchApi<any>(`/product-categories`);
}

export async function getProductTags() {
  return fetchApi<any>(`/product-tags`);
}
