import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Facebook,
  MessageSquare,
  Linkedin,
  Link as LinkIcon,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  ExternalLink,
  Minus,
  Plus,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { config } from "@/config";
import DOMPurify from "dompurify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import RelatedProducts from "@/components/RelatedProducts"; // Import the new component

const Gallery = ({ images = [], alt = "" }) => {
  const imgs = Array.isArray(images)
    ? images.map((i) => (i?.path ? i.path : i))
    : [];
  const [index, setIndex] = useState(imgs.length ? 0 : -1);

  useEffect(() => {
    setIndex(imgs.length ? 0 : -1);
  }, [images, imgs.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight")
        setIndex((i) => (i < imgs.length - 1 ? i + 1 : i));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgs.length]);

  if (!imgs.length)
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No Image Available</p>
        </div>
      </div>
    );

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : i));
  const next = () => setIndex((i) => (i < imgs.length - 1 ? i + 1 : i));

  return (
    <div className="space-y-4">
      <div className="relative bg-white border-2 border-gray-100 rounded-2xl overflow-hidden group">
        <div className="aspect-square flex items-center justify-center p-8">
          <img
            src={imgs[index]}
            alt={alt}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={index === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              disabled={index === imgs.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {imgs.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                idx === index
                  ? "bg-blue-600 w-6"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {imgs.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`aspect-square p-2 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              idx === index
                ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={src}
              alt={`${alt}-${idx}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const StarRating = ({ rating, totalReviews = 0 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">{stars}</div>
      <span className="text-sm font-medium text-gray-900">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
    </div>
  );
};

const QuantitySelector = ({ max = 1, value = 1, onChange }) => {
  const [qty, setQty] = useState(value);
  useEffect(() => setQty(value), [value]);

  const inc = () => {
    setQty((q) => {
      const v = Math.min(q + 1, max);
      onChange?.(v);
      return v;
    });
  };

  const dec = () => {
    setQty((q) => {
      const v = Math.max(1, q - 1);
      onChange?.(v);
      return v;
    });
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={dec}
        disabled={qty <= 1}
        className="px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="px-6 py-2 bg-gray-50 font-medium min-w-[60px] text-center">
        {qty}
      </span>
      <button
        onClick={inc}
        disabled={qty >= max}
        className="px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

const BundleItems = ({ bundleItems }) => {
  if (!bundleItems || bundleItems.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-lg">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bundle Includes</h2>
          <p className="text-gray-600">Click on any item to view its details</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bundleItems.map((item) => (
          <a
            key={item.item_id}
            href={`/product/${item.slug}`}
            className="group relative bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
          >
            {item.bundle_quantity > 1 && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-10">
                {item.bundle_quantity}
              </div>
            )}
            
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center p-2">
              <img
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.discountedPrice ? (
                    <>
                      <span className="text-sm font-bold text-gray-900">
                        ৳{item.discountedPrice}
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        ৳{item.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">
                      ৳{item.price}
                    </span>
                  )}
                </div>
                
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              
              {item.discountPercentage && (
                <div className="flex items-center">
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    -{item.discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-emerald-900">Bundle Benefits:</span>
        </div>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• All components work together seamlessly</li>
          <li>• Carefully selected for optimal compatibility</li>
          <li>• Great value compared to buying items separately</li>
          <li>• Perfect for getting started with your project</li>
        </ul>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.baseURL}/products/slug/${slug}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && json.data) {
          const p = json.data;
          const normalized = {
            ...p,
            image:
              p.image ||
              p.image_path ||
              (Array.isArray(p.image_paths) && p.image_paths[0]) ||
              (Array.isArray(p.images) && p.images[0]?.path) ||
              "",
            description: p.description || "",
            discountedPrice: p.discountedPrice ?? p.discounted_price ?? p.price,
            discountPercentage:
              p.discountPercentage ?? p.discount_percentage ?? null,
          };
          if (mounted) setProduct(normalized);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        if (mounted) setError(err.message || "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (slug) fetchProduct();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {loading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-200 rounded-lg w-64"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-gray-200 rounded-xl"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-red-900 mb-4">Error</h2>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : product ? (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
              <nav className="flex items-center gap-2 text-sm text-gray-600">
                <span>Electronics</span>
                <span>/</span>
                <span>{product.categories?.[0]?.name || "Category"}</span>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate">
                  {product.name}
                </span>
              </nav>

              {product.is_bundle === 1 && (
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold">
                    <Package className="h-4 w-4" />
                    Complete Bundle Kit
                  </div>
                  <span className="text-gray-600 text-sm">
                    {product.bundle_items?.length || 0} items included
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <Gallery
                    images={
                      product.images?.length
                        ? product.images
                        : Array.isArray(product.image_paths)
                        ? product.image_paths
                        : product.image
                        ? [product.image]
                        : []
                    }
                    alt={product.name}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {product.categories?.[0]?.name || "Category"}
                    </span>
                    {product.quantity > 0 ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        In Stock ({product.quantity} available)
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                      {product.name}
                    </h1>
                    {product.average_rating ? (
                      <StarRating
                        rating={product.average_rating}
                        totalReviews={product.ratings?.length || 0}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-5 h-5" />
                        <span>No ratings yet.</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ৳{product.discountedPrice ?? product.price}
                      </span>
                      {product.discountedPrice &&
                        product.discountedPrice < product.price && (
                          <>
                            <span className="text-xl text-gray-500 line-through">
                              ৳{product.price}
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-lg">
                              -{product.discountPercentage}% OFF
                            </span>
                          </>
                        )}
                    </div>
                    {product.discountedPrice &&
                      product.discountedPrice < product.price && (
                        <p className="text-sm text-green-600 font-medium">
                          You save ৳{product.price - product.discountedPrice}
                        </p>
                      )}
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About this product
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.short_description}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quantity
                    </h3>
                    <div className="flex items-center gap-4">
                      <QuantitySelector
                        max={product.quantity}
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                      <span className="text-sm text-gray-500">
                        {product.quantity} available
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.quantity === 0}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        isWishlisted
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {product.is_bundle === 1 && product.bundle_items && (
                <BundleItems bundleItems={product.bundle_items} />
              )}

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Share this product
                </h3>
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Product Description
                </h2>
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description || ""),
                  }}
                />
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.slice(0, 8).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg cursor-pointer transition-colors"
                      >
                        #{tag.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Customer Reviews
                </h2>
                {product.ratings && product.ratings.length > 0 ? (
                  <div className="space-y-6">
                    {product.ratings.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {review.user.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.user}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < parseInt(review.star)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.rating}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No Reviews Yet</h3>
                      <p className="text-gray-600 mt-1">Be the first to share your thoughts on this product!</p>
                  </div>
                )}
              </div>
              
              {/* Related Products Section */}
              <RelatedProducts 
                categoryId={product.categories?.[0]?.slug} 
                currentProductId={product.id} 
              />
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;