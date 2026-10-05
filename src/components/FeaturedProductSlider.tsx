"use client";

import Link from "next/link";
import { useRef } from "react";

type Product = {
  id: number;
  slug?: string;
  title?: string;
  image?: string;
  description?: string;
  price?: number | string;
  category?: {
    name?: string;
  };
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

export function FeaturedProductSlider({ products }: { products: Product[] }) {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const amount = 320;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!products.length) {
    return <p className="status-text">No featured products yet.</p>;
  }

  return (
    <div className="featured-slider-wrap">
      <div ref={sliderRef} className="featured-slider">
        {products.map((product) => (
          <article key={product.id} className="listing-card featured-slide">
            <img
              src={product.image || DEFAULT_IMAGE}
              alt={product.title || "Product image"}
              className="listing-image"
            />
            {product.category?.name ? (
              <span className="listing-tag">{product.category.name}</span>
            ) : null}
            <div className="listing-body">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <div className="listing-meta">
                <span className="price-tag">
                  ${Number(product.price || 0).toFixed(2)}
                </span>
                <Link href={`/products/${product.slug}`} className="text-link">
                  Details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="featured-slider-nav">
        <button
          type="button"
          aria-label="Scroll featured products left"
          className="slider-arrow"
          onClick={() => scroll("left")}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Scroll featured products right"
          className="slider-arrow"
          onClick={() => scroll("right")}
        >
          →
        </button>
      </div>
    </div>
  );
}
