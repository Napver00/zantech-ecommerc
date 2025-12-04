import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
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
           if (mounted) setContent("");
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

  const renderSkeletons = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 pt-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Seo
        title="Privacy Policy - Zantech Store"
        description="Read the Zantech Store privacy policy to understand how we collect, use, and protect your personal data."
        url="https://store.zantechbd.com/privacy-policy"
        type="article"
      />

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[50%] -right-[20%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-[50%] -left-[20%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We are committed to protecting your personal information and your right to privacy.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
             {[
              { icon: Lock, title: "Secure Data", desc: "Your data is encrypted and stored securely." },
              { icon: Eye, title: "Transparent", desc: "No hidden tracking or data selling." },
              { icon: FileText, title: "Compliance", desc: "We follow all local data protection laws." }
             ].map((item, i) => (
               <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start space-x-4">
                 <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                   <item.icon size={24} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-slate-900">{item.title}</h3>
                   <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            {loading ? (
              renderSkeletons()
            ) : error ? (
               <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div 
                className="prose prose-slate max-w-none prose-lg
                  prose-headings:font-bold prose-headings:text-slate-900
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900
                  prose-ul:list-disc prose-ul:pl-4"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}
            
            {!loading && !error && !content && (
              <div className="text-center py-12 text-slate-500">
                <p>No privacy policy content available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <p className="text-slate-500 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-slate-500 text-sm mt-2">
              If you have any questions, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
