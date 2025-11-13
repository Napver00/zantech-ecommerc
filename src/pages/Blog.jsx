import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { config } from '../config';
import { Skeleton } from '../components/ui/skeleton';
import { AlertTriangle, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import Seo from '../components/Seo';

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
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <Skeleton className="h-56 w-full bg-gradient-to-br from-blue-50 to-indigo-100" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-5/6 bg-gray-200" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
              <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/*  SEO for Blog listing page */}
      <Seo
        title="Zantech Blog - Robotics, IoT & Electronics Articles in Bangladesh"
        description="Read articles from Zantech Store on robotics, Arduino, ESP32, IoT, electronics projects, STEM education and maker culture in Bangladesh."
        url="https://store.zantechbd.com/blog"
        type="article"
        keywords="Zantech blog, robotics blog Bangladesh, Arduino articles, ESP32 articles, IoT blog BD, electronics blog, STEM education Bangladesh"
      />

      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover insights, stories, and expert knowledge from the ZanTech team. Stay updated
            with the latest trends, tips, and industry news.
          </p>

          {/* Stats or Features */}
          {!loading && !error && posts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                  <p className="text-sm text-gray-600">Articles</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">Fresh</p>
                  <p className="text-sm text-gray-600">Content</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900">Regular</p>
                  <p className="text-sm text-gray-600">Updates</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && renderSkeletons()}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="inline-flex p-4 bg-red-100 rounded-full mb-6">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-3">Unable to Load Blog Posts</h3>
              <p className="text-red-700 text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
              <div className="inline-flex p-5 bg-white rounded-full shadow-sm mb-6">
                <BookOpen className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Blog Posts Yet</h3>
              <p className="text-gray-600 text-lg mb-8">
                We're working on creating amazing content for you. Check back soon for insightful
                articles and updates!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Browse Our Shop
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
