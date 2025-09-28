import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { config } from '@/config';
import { Heart, Users, Target, Award, AlertTriangle, Building2, Sparkles } from 'lucide-react';

const About = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.baseURL}/documents/about`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const html = json.data[0].text || '';
          // sanitize the incoming HTML
          const sanitized = DOMPurify.sanitize(html, {USE_PROFILES: {html: true}});
          if (mounted) setContent(sanitized);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (err) {
        console.error('Failed to load about:', err);
        if (mounted) setError(err.message || 'Failed to load content');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAbout();
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
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load About Content</h3>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About ZanTeche
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our story, mission, and the passion that drives us to deliver exceptional experiences.
          </p>
        </div>

        {/* Company Values */}
        <div className="grid md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600">Delivering innovative solutions that exceed expectations.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Our Values</h3>
            <p className="text-sm text-gray-600">Integrity, quality, and customer satisfaction first.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Our Team</h3>
            <p className="text-sm text-gray-600">Passionate professionals dedicated to excellence.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Our Promise</h3>
            <p className="text-sm text-gray-600">Continuous innovation and unwavering quality.</p>
          </div>
        </div>

        {/* Company Logo Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-100 text-center">
            <div className="bg-white rounded-xl p-8 inline-block shadow-sm">
              <img 
                src="/zantechmanlogo.png" 
                alt="ZanTeche Logo" 
                className="h-20 md:h-24 mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden bg-orange-100 w-16 h-16 rounded-full items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">ZanTeche Commerce</h2>
            <p className="text-gray-600">Your trusted partner in innovative solutions</p>
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

          {/* Call to Action Section */}
          {!loading && !error && (
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {/* Contact Us */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Get in Touch</h3>
                  <p className="text-gray-600 mb-6">
                    Ready to work with us? We'd love to hear about your project and discuss how we can help.
                  </p>
                  <a 
                    href="/contact" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    Contact Us
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Our Products */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Explore Products</h3>
                  <p className="text-gray-600 mb-6">
                    Discover our range of innovative products and solutions designed to meet your needs.
                  </p>
                  <a 
                    href="/products" 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    View Products
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          {!loading && !error && (
            <div className="mt-12">
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Why Choose ZanTeche?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">5+</div>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">1000+</div>
                    <p className="text-sm text-gray-600">Happy Customers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
                    <p className="text-sm text-gray-600">Customer Support</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;