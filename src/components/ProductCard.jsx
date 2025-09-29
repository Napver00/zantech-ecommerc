import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Star, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const {
    name,
    price,
    image,
    discount,
    discountedPrice,
    discountPercentage,
    rating,
    reviews,
  } = product;
  const { addToCart } = useCart();
  const { user, addToWishlist, wishlist } = useAuth();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (wishlist.includes(product.id)) {
      setIsWishlisted(true);
    }
  }, [wishlist, product.id]);

  const hasDiscount = Number(discount) > 0;
  const finalPrice = hasDiscount ? discountedPrice ?? price : price;
  const savings = hasDiscount ? price - finalPrice : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    addToCart(product, 1);

    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // DON'T check for user here - let AuthContext handle it
    // This prevents duplicate error messages
    if (isWishlisted) {
      toast.info("Already in wishlist", {
        description: "This item is already in your wishlist",
        duration: 3000,
      });
      return;
    }

    // Call addToWishlist - it will show the toast if user is not logged in
    const result = await addToWishlist(product.id);
    if (result.success) {
      setIsWishlisted(true);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Coming soon", {
      description: "Quick view feature will be available soon",
      duration: 2000,
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {discountPercentage ? `-${discountPercentage}%` : "Sale"}
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
          isWishlisted
            ? "bg-red-100 text-red-600 shadow-lg scale-110"
            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-105"
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[5/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleQuickView}
              className="bg-white/95 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-xl"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        {rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {reviews && (
              <span className="text-xs text-gray-500">({reviews} reviews)</span>
            )}
          </div>
        )}

        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-3 min-h-[4.5rem]">
          <Link
            to={`/product/${product.slug}`}
            className="hover:text-blue-600 transition-colors"
            title={name}
          >
            {name}
          </Link>
        </h3>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-gray-900">
              ৳{finalPrice?.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-gray-500 line-through">
                  ৳{price?.toLocaleString()}
                </span>
                {savings > 0 && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Save ৳{savings.toLocaleString()}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {product.stock !== undefined && (
          <div className="flex items-center text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                Out of Stock
              </span>
            )}
          </div>
        )}

        <div className="space-y-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={
              isLoading || (product.stock !== undefined && product.stock === 0)
            }
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </button>

          <Link
            to={`/product/${product.slug}`}
            className="w-full block text-center border-2 border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm hover:shadow-md transform hover:scale-[1.02]"
          >
            View Details
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500 ring-opacity-0 group-hover:ring-opacity-20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
