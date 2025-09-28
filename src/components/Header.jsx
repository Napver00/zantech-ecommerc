import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Facebook, Instagram, Linkedin } from 'lucide-react';
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

const NavLink = ({ href, children, isActive }) => (
  <NavigationMenuLink 
    href={href} 
    className={cn(
      "font-semibold text-sm px-3 py-2 hover:text-gray-900 relative after:content-[''] after:absolute after:left-0 after:bottom-[-18px] after:h-[2px] after:w-full after:bg-red-500 after:scale-x-0 after:transition-transform after:duration-300",
      isActive ? "text-gray-900 after:scale-x-100" : "text-gray-600",
      "hover:after:scale-x-100"
      )}
    >
    {children}
  </NavigationMenuLink>
);


const Header = () => {
  const [activeLink, setActiveLink] = useState('Categories');
  const categories = [
    '3D Solution', 'Accessories', 'Battery', 'Basic Components',
    'Display', 'Microcontroller', 'Project Kits', 'Robotics',
    'Sensor', 'Starter Kits', 'Wireless'
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-950 text-white text-xs py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div>
            <a href="#" className="hover:underline mr-4 opacity-80 hover:opacity-100">TERMS & CONDITIONS</a>
            <a href="#" className="hover:underline mr-4 opacity-80 hover:opacity-100">PRIVACY POLICY</a>
            <a href="#" className="hover:underline opacity-80 hover:opacity-100">REFUND & RETURNS POLICY</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="opacity-80 hover:opacity-100"><Facebook size={16}/></a>
            <a href="#" className="opacity-80 hover:opacity-100"><Instagram size={16}/></a>
            <a href="#" className="opacity-80 hover:opacity-100"><Linkedin size={16}/></a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="#">
            <img src="/zantech-logo.webp" alt="ZANTech Logo" className="h-12" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                     className={cn(
                      "font-semibold text-sm relative after:content-[''] after:absolute after:left-0 after:bottom-[-18px] after:h-[2px] after:w-full after:bg-red-500 after:scale-x-0 after:transition-transform after:duration-300",
                       activeLink === 'Categories' ? "text-gray-900 after:scale-x-100" : "text-gray-600",
                       "data-[state=open]:after:scale-x-100"
                     )}
                     onClick={() => setActiveLink('Categories')}
                  >CATEGORIES</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {categories.map((category) => (
                        <ListItem key={category} href="#" title={category}>
                          Find the best {category.toLowerCase()} here.
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem onClick={() => setActiveLink('Shop')}>
                   <NavLink href="#" isActive={activeLink === 'Shop'}>SHOP</NavLink>
                </NavigationMenuItem>
                 <NavigationMenuItem onClick={() => setActiveLink('Project')}>
                   <NavLink href="#" isActive={activeLink === 'Project'}>PROJECT</NavLink>
                </NavigationMenuItem>
                 <NavigationMenuItem onClick={() => setActiveLink('About')}>
                   <NavLink href="#" isActive={activeLink === 'About'}>ABOUT</NavLink>
                </NavigationMenuItem>
                 <NavigationMenuItem onClick={() => setActiveLink('Contact')}>
                   <NavLink href="#" isActive={activeLink === 'Contact'}>CONTACT</NavLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
          
          <div className="flex items-center gap-4">
            <div className="relative w-40 sm:w-64 hidden md:block">
              <Input type="search" placeholder="Query here..." className="pr-10 text-sm rounded-full bg-gray-100 border-gray-200 focus:bg-white" />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </Button>
              <Button size="sm" className="bg-blue-800 hover:bg-blue-900 hidden sm:flex">
                <User className="mr-2 h-4 w-4" /> Login
              </Button>
            </div>

            {/* Mobile Navigation Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col space-y-4 mt-8">
                      <a href="#" className="font-semibold">CATEGORIES</a>
                      <a href="#" className="font-semibold">SHOP</a>
                      <a href="#" className="font-semibold">PROJECT</a>
                      <a href="#" className="font-semibold">ABOUT</a>
                      <a href="#" className="font-semibold">CONTACT</a>
                      <div className="relative w-full mt-4">
                          <Input type="search" placeholder="Query here..." className="pr-10" />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <Button className="mt-4 bg-blue-800 hover:bg-blue-900">
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;

