import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { name, price, image, discount, discountedPrice, discountPercentage, rating, reviews } = product;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const hasDiscount = Number(discount) > 0;
  const finalPrice = hasDiscount ? (discountedPrice ?? price) : price;
  const savings = hasDiscount ? price - finalPrice : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {discountPercentage ? `-${discountPercentage}%` : 'Sale'}
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
          isWishlisted 
            ? 'bg-red-100 text-red-600 shadow-lg' 
            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleQuickView}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {rating.toFixed(1)} {reviews && `(${reviews})`}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          <Link 
            to={`/product/${product.slug}`} 
            className="hover:text-blue-600 transition-colors"
            title={name}
          >
            {name}
          </Link>
        </h3>

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl font-bold text-gray-900">
              ৳{finalPrice.toLocaleString()}
            </span>
            
            {hasDiscount && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ৳{price.toLocaleString()}
                </span>
                {discountPercentage && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    Save {discountPercentage}%
                  </span>
                )}
              </>
            )}
          </div>
          
          {hasDiscount && savings > 0 && (
            <p className="text-xs text-green-600 font-medium">
              You save ৳{savings.toLocaleString()}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
          
          <Link
            to={`/product/${product.slug}`}
            className="px-4 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium rounded-xl transition-colors duration-200 text-sm"
          >
            Buy Now
          </Link>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="flex items-center justify-between text-xs">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500 ring-opacity-0 group-hover:ring-opacity-20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;