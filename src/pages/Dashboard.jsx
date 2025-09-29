import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, logout } = useAuth();

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
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to your Dashboard</h1>
                <p className="text-xl text-gray-600">{user.name}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Details</h2>
                <div className="space-y-4 text-gray-700">
                    <div className="flex flex-col sm:flex-row">
                        <strong className="w-32">Name:</strong>
                        <span>{user.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                        <strong className="w-32">Email:</strong>
                        <span>{user.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                        <strong className="w-32">Phone:</strong>
                        <span>{user.phone}</span>
                    </div>
                </div>
            </div>

             <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <Button onClick={logout} size="lg" variant="destructive">
                    Logout
                </Button>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;