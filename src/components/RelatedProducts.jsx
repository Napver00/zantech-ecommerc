import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Compass } from 'lucide-react';

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.baseURL}/products/category/${categoryId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        
        if (json.success && Array.isArray(json.data)) {
          // Filter out the current product and limit to 4 related products
          const related = json.data
            .filter(p => p.id !== currentProductId)
            .slice(0, 4);
          setProducts(related);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (err) {
        console.error('Failed to load related products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <Skeleton className="h-48 w-full bg-gray-200" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
            <Skeleton className="h-10 w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
        <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Products</h2>
            {renderSkeleton()}
        </section>
    );
  }

  if (error || products.length === 0) {
    // Don't show anything if there's an error or no related products
    return null;
  }

  return (
    <section className="mt-16">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <Compass className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default RelatedProducts;