import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { config } from '@/config';
import { RotateCcw, AlertTriangle, Clock, Shield, Package, HeartHandshake } from 'lucide-react';

const ReturnPolicy = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchReturn = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.baseURL}/documents/return-policy`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const html = json.data[0].text || '';
          const sanitized = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
          if (mounted) setContent(sanitized);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (err) {
        console.error('Failed to load return policy:', err);
        if (mounted) setError(err.message || 'Failed to load content');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReturn();
    return () => { mounted = false; };
  }, []);

  const renderSkeletons = () => {
    return (
      <div className="space-y-6">
        {/* Title skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Content skeletons */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  };

  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Return Policy</h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Return Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Learn about our hassle-free return process.
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">7-Day Returns</h3>
            <p className="text-sm text-gray-600">Easy returns within 7 days of purchase for most items.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Return Shipping</h3>
            <p className="text-sm text-gray-600">We cover return shipping costs for eligible returns.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <HeartHandshake className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Customer First</h3>
            <p className="text-sm text-gray-600">Dedicated support team to help with your return process.</p>
          </div>
        </div>

        {/* Quick Return Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">How to Return an Item</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">Reach out to our support team to initiate your return.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Get Label</h3>
                <p className="text-sm text-gray-600">Receive a prepaid return shipping label via email.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Ship Item</h3>
                <p className="text-sm text-gray-600">Package your item and send it back using our label.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Get Refund</h3>
                <p className="text-sm text-gray-600">Receive your refund within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {loading ? (
              <div>{renderSkeletons()}</div>
            ) : error ? (
              <ErrorState />
            ) : (
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
          </div>

          {/* Help Section */}
          {!loading && !error && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Contact for Returns */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-3">
                  <HeartHandshake className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Need Help with a Return?</h3>
                </div>
                <p className="text-blue-700 text-sm mb-4">
                  Our customer service team is here to make your return process as smooth as possible.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Contact Support
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Order Status */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center mb-3">
                  <Package className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Track Your Return</h3>
                </div>
                <p className="text-green-700 text-sm mb-4">
                  Check the status of your return and refund processing.
                </p>
                <a 
                  href="/order-status" 
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                >
                  Check Status
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnPolicy;