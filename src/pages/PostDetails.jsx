import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Calendar, Tag, ArrowLeft } from 'lucide-react';
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
       <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-80 w-full mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
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
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Link to="/blog" className="text-blue-600 hover:underline">Back to Blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link 
                    to={post.category === 'Blog' ? '/blog' : '/tutorials'} 
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to {post.category === 'Blog' ? 'Blog' : 'Tutorials'}
                </Link>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Published on {formatDate(post.created_at)}</span>
                    </div>
                    {post.tags && post.tags.length > 0 &&
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <span>{post.tags.join(', ')}</span>
                        </div>
                    }
                </div>
            </div>

            {post.thumbnail && (
                <img src={post.thumbnail} alt={post.title} className="w-full h-auto max-h-[450px] object-cover rounded-2xl shadow-lg mb-8" />
            )}

            <div 
                className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:text-gray-900"
                dangerouslySetInnerHTML={createMarkup(post.body || '')}
            >
            </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetails;
