import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { config } from '@/config';

const Contact = () => {
  const [form, setForm] = useState({ f_name: '', l_name: '', email: '', project_type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${config.baseURL}/company`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && json.data && mounted) setCompany(json.data);
      } catch (err) {
        console.error('Failed to load company info in contact page:', err);
      }
    };
    fetchCompany();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch(`${config.baseURL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setSuccess(json.message || 'Message sent successfully');
        setForm({ f_name: '', l_name: '', email: '', project_type: '', message: '' });
      } else {
        throw new Error(json.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Contact Us</h1>

          <div className="mb-4 text-sm text-gray-700">
            {company?.location && (
              <div className="flex items-center">Location: <span className="ml-2 font-medium">{company.location}</span></div>
            )}
            {company?.phone && (
              <div className="flex items-center">Phone: <a className="ml-2 font-medium" href={`tel:${company.phone}`}>{company.phone}</a></div>
            )}
            {company?.email && (
              <div className="flex items-center">Email: <a className="ml-2 font-medium" href={`mailto:${company.email}`}>{company.email}</a></div>
            )}
          </div>

          {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{success}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="f_name" value={form.f_name} onChange={handleChange} placeholder="First name" className="border p-2 rounded" required />
              <input name="l_name" value={form.l_name} onChange={handleChange} placeholder="Last name" className="border p-2 rounded" required />
            </div>

            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" className="w-full border p-2 rounded" required />

            <input name="project_type" value={form.project_type} onChange={handleChange} placeholder="Project type" className="w-full border p-2 rounded" />

            <textarea name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Message" className="w-full border p-2 rounded" required />

            <div>
              <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
