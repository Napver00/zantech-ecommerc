import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link 
        to={`/post/${post.id}`} 
        className="group block bg-white rounded-xl shadow-md border border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="relative">
        <img 
            src={post.thumbnail} 
            alt={post.title} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {post.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {post.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
            </div>
             {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>{post.tags[0]}</span>
                </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
