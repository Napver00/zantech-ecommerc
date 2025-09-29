import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Calendar, ArrowLeft, User, Eye, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${config.baseURL}/posts/${id}`);
        if (!response.ok) {
          throw new Error('Post not found.');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setPost(data.data);
        } else {
          throw new Error(data.message || 'Could not retrieve the post.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <Skeleton className="h-8 w-32 mb-8 bg-gray-200" />
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
              <Skeleton className="h-12 w-full mb-6 bg-gray-200" />
              <div className="flex gap-2 mb-8">
                <Skeleton className="h-8 w-24 rounded-md bg-gray-200" />
                <Skeleton className="h-8 w-32 rounded-md bg-gray-200" />
                <Skeleton className="h-8 w-28 rounded-md bg-gray-200" />
              </div>
              <Skeleton className="h-96 w-full mb-8 rounded-lg bg-gray-200" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  const backLink = post.category?.toLowerCase().includes('tutorial') ? '/tutorials' : '/blog';
  const backText = post.category?.toLowerCase().includes('tutorial') ? 'Tutorials' : 'Blog';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Back Button */}
          <Link 
            to={backLink}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {backText}
          </Link>

          {/* Main Content Card */}
          <article className="bg-white rounded-lg shadow-sm">
            {/* Featured Image - Left Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-12">
              {/* Left Column - Image */}
              <div className="lg:col-span-1">
                {post.thumbnail_url && (
                  <img 
                    src={post.thumbnail_url} 
                    alt={post.title} 
                    className="w-full h-auto rounded-lg shadow-md sticky top-24"
                  />
                )}
              </div>

              {/* Right Column - Content */}
              <div className="lg:col-span-2">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  {post.title}
                </h1>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-md border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-200">
                  {post.author_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{post.author_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  {post.views !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} views</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:text-gray-700 prose-li:mb-2
                    prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3"
                  dangerouslySetInnerHTML={createMarkup(post.content || '')}
                />
              </div>
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-200 p-8 md:p-12 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Share this article</h3>
                  <p className="text-sm text-gray-600">Help others discover this content</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </article>

          {/* Back Button Bottom */}
          <div className="mt-8 text-center">
            <Link 
              to={backLink}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              View More {backText === 'Blog' ? 'Articles' : 'Tutorials'}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetails;