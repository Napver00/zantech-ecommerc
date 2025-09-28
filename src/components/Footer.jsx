import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Link as LinkIcon, Facebook, Instagram, Linkedin } from 'lucide-react';

const YouTubeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
    <path d="M10 9.5L15 12L10 14.5V9.5Z" fill="white" />
  </svg>
);

import { config } from '@/config';

const iconForPlatform = (platform) => {
  const p = platform?.toLowerCase?.();
  if (!p) return LinkIcon;
  if (p.includes('facebook')) return Facebook;
  if (p.includes('instagram')) return Instagram;
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('youtube')) return YouTubeIcon;
  // fallback for youtube, tiktok etc. use LinkIcon
  return LinkIcon;
}

const Footer = () => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${config.baseURL}/company`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && json.data) {
          if (mounted) setCompany(json.data);
        }
      } catch (err) {
        console.error('Failed to load company info:', err);
      } finally {
        // finished
      }
    };

    fetchCompany();
    return () => { mounted = false; };
  }, []);

  const socialLinks = company?.social_links || [];
  const location = company?.location || 'Barishal, Barisal Division Bangladesh';
  const email = company?.email || 'zantechbd@gmail.com';
  const footerText = company?.footer_text || 'Empowering the future through innovative robotics and IoT solutions.';

  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              <img src="/zantech-logo.webp" alt="Zantech" />
            </h2>
            <p className="text-gray-600">
              {company?.about_description1 || 'Your partner in DIY robotics and high-quality electronic components for hobbyists and makers.'}
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.length > 0 ? (
                socialLinks.map(link => {
                  const p = link.platform?.toLowerCase?.() || '';
                  if (p.includes('tiktok')) return null; // explicitly skip TikTok
                  const Icon = iconForPlatform(link.platform);
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-600">
                      <Icon size={20} />
                    </a>
                  );
                })
              ) : (
                <>
                  <a href="#" className="text-gray-500 hover:text-blue-600"><Facebook size={20} /></a>
                  <a href="#" className="text-gray-500 hover:text-blue-600"><Instagram size={20} /></a>
                  <a href="#" className="text-gray-500 hover:text-blue-600"><Linkedin size={20} /></a>
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">IMPORTANT LINKS</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/shop" className="hover:underline">Shop</a></li>
              <li><a href="/project" className="hover:underline">Project</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">LEGAL</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/return-policy" className="hover:underline">Refund & Returns Policy</a></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">CONTACT US</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 shrink-0" />
                <span>{location}</span>
              </li>
              {company?.phone && (
                <li className="flex items-center">
                  <Phone size={16} className="mr-2 shrink-0" />
                  <a href={`tel:${company.phone}`} className="hover:underline">{company.phone}</a>
                </li>
              )}
              <li className="flex items-center">
                <Mail size={16} className="mr-2 shrink-0" />
                <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between">
          <p>{footerText} &copy; 2025 ZANTech. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
