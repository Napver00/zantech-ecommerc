import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { config } from "@/config";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const RecentlyAdded = ({ limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchNew = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${config.baseURL}/products/new?limit=${limit}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const normalized = json.data.map((p) => ({
            ...p,
            image:
              p.image ||
              p.image_path ||
              (Array.isArray(p.image_paths) && p.image_paths[0]) ||
              "",
            discountedPrice: p.discountedPrice ?? p.discounted_price ?? p.price,
            discountPercentage:
              p.discountPercentage ?? p.discount_percentage ?? null,
            discount:
              p.discount ??
              (p.discountedPrice && p.discountedPrice < p.price
                ? Math.round(((p.price - p.discountedPrice) / p.price) * 100)
                : 0),
          }));
          if (mounted) setProducts(normalized);
        } else {
          throw new Error("Unexpected API response");
        }
      } catch (err) {
        console.error("Failed to load recently added products:", err);
        if (mounted) setError(err.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNew();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const LoadingSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 bg-gray-50 aspect-square flex items-center justify-center">
        <Skeleton className="h-40 w-40 rounded-lg" />
      </div>
      <div className="p-5">
        <Skeleton className="h-5 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="col-span-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to Load Products
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
          <Sparkles className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          No New Products Available
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Check back soon for the latest additions to our collection.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          Browse All Products
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Recently Added
                </h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Discover our latest products and newest arrivals
                </p>
              </div>
            </div>

            {!loading && !error && products.length > 0 && (
              <Link
                to="/shop"
                className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 group"
              >
                View All
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: limit }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))
          ) : error ? (
            <ErrorState />
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            products.map((product, index) => (
              <div key={product.id} className="relative group">
                {/* New Badge for first 3 products */}
                {index < 3 && (
                  <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    NEW
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        {/* View All Button - Mobile */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-10 text-center md:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}

        {/* Info Cards */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Fresh Arrivals
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Explore the newest additions to our product lineup with the
                    latest features and innovations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Trending Now
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Stay ahead with products that are making waves in the market
                    right now.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Quality Assured
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Every product is carefully selected to meet our high
                    standards of quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAdded;