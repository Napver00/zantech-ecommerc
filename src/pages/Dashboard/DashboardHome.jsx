import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Download, MapPin, User, Heart, ArrowRight } from 'lucide-react';

const DashboardHome = () => {
    const { user, logout } = useAuth();

    const dashboardItems = [
        { 
            to: 'orders', 
            icon: Package, 
            label: 'Orders',
            description: 'View and track your orders'
        },
        { 
            to: 'downloads', 
            icon: Download, 
            label: 'Downloads',
            description: 'Access your downloads'
        },
        { 
            to: 'addresses', 
            icon: MapPin, 
            label: 'Addresses',
            description: 'Manage shipping addresses'
        },
        { 
            to: 'account-details', 
            icon: User, 
            label: 'Account Details',
            description: 'Update your information'
        },
        { 
            to: 'wishlist', 
            icon: Heart, 
            label: 'Wishlist',
            description: 'View saved items'
        },
    ];

    return (
        <div>
            {/* Welcome Message */}
            <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Dashboard</h2>
                <p className="text-gray-600 leading-relaxed">
                    Hello <strong className="text-gray-900">{user.name}</strong> (not <strong className="text-gray-900">{user.name}</strong>? <button onClick={logout} className="text-blue-600 hover:text-blue-700 font-medium">Log out</button>). 
                    From your account dashboard you can view your <Link to="orders" className="text-blue-600 hover:text-blue-700 font-medium">recent orders</Link>, 
                    manage your <Link to="addresses" className="text-blue-600 hover:text-blue-700 font-medium">shipping addresses</Link>, 
                    and <Link to="account-details" className="text-blue-600 hover:text-blue-700 font-medium">edit your account details</Link>.
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardItems.map(item => (
                        <Link 
                            key={item.to} 
                            to={item.to} 
                            className="group bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="bg-white border border-gray-200 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <item.icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {item.label}
                                        </h4>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity Section (Optional) */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Wishlist Items</p>
                        <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Addresses</p>
                        <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Downloads</p>
                        <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;