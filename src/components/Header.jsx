import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, Facebook, Instagram, Linkedin, Link as LinkIcon, Bell, Heart } from 'lucide-react';

const YouTubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
    <path d="M10 9.5L15 12L10 14.5V9.5Z" fill="white" />
  </svg>
);

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { config } from '@/config';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('Categories');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    let mounted = true;
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${config.baseURL}/company`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && json.data && mounted) setCompany(json.data);
      } catch (err) {
        console.error('Failed to load company info in header:', err);
      }
    };
    fetchCompany();
    return () => { mounted = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality here
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-white text-xs py-3">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-6">
            <span className="text-blue-100 font-medium">Welcome to ZanTech Commerce</span>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/terms" className="hover:text-blue-200 transition-colors duration-200 hover:underline">
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy" className="hover:text-blue-200 transition-colors duration-200 hover:underline">
                Privacy Policy
              </Link>
              <Link to="/return-policy" className="hover:text-blue-200 transition-colors duration-200 hover:underline">
                Return Policy
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-blue-200 text-xs hidden sm:block">Follow us:</span>
            {company?.social_links?.length > 0 ? (
              company.social_links.map(link => {
                const platform = link.platform?.toLowerCase?.() || '';
                let Icon = LinkIcon;
                if (platform.includes('facebook')) Icon = Facebook;
                if (platform.includes('instagram')) Icon = Instagram;
                if (platform.includes('linkedin')) Icon = Linkedin;
                if (platform.includes('youtube')) Icon = YouTubeIcon;
                if (platform.includes('tiktok')) return null;
                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-200 hover:text-white transition-all duration-200 hover:scale-110"
                  >
                    <Icon size={16} />
                  </a>
                );
              })
            ) : (
              <>
                <a href="#" className="text-blue-200 hover:text-white transition-all duration-200 hover:scale-110">
                  <Facebook size={16}/>
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-all duration-200 hover:scale-110">
                  <Instagram size={16}/>
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-all duration-200 hover:scale-110">
                  <Linkedin size={16}/>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/zantech-logo.webp" 
              alt="ZANTech Logo" 
              className="h-12 transition-transform duration-200 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 relative",
                      "after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:bg-red-600 after:transform after:-translate-x-1/2 after:transition-all after:duration-300",
                      activeLink === 'Categories' ? "text-blue-600 bg-blue-50 after:w-8" : "text-gray-700 after:w-0 hover:after:w-4",
                      "data-[state=open]:text-blue-600 data-[state=open]:bg-blue-50 data-[state=open]:after:w-8"
                    )}
                    onClick={() => setActiveLink('Categories')}
                  >
                    CATEGORIES
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] p-6 bg-white shadow-xl rounded-xl border border-gray-100">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Product Categories</h3>
                        <p className="text-sm text-gray-600">Explore our range of products</p>
                      </div>
                      <ul className="grid grid-cols-2 gap-3">
                        {isLoading ? (
                          <div className="col-span-2 text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading categories...</p>
                          </div>
                        ) : error ? (
                          <p className="col-span-2 text-center py-4 text-red-500">Could not load categories.</p>
                        ) : (
                          categories.map((category) => (
                            <ListItem 
                              key={category.id} 
                              href={`/category/${category.slug}`} 
                              title={category.name}
                            >
                              {category.description}
                            </ListItem>
                          ))
                        )}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {[
                  { path: '/shop', label: 'SHOP' },
                  { path: '/project', label: 'PROJECT' },
                  { path: '/about', label: 'ABOUT' },
                  { path: '/contact', label: 'CONTACT' }
                ].map(({ path, label }) => (
                  <NavigationMenuItem key={path}>
                    <NavigationMenuLink asChild>
                      <Link 
                        to={path} 
                        className={cn(
                          'font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 relative',
                          'after:content-[""] after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:bg-red-600 after:transform after:-translate-x-1/2 after:transition-all after:duration-300',
                          location.pathname === path 
                            ? 'text-blue-600 bg-blue-50 after:w-8' 
                            : 'text-gray-700 after:w-0 hover:after:w-4'
                        )}
                      >
                        {label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-48 sm:w-64 hidden md:block">
              <Input 
                type="search" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 text-sm rounded-full bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
              >
                <Search className="h-4 w-4 text-gray-500 hover:text-blue-600" />
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 transition-colors duration-200 group">
                <Heart className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 transition-colors duration-200 group">
                <ShoppingCart className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                  0
                </span>
              </Button>

              {/* Login Button */}
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hidden sm:flex">
                <User className="mr-2 h-4 w-4" /> 
                Login
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:bg-blue-50 transition-colors duration-200">
                    <Menu className="text-gray-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[320px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-1 mt-8">
                    <div className="mb-6">
                      <img src="/zantech-logo.webp" alt="ZANTech" className="h-10" />
                    </div>
                    
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative mb-6">
                      <Input 
                        type="search" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 rounded-lg border-gray-200" 
                      />
                      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Search className="h-4 w-4 text-gray-400" />
                      </button>
                    </form>

                    {/* Mobile Navigation Links */}
                    {[
                      { path: '/shop', label: 'SHOP' },
                      { path: '/project', label: 'PROJECT' },
                      { path: '/about', label: 'ABOUT' },
                      { path: '/contact', label: 'CONTACT' }
                    ].map(({ path, label }) => (
                      <Link 
                        key={path}
                        to={path} 
                        className={cn(
                          "font-semibold py-3 px-4 rounded-lg transition-colors duration-200",
                          location.pathname === path 
                            ? "text-blue-600 bg-blue-50" 
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {label}
                      </Link>
                    ))}

                    <div className="border-t border-gray-200 my-4"></div>
                    
                    {/* Legal Links */}
                    <div className="space-y-1">
                      <Link to="/terms" className="block text-gray-600 hover:text-blue-600 py-2 px-4 text-sm transition-colors duration-200">
                        Terms & Conditions
                      </Link>
                      <Link to="/privacy-policy" className="block text-gray-600 hover:text-blue-600 py-2 px-4 text-sm transition-colors duration-200">
                        Privacy Policy
                      </Link>
                      <Link to="/return-policy" className="block text-gray-600 hover:text-blue-600 py-2 px-4 text-sm transition-colors duration-200">
                        Return Policy
                      </Link>
                    </div>

                    {/* Mobile Login Button */}
                    <Button className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">
                      <User className="mr-2 h-4 w-4" /> Login
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 border border-transparent hover:border-blue-100",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-gray-600">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;