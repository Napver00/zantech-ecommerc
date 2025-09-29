import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';
import { Package, Download, MapPin, User, Heart, ArrowRight, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

const DashboardHome = () => {
    const { user, logout, token } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${config.baseURL}/users/info`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Could not fetch user summary.');
                }
                const data = await response.json();
                if (data.success) {
                    setUserInfo(data.data);
                } else {
                    throw new Error(data.message || 'Failed to get user info.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token]);

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

    const summaryItems = [
        { label: 'Total Orders', value: userInfo?.total_orders },
        { label: 'Wishlist Items', value: userInfo?.total_wishlist },
        { label: 'Addresses', value: userInfo?.total_shipping_addr },
        { label: 'Downloads', value: 0 }, // Assuming downloads are not in the API yet
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

            {/* Account Summary Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Summary</h3>
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                             <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <Skeleton className="h-4 w-2/3 mb-2" />
                                <Skeleton className="h-8 w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5"/>
                        <span>{error}</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {summaryItems.map(item => (
                            <div key={item.label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{item.value ?? 0}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;