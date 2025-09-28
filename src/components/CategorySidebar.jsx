import React, { useState, useEffect } from 'react';
import { config } from '@/config';
import { Menu, ChevronRight, AlertTriangle, Grid3X3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CategorySidebar = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.baseURL}/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          throw new Error('API response format is incorrect.');
        }
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <li key={index} className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      </li>
    ));
  };

  const ErrorState = () => (
    <div className="p-6 text-center">
      <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <p className="text-sm text-red-600 mb-3">Failed to load categories</p>
      <button 
        onClick={() => window.location.reload()}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-4">
        <h2 className="text-white font-semibold text-sm flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Menu size={16} className="text-white" />
          </div>
          <span>BROWSE CATEGORIES</span>
        </h2>
      </div>

      {/* Categories List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <ul className="py-2">
            {renderSkeletons()}
          </ul>
        ) : error ? (
          <ErrorState />
        ) : categories.length === 0 ? (
          <div className="p-6 text-center">
            <Grid3X3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No categories available</p>
          </div>
        ) : (
          <ul className="py-2">
            {categories.map((category, index) => (
              <li key={category.id} className="group">
                <a 
                  href={`/category/${category.slug}`} 
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors duration-200"></div>
                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                      {category.name}
                    </span>
                  </div>
                  <ChevronRight 
                    size={14} 
                    className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" 
                  />
                </a>
                {index < categories.length - 1 && (
                  <div className="mx-4 h-px bg-gray-100"></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {!isLoading && !error && categories.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {categories.length} categories available
          </p>
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;