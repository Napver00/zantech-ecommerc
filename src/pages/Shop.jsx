import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { config } from '@/config';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    min_price: '',
    max_price: '',
    category_slug: '',
    page: 1,
    limit: 20
  });
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${config.baseURL}/categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters
  const fetchProducts = useCallback(async (currentFilters = filters) => {
    const loading = currentFilters.page === 1 ? setIsLoading : setIsFilterLoading;
    loading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add non-empty parameters
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });
      
      const res = await fetch(`${config.baseURL}/products?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const json = await res.json();
      let productData = [];
      let paginationData = {};
      
      if (json.success) {
        if (Array.isArray(json.data)) {
          productData = json.data;
        } else if (json.data && Array.isArray(json.data.data)) {
          // Paginated response
          productData = json.data.data;
          paginationData = {
            current_page: json.data.current_page || 1,
            last_page: json.data.last_page || 1,
            per_page: json.data.per_page || 20,
            total: json.data.total || 0
          };
        }
      }
      
      if (currentFilters.page === 1) {
        setProducts(productData);
      } else {
        setProducts(prev => [...prev, ...productData]);
      }
      
      if (Object.keys(paginationData).length > 0) {
        setPagination(paginationData);
      }
      
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      loading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    handleFilterChange('search', searchValue);
  };

  // Clear filters
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      min_price: '',
      max_price: '',
      category_slug: '',
      page: 1,
      limit: 20
    };
    setFilters(clearedFilters);
    fetchProducts(clearedFilters);
  };

  // Load more products
  const loadMore = () => {
    if (pagination.current_page < pagination.last_page && !isFilterLoading) {
      const newFilters = { ...filters, page: filters.page + 1 };
      setFilters(newFilters);
      fetchProducts(newFilters);
    }
  };

  // Toggle filter sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Map product for ProductCard
  const mapProduct = (p) => ({
    id: p.id ?? p._id,
    slug: p.slug ?? p.product_slug ?? (p._id ? String(p._id) : undefined),
    name: p.name ?? p.title ?? 'Untitled Product',
    price: Number(p.price ?? p.originalPrice ?? 0),
    discountedPrice: p.discountedPrice ?? p.discount_price ?? p.sale_price ?? null,
    discount: p.discount ?? (p.discountedPrice ? p.price - p.discountedPrice : 0),
    discountPercentage: p.discountPercentage ?? p.discount_percentage ?? null,
    image: Array.isArray(p.image_paths) ? p.image_paths[0] : (p.image || p.image_path || p.image_url || '/placeholder-product.jpg'),
    stock: p.quantity ?? p.stock ?? p.qty ?? null,
    rating: p.rating ?? null,
    reviews: p.reviews_count ?? p.reviews ?? null,
    short_description: p.short_description ?? p.description ?? p.excerpt ?? '',
    categories: p.categories ?? [],
    _raw: p,
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <Skeleton className="aspect-[5/4] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
                <p className="text-gray-600">
                  Discover our complete collection of products
                  {pagination.total > 0 && (
                    <span className="ml-2 text-blue-600 font-medium">
                      ({pagination.total.toLocaleString()} products)
                    </span>
                  )}
                </p>
              </div>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative w-full lg:w-96">
                <Input
                  name="search"
                  type="search"
                  placeholder="Search products..."
                  defaultValue={filters.search}
                  className="pr-12 h-12 text-base rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Search className="h-5 w-5 text-gray-500" />
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full justify-between h-12"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </div>
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>

              {/* Filter Panel */}
              <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${showFilters || 'hidden lg:block'}`}>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </h3>
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Price Range Filter */}
                  <div className="p-6">
                    <button
                      onClick={() => toggleSection('price')}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h4 className="font-semibold text-gray-900">Price Range</h4>
                      {expandedSections.price ? 
                        <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      }
                    </button>
                    
                    {expandedSections.price && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Price
                            </label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={filters.min_price}
                              onChange={(e) => handleFilterChange('min_price', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Price
                            </label>
                            <Input
                              type="number"
                              placeholder="∞"
                              value={filters.max_price}
                              onChange={(e) => handleFilterChange('max_price', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="p-6">
                    <button
                      onClick={() => toggleSection('category')}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h4 className="font-semibold text-gray-900">Categories</h4>
                      {expandedSections.category ? 
                        <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      }
                    </button>
                    
                    {expandedSections.category && (
                      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                        <button
                          onClick={() => handleFilterChange('category_slug', '')}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            filters.category_slug === '' 
                              ? 'bg-blue-100 text-blue-700 font-medium' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleFilterChange('category_slug', category.slug)}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              filters.category_slug === category.slug 
                                ? 'bg-blue-100 text-blue-700 font-medium' 
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Results Count */}
                    {!isLoading && (
                      <span className="text-sm text-gray-600">
                        Showing {products.length} of {pagination.total.toLocaleString()} products
                      </span>
                    )}
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <select 
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => {
                        // Add sorting logic here when backend supports it
                        console.log('Sort by:', e.target.value);
                      }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-12 text-center">
                  <div className="text-red-600 mb-4">
                    <X className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button onClick={() => fetchProducts()} className="bg-red-600 hover:bg-red-700">
                    Try Again
                  </Button>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                      : 'space-y-4'
                  }`}>
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id || product._id || product.slug} 
                        product={mapProduct(product)} 
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {pagination.current_page < pagination.last_page && (
                    <div className="text-center mt-12">
                      <Button
                        onClick={loadMore}
                        disabled={isFilterLoading}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base"
                      >
                        {isFilterLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Loading...
                          </>
                        ) : (
                          `Load More Products (${pagination.total - products.length} remaining)`
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;