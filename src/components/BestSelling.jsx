import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const BestSelling = ({ limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchBest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.baseURL}/products/best-selling?limit=${limit}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // normalize product fields so ProductCard can rely on common names
          const normalized = json.data.map(p => ({
            ...p,
            image: p.image || p.image || p.image || '',
            discountedPrice: p.discountedPrice ?? p.discounted_price ?? p.price,
            discountPercentage: p.discountPercentage ?? p.discount_percentage ?? null,
            discount: p.discount ?? (p.discountedPrice && p.discountedPrice < p.price ? Math.round(((p.price - p.discountedPrice) / p.price) * 100) : 0),
          }));
          if (mounted) setProducts(normalized);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (err) {
        console.error('Failed to load best-selling products:', err);
        if (mounted) setError(err.message || 'Failed to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBest();
    return () => { mounted = false; };
  }, [limit]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: limit }).map((_, i) => (
        <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center">
            <Skeleton className="h-32 w-32 rounded-lg bg-gray-200" />
          </div>
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
            <div className="flex justify-center gap-2 pt-2">
              <Skeleton className="h-10 w-28 rounded-lg bg-gray-200" />
              <Skeleton className="h-10 w-28 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Best Selling</h2>
        </div>
        <p className="text-gray-600 ml-14">Our most popular products loved by customers</p>
      </div>

      {loading ? (
        renderSkeleton()
      ) : error ? (
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="inline-flex p-3 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <p className="text-xl font-semibold text-red-900 mb-2">Unable to load best sellers</p>
          <p className="text-red-700">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
          <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-6">
            <TrendingUp className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Available</h3>
          <p className="text-gray-600 text-lg">Check back soon for our best sellers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
};

export default BestSelling;