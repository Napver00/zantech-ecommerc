import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { Shield, AlertTriangle, FileText, Clock } from "lucide-react";
import Seo from "@/components/Seo";

const Privacy = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPrivacy = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.baseURL}/documents/privacy-policy`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const html = json.data[0].text || "";
          const sanitized = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
          });
          if (mounted) setContent(sanitized);
        } else {
          throw new Error("Unexpected API response");
        }
      } catch (err) {
        console.error("Failed to load privacy policy:", err);
        if (mounted) setError(err.message || "Failed to load content");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPrivacy();
    return () => {
      mounted = false;
    };
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
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Unable to Load Privacy Policy
      </h3>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/*  SEO for Privacy page */}
      <Seo
        title="Privacy Policy - Zantech Store"
        description="Read the Zantech Store privacy policy to understand how we collect, use, and protect your personal data when you shop for robotics, IoT, and electronics products in Bangladesh."
        url="https://store.zantechbd.com/privacy-policy"
        type="article"
        keywords="Zantech Store privacy policy, data protection Bangladesh, customer data security, personal information policy, robotics store privacy, IoT store privacy"
      />

      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect
            your personal information.
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Data Protection
            </h3>
            <p className="text-sm text-gray-600">
              We use industry-standard security measures to protect your data.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
            <p className="text-sm text-gray-600">
              Clear information about what data we collect and why.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Regular Updates
            </h3>
            <p className="text-sm text-gray-600">
              We keep our privacy policy current with latest practices.
            </p>
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

          {/* Footer Note */}
          {!loading && !error && (
            <div className="mt-8 text-center">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Questions About Privacy?
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  If you have any questions about this privacy policy or how we
                  handle your data, please don't hesitate to contact us.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Contact Us
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
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

export default Privacy;
