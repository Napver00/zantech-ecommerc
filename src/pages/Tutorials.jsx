import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, GraduationCap } from 'lucide-react';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${config.baseURL}/tutorial`);
        if (!response.ok) {
          throw new Error('Failed to fetch tutorials.');
        }
        const data = await response.json();
        if (data.success) {
            const postData = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
            setTutorials(postData);
        } else {
          throw new Error(data.message || 'Could not retrieve tutorials.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
         <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tutorials</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Learn and build with our step-by-step guides.
            </p>
        </div>

        {loading && renderSkeletons()}

        {!loading && error && (
          <div className="text-center py-8 text-red-600">
            <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
            <p className="font-semibold">Error loading tutorials</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && tutorials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}

         {!loading && !error && tutorials.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold text-lg">No Tutorials Found</p>
            <p>We're creating new content. Please check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Tutorials;
