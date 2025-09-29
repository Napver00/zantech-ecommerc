import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompletePackage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.baseURL}/products/category/starter-kit`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          if (mounted) setProducts(json.data);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (err) {
        console.error('Failed to load products for starter-kit:', err);
        if (mounted) setError(err.message || 'Failed to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { mounted = false; };
  }, []);

  const LoadingSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center">
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Starter Kits</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Starter Kits Available</h3>
        <p className="text-gray-600 mb-6">We're working on adding new starter kits. Check back soon!</p>
        <a 
          href="/shop" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          Browse All Products
          <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );

  return (
    <section className="mt-16">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Starter Kits</h2>
              <p className="text-gray-600 mt-1">Complete packages to kickstart your projects</p>
            </div>
          </div>
          
          {/* View All Link */}
          {!loading && !error && products.length > 0 && (
            <Link
              to="/shop?category_slug=starter-kit"
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Everything included</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Beginner friendly</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Step-by-step guides</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <LoadingSkeleton key={i} />
          ))
        ) : error ? (
          <ErrorState />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Bottom CTA */}
      {!loading && !error && products.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Ready to Start Building?</h3>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our starter kits include everything you need to get started with your next project. 
              Complete components, detailed instructions, and expert support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop?category_slug=starter-kit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Browse All Starter Kits
              </Link>
              <a 
                href="/contact"
                className="border-2 border-gray-300 hover:border-blue-300 bg-white text-gray-700 hover:text-blue-700 px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Need Help Choosing?
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompletePackage;