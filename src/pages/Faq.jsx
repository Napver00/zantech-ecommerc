import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { config } from '@/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, AlertTriangle } from 'lucide-react';

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${config.baseURL}/faqs/active`);
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs. Please try again later.');
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Filter for FAQs where the category is 'store'
          const storeFaqs = data.data.filter(faq => faq.category === 'store');
          setFaqs(storeFaqs);
        } else {
          throw new Error('Invalid data format received from the server.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const renderSkeletons = () => {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our store and products.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
                {loading && renderSkeletons()}

                {!loading && error && (
                    <div className="text-center py-8 text-red-600">
                        <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
                        <p className="font-semibold">Error loading FAQs</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && faqs.length > 0 && (
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map(faq => (
                            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                                <AccordionTrigger className="text-lg text-left hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-gray-700 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                {!loading && !error && faqs.length === 0 && (
                     <div className="text-center py-8 text-gray-500">
                        <HelpCircle className="h-10 w-10 mx-auto mb-4" />
                        <p className="font-semibold">No Questions Yet</p>
                        <p className="text-sm">We're working on adding FAQs. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;