import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';

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

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Best Selling</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-white border rounded-lg shadow-sm overflow-hidden text-center group">
              <div className="p-4 bg-gray-100 aspect-square flex items-center justify-center">
                <Skeleton className="h-28 w-28" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
};

export default BestSelling;
