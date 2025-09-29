import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, Clock } from 'lucide-react';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Determine category color scheme
  const getCategoryStyle = (category) => {
    const lowerCategory = category?.toLowerCase() || '';
    if (lowerCategory.includes('tutorial')) {
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    }
    if (lowerCategory.includes('blog')) {
      return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
    return 'bg-gradient-to-r from-emerald-500 to-teal-500';
  };

  return (
    <Link 
      to={`/postdetails/${post.id}`} 
      className="group block bg-white rounded-2xl shadow-sm border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img 
            src={post.thumbnail || '/placeholder-post.jpg'} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 ${getCategoryStyle(post.category)} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}>
          {post.category}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
              <ArrowRight className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
              <Calendar className="h-3.5 w-3.5 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-xs font-medium">{formatDate(post.created_at)}</span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {post.tags[0]}
              </span>
            </div>
          )}
        </div>

        {/* Read Time (if available) */}
        {post.read_time && (
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.read_time} min read</span>
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </Link>
  );
};

export default PostCard;