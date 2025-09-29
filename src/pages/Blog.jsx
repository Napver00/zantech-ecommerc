import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { config } from '../config';
import { Skeleton } from '../components/ui/skeleton';
import { AlertTriangle, BookOpen } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${config.baseURL}/posts/published?category=blog`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts.');
        }
        const data = await response.json();
        // The API response for a list seems to have `data` as an object, not an array.
        // This checks if data is an object and wraps it in an array if so.
        if (data.success) {
            const postData = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
            setPosts(postData);
        } else {
          throw new Error(data.message || 'Could not retrieve posts.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Insights, news, and stories from the ZanTech team.
            </p>
        </div>

        {loading && renderSkeletons()}

        {!loading && error && (
          <div className="text-center py-8 text-red-600">
            <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
            <p className="font-semibold">Error loading posts</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}

         {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold text-lg">No Blog Posts Found</p>
            <p>Please check back later for new articles.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

