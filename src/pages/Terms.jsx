import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { config } from '@/config';
import { FileText, AlertTriangle, Scale, Users, Gavel, MessageSquare } from 'lucide-react';

const Terms = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchTerms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.baseURL}/documents/term-condition`);
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
        console.error('Failed to load terms:', err);
        if (mounted) setError(err.message || 'Failed to load content');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTerms();
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
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Terms & Conditions</h3>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully. They outline the rules and regulations for using our service.
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Scale className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fair Terms</h3>
            <p className="text-sm text-gray-600">Balanced agreements that protect both parties' interests.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">User Rights</h3>
            <p className="text-sm text-gray-600">Clear explanation of your rights and responsibilities.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Gavel className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Legal Compliance</h3>
            <p className="text-sm text-gray-600">Terms comply with applicable laws and regulations.</p>
          </div>
        </div>

        {/* Key Points Summary */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Key Points Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Account Usage</h3>
                    <p className="text-sm text-gray-600">Guidelines for creating and maintaining your account.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Service Availability</h3>
                    <p className="text-sm text-gray-600">Information about service uptime and maintenance.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Terms</h3>
                    <p className="text-sm text-gray-600">Billing cycles, refunds, and payment policies.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Prohibited Activities</h3>
                    <p className="text-sm text-gray-600">Activities that are not allowed on our platform.</p>
                  </div>
                </div>
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

          {/* Footer Actions */}
          {!loading && !error && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Questions about Terms */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-3">
                  <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Questions About Terms?</h3>
                </div>
                <p className="text-blue-700 text-sm mb-4">
                  If you have questions about these terms or need clarification on any points, we're here to help.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Contact Legal Team
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Privacy Policy Link */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Related Documents</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Review our privacy policy and other important legal documents.
                </p>
                <div className="space-y-2">
                  <a 
                    href="/privacy" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors block"
                  >
                    Privacy Policy
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a 
                    href="/return-policy" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors block"
                  >
                    Return Policy
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated Notice */}
          {!loading && !error && (
            <div className="mt-6 text-center">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> These terms are subject to change. We'll notify you of any significant updates.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;