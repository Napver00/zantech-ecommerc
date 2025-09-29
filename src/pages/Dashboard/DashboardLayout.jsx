import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, Download, MapPin, User, LogOut, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: 'orders', icon: Package, label: 'Orders' },
    { to: 'downloads', icon: Download, label: 'Downloads' },
    { to: 'addresses', icon: MapPin, label: 'Addresses' },
    { to: 'account-details', icon: User, label: 'Account Details' },
    { to: 'wishlist', icon: Heart, label: 'Wishlist' },
  ];

  if (!user) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 text-center">
                <p>Loading user data...</p>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold">Hello, {user.name}</h2>
                        </div>
                        <nav className="space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.to === '/dashboard'}
                                    className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                                        isActive
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    )
                                    }
                                >
                                    <link.icon className="h-5 w-5" />
                                    <span>{link.label}</span>
                                </NavLink>
                            ))}
                             <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-300 hover:bg-red-500 hover:text-white"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="p-4 sm:p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;

