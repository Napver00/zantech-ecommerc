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
    // Configure DOMPurify to allow iframes from YouTube and other video platforms
    const sanitized = DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height', 'src']
    });
    return { __html: sanitized };
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this article: ${post.title}`,
      url: window.location.href
    };

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard! ✓');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <Skeleton className="h-8 w-32 mb-8 bg-gray-200" />
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <Skeleton className="h-12 w-full mb-6 bg-gray-200" />
              <div className="flex gap-2 mb-8">
                <Skeleton className="h-8 w-24 rounded-full bg-gray-200" />
                <Skeleton className="h-8 w-32 rounded-full bg-gray-200" />
                <Skeleton className="h-8 w-28 rounded-full bg-gray-200" />
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Back Button */}
          <Link 
            to={backLink}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-all hover:gap-3 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to {backText}
          </Link>

          {/* Main Content Card */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Featured Image - Left Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-12">
              {/* Left Column - Image */}
              <div className="lg:col-span-1">
                {post.thumbnail_url && (
                  <div className="relative group">
                    <img 
                      src={post.thumbnail_url} 
                      alt={post.title} 
                      className="w-full h-auto rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 sticky top-24"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
              </div>

              {/* Right Column - Content */}
              <div className="lg:col-span-2">
                {/* Category Badge */}
                {post.category && (
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                    {post.category}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  {post.title}
                </h1>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-200 hover:border-blue-300 transition-colors cursor-default shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b-2 border-gray-200">
                  {post.author_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{post.author_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-3
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:text-gray-700 prose-li:mb-2
                    prose-img:rounded-lg prose-img:shadow-md prose-img:my-6 prose-img:w-full
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                    prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-gray-800
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                    prose-hr:border-gray-300 prose-hr:my-8
                    [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:shadow-lg [&_iframe]:my-6"
                  dangerouslySetInnerHTML={createMarkup(post.content || '')}
                />
              </div>
            </div>

            {/* Share Section */}
            <div className="border-t border-gray-200 p-8 md:p-12 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="max-w-4xl mx-auto">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Share this article</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  
                  <button 
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#0d65d9] text-white font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  
                  <button 
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#0d8bd9] text-white font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </button>
                  
                  <button 
                    onClick={() => shareToSocial('linkedin')}
                    className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </button>
                  
                  <button 
                    onClick={() => shareToSocial('whatsapp')}
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </button>
                  
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Back Button Bottom */}
          <div className="mt-12 text-center">
            <Link 
              to={backLink}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-all hover:gap-3 group"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
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