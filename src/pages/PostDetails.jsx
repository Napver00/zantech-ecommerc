import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { config } from "@/config";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Calendar, ArrowLeft, User, Share2 } from "lucide-react";
import DOMPurify from "dompurify";
import Seo from "@/components/Seo";

const PostDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${config.baseURL}/posts/${slug}`);
        if (!response.ok) {
          throw new Error("Post not found.");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setPost(data.data);
        } else {
          throw new Error(data.message || "Could not retrieve the post.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const createMarkup = (htmlContent) => {
    // Configure DOMPurify to allow html/css and iframes
    const sanitized = DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ["iframe", "style", "link", "meta"],
      ADD_ATTR: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
        "width",
        "height",
        "src",
        "target",
        "class",
        "id",
        "style",
        "href",
        "rel",
      ],
    });
    return { __html: sanitized };
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this article: ${post.title}`,
      url: window.location.href,
    };

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard! ✓");
      })
      .catch(() => {
        alert("Failed to copy link");
      });
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
          <Skeleton className="w-full h-[60vh] bg-gray-200" />
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Skeleton className="h-12 w-3/4 mb-6 bg-gray-200" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-8 w-32 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-full bg-gray-200" />
              <Skeleton className="h-6 w-5/6 bg-gray-200" />
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
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg border-4 border-red-100">
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-4 font-sans">
              Oops! Post Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8 font-medium">{error}</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-200"
            >
              <ArrowLeft className="h-6 w-6" />
              Go Back to Fun Zone
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  // SEO helpers
  const siteUrl = "https://store.zantechbd.com";
  const postUrl = `${siteUrl}/postdetails/${slug}`;

  // Plain text excerpt from HTML content (for meta description)
  const getDescriptionFromHtml = (html, maxLength = 160) => {
    if (!html) return "";
    const text = html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const seoTitle = `${post.title} | Zantech Blog`;
  const seoDescription = getDescriptionFromHtml(
    post.content || post.excerpt || post.title
  );
  const seoImage = post.thumbnail_url
    ? post.thumbnail_url.startsWith("http")
      ? post.thumbnail_url
      : `${siteUrl}${post.thumbnail_url.startsWith("/") ? "" : "/"}${
          post.thumbnail_url
        }`
    : `${siteUrl}/zantech-logo.webp`;

  const seoKeywords = [
    post.category,
    ...(Array.isArray(post.tags) ? post.tags : []),
    "Zantech",
    "Blog",
    "Tutorial",
  ]
    .filter(Boolean)
    .join(", ");

  const backLink = post.category?.toLowerCase().includes("tutorial")
    ? "/tutorials"
    : "/blog";
  const backText = post.category?.toLowerCase().includes("tutorial")
    ? "Tutorials"
    : "Blog";

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/*  SEO for this article */}
      <Seo
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        url={postUrl}
        type="article"
        keywords={seoKeywords}
      />

      <Header />

      <main className="flex-grow">
        {/* Full Canvas Hero Section */}
        <div className="relative w-full min-h-[50vh] lg:h-[70vh] flex items-end">
          {/* Hero Background Image */}
          <div className="absolute inset-0">
            {post.thumbnail_url ? (
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500" />
            )}
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-4 pb-16 pt-32 max-w-6xl z-10">
            <div className="max-w-4xl">
              {/* Category Badge */}
              {post.category && (
                <span className="inline-block bg-yellow-400 text-yellow-900 text-sm md:text-base font-black px-4 py-2 rounded-full mb-6 uppercase tracking-wider shadow-lg transform -rotate-1">
                  {post.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                {post.title}
              </h1>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium text-lg">
                {post.author_name && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                    <User className="h-5 w-5" />
                    <span>{post.author_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative bg-white -mt-8 rounded-t-[2.5rem] z-20 px-4 py-16 md:py-24">
          {/* Back Button Floating */}
          <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center pointer-events-none">
            <Link
              to={backLink}
              className="pointer-events-auto bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 font-bold px-8 py-3 rounded-full shadow-xl flex items-center gap-2 transition-all hover:-translate-y-1 group border-2 border-blue-50"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Back to {backText}
            </Link>
          </div>

          <div className="container mx-auto max-w-4xl">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-600 text-lg font-bold px-6 py-2 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-100 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content Body - Kid Friendly Styling */}
            <div
              className="w-full max-w-none"
              dangerouslySetInnerHTML={createMarkup(post.content || "")}
            />
          </div>
        </div>

        {/* Fun Share Section */}
        <div className="bg-blue-600 py-20 px-4 text-center">
          <div className="container mx-auto max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-8">
              Liked this? Share with friends!
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-3 bg-white text-blue-600 hover:scale-105 active:scale-95 font-bold px-8 py-4 rounded-full transition-all shadow-xl"
              >
                <Share2 className="h-6 w-6" />
                Share Page
              </button>

              <button
                onClick={() => shareToSocial("facebook")}
                className="bg-[#1877F2] text-white p-4 rounded-full hover:scale-110 transition-transform shadow-lg border-4 border-blue-400/30"
                aria-label="Share on Facebook"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocial("whatsapp")}
                className="bg-[#25D366] text-white p-4 rounded-full hover:scale-110 transition-transform shadow-lg border-4 border-green-400/30"
                aria-label="Share on WhatsApp"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>

              <button
                onClick={copyToClipboard}
                className="bg-gray-800 text-white p-4 rounded-full hover:scale-110 transition-transform shadow-lg border-4 border-gray-600/30"
                aria-label="Copy Link"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetails;
