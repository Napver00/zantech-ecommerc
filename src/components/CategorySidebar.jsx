import React, { useState, useEffect } from 'react';
import { config } from '@/config'; // Import the configuration
import { Menu } from 'lucide-react';
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
  }, []); // Empty dependency array ensures this runs only once on mount

  const renderSkeletons = () => {
      return Array.from({ length: 11 }).map((_, index) => (
          <li key={index} className="p-3">
            <Skeleton className="h-4 w-3/4" />
          </li>
      ))
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="bg-blue-950 text-white font-semibold p-3 text-sm flex items-center gap-2">
        <Menu size={18} />
        BROWSE CATEGORIES
      </h2>
      <ul>
        {isLoading ? (
          renderSkeletons()
        ) : error ? (
          <li className="p-3 text-sm text-red-500">Error loading categories.</li>
        ) : (
          categories.map(category => (
            <li key={category.id} className="border-b border-gray-100 last:border-b-0">
              <a href={`/category/${category.slug}`} className="block p-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                {category.name}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CategorySidebar;

