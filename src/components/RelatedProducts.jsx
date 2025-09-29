import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { config } from "@/config";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const RelatedProducts = ({ categorySlug, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!categorySlug) {
      setLoading(false);
      return;
    }

    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${config.baseURL}/products/category/${categorySlug}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const related = json.data
            .filter((p) => p.id !== currentProductId)
            .map((p) => ({
              ...p,
              image:
                p.image ||
                p.image_path ||
                (Array.isArray(p.image_paths) && p.image_paths[0]) ||
                (Array.isArray(p.images) && p.images[0]?.path) ||
                "",
              discountedPrice: p.discountedPrice ?? p.discounted_price ?? p.price,
              discountPercentage:
                p.discountPercentage ?? p.discount_percentage ?? null,
            }));
          setProducts(related);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load related products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categorySlug, currentProductId]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 4 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 4 ? 0 : prevIndex + 1
    );
  };


  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        </div>
        {products.length > 4 && (
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
        >
          {products.map((p) => (
            <div key={p.id} className="w-1/4 flex-shrink-0 px-3">
                <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;