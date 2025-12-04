import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { config } from '@/config';
import { 
  Heart, 
  Users, 
  Target, 
  Award, 
  AlertTriangle, 
  Building2, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Globe
} from 'lucide-react';
import Seo from '@/components/Seo';

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
          const sanitized = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
          if (mounted) setContent(sanitized);
        } else {
          // If no content found, we can just show the static parts
          if (mounted) setContent(''); 
        }
      } catch (err) {
        console.error('Failed to load about:', err);
        if (mounted) setError(err.message || 'Failed to load content');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAbout();
    return () => {
      mounted = false;
    };
  }, []);

  const renderSkeletons = () => (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Seo
        title="About Zantech - Innovating the Future"
        description="Discover Zantech's mission to revolutionize technology and education in Bangladesh through robotics, IoT, and STEM solutions."
        url="https://store.zantechbd.com/about"
        type="website"
      />

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-slate-200">Innovating since 2020</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-300">
              We Are ZAN Tech
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Empowering the next generation through Robotics, IoT, and cutting-edge STEM education. We build the future, one circuit at a time.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Years Experience', value: '5+', icon: Building2, color: 'text-blue-600' },
                { label: 'Happy Clients', value: '1k+', icon: Users, color: 'text-green-600' },
                { label: 'Projects Done', value: '500+', icon: Target, color: 'text-purple-600' },
                { label: 'Awards Won', value: '12', icon: Award, color: 'text-yellow-600' },
              ].map((stat, index) => (
                <div key={index} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Content & Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {loading ? (
              renderSkeletons()
            ) : (
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left Column: Mission/Values Cards */}
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                    <p className="text-slate-600 leading-relaxed">
                      To democratize access to technology education and provide high-quality electronic components to makers, students, and engineers across Bangladesh.
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                    <p className="text-slate-600 leading-relaxed">
                      To be the leading catalyst for technological innovation in the region, fostering a community of creators who solve real-world problems.
                    </p>
                  </div>
                </div>

                {/* Right Column: Dynamic Content or Fallback */}
                <div className="lg:pl-8">
                  {content ? (
                    <div 
                      className="prose prose-lg prose-slate max-w-none
                        prose-headings:font-bold prose-headings:text-slate-900
                        prose-p:text-slate-600 prose-p:leading-relaxed
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-4
                        prose-img:rounded-2xl prose-img:shadow-lg"
                      dangerouslySetInnerHTML={{ __html: content }} 
                    />
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold text-slate-900">Why Choose Us?</h2>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        At ZanTech, we believe in quality, integrity, and innovation. We don't just sell products; we provide solutions. Our team of experts is dedicated to helping you succeed in your projects, whether you're a beginner or a professional.
                      </p>
                      <ul className="space-y-4 mt-8">
                        {[
                          "Authentic components guaranteed",
                          "Expert technical support",
                          "Fast and reliable delivery",
                          "Comprehensive learning resources"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
              Explore our wide range of products or get in touch with our team for custom solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/25"
              >
                Browse Shop
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/10 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
