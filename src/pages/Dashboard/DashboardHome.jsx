import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Download, MapPin, User, LogOut, Heart } from 'lucide-react';

const DashboardHome = () => {
    const { user, logout } = useAuth();

    const dashboardItems = [
        { to: 'orders', icon: Package, label: 'Orders' },
        { to: 'downloads', icon: Download, label: 'Downloads' },
        { to: 'addresses', icon: MapPin, label: 'Addresses' },
        { to: 'account-details', icon: User, label: 'Account Details' },
        { to: 'wishlist', icon: Heart, label: 'Wishlist' },
    ];

    return (
        <div>
            <p className="text-gray-700 leading-relaxed mb-8">
                Hello <strong className="text-gray-900">{user.name}</strong> (not <strong className="text-gray-900">{user.name}</strong>? <button onClick={logout} className="text-blue-600 hover:underline">Log out</button>). 
                From your account dashboard you can view your <Link to="orders" className="text-blue-600 hover:underline">recent orders</Link>, 
                manage your <Link to="addresses" className="text-blue-600 hover:underline">shipping and billing addresses</Link>, 
                and <Link to="account-details" className="text-blue-600 hover:underline">edit your password and account details</Link>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {dashboardItems.map(item => (
                     <Link key={item.to} to={item.to} className="group">
                        <div className="bg-white border-2 border-gray-100 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                           <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors duration-300">
                                <item.icon className="h-8 w-8 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                           </div>
                           <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{item.label}</h3>
                        </div>
                    </Link>
                ))}
                 <button onClick={logout} className="group">
                    <div className="bg-white border-2 border-gray-100 rounded-xl p-6 text-center hover:border-red-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors duration-300">
                            <LogOut className="h-8 w-8 text-gray-500 group-hover:text-red-600 transition-colors duration-300" />
                        </div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-300">Logout</h3>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default DashboardHome;

