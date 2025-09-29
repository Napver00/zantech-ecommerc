import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { config } from "@/config";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Sparkles,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  Zap,
  Star,
  Gift,
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
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-100 aspect-[5/4] flex items-center justify-center">
        <Skeleton className="h-32 w-32 rounded-lg" />
      </div>
      <div className="p-6">
        <Skeleton className="h-5 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="col-span-full">
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to Load New Products
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No New Products Yet
        </h3>
        <p className="text-gray-600 mb-6">
          New products will appear here as we add them to our collection!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
        >
          Browse All Products
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <section className="mt-16 mb-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Recently Added
              </h2>
              <p className="text-gray-600 mt-1">
                Fresh arrivals and latest additions to our collection
              </p>
            </div>
          </div>

          {/* View All Link */}
          {!loading && !error && products.length > 0 && (
            <Link
              to="/shop"
              className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 group"
            >
              Show All Products
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Just arrived</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>Latest technology</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span>Fresh inventory</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Be the first</span>
          </div>
        </div>
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
            <div key={product.id} className="relative">
              {/* New Badge for first few products */}
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center animate-pulse">
                  <Star className="h-3 w-3 mr-1" />
                  NEW
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      {/* New Arrivals Info */}
      {!loading && !error && products.length > 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-100">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-500 p-2 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Fresh Arrivals</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Get your hands on the newest products as soon as they arrive in
              our store.
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-100">
            <div className="flex items-center mb-6">
              <div className="bg-teal-500 p-2 rounded-lg mr-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Latest Technology</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Cutting-edge features and innovations to keep you ahead of the
              curve.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-100">
            <div className="flex items-center mb-4">
              <div className="bg-cyan-500 p-2 rounded-lg mr-3">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">First Access</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Be among the first to experience our newest products and
              innovations.
            </p>
          </div>
          <Link
            to="/shop"
            className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 group"
          >
            Show All Products
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default RecentlyAdded;
