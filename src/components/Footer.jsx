import React, { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Link as LinkIcon,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp,
  Twitter,
  Youtube,
} from "lucide-react";
import { config } from "@/config";

const iconForPlatform = (platform) => {
  const p = platform?.toLowerCase?.();
  if (!p) return LinkIcon;
  if (p.includes("facebook")) return Facebook;
  if (p.includes("instagram")) return Instagram;
  if (p.includes("linkedin")) return Linkedin;
  if (p.includes("twitter")) return Twitter;
  if (p.includes("youtube")) return Youtube;
  return LinkIcon;
};

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
        console.error("Failed to load company info:", err);
      }
    };

    fetchCompany();
    return () => {
      mounted = false;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = company?.social_links || [];
  const location = company?.location || "Barishal, Barisal Division Bangladesh";
  const email = company?.email || "zantechbd@gmail.com";
  const phone = company?.phone || "+880 1712-345678"; // Fallback phone

  return (
    <footer className="bg-slate-900 text-slate-200 relative overflow-hidden border-t border-slate-800">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative container mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <img
                  src="/zantech-logo.webp"
                  alt="ZanTech"
                  className="h-12 brightness-0 invert"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              <span className="text-2xl font-bold text-white tracking-tight hidden">ZanTech</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xs">
              Awaken your hidden talent. We provide top-notch tech solutions and education to empower the next generation.
            </p>
            <div className="flex gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => {
                   const p = link.platform?.toLowerCase?.() || "";
                   if (p.includes("tiktok")) return null;
                   const Icon = iconForPlatform(link.platform);
                   return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                      aria-label={link.platform}
                    >
                      <Icon size={18} />
                    </a>
                   );
                })
              ) : (
                <>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                    <Linkedin size={18} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {['About', 'Project', 'Shop', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`/${item.toLowerCase()}`} 
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-3">
              {[
                { name: 'Terms & Conditions', href: '/terms' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Return Policy', href: '/return-policy' },
                { name: 'FAQ', href: '/faq' },
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-500 mt-1 mr-3 shrink-0" />
                <span className="text-slate-400">{location}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                <a href={`tel:${phone}`} className="text-slate-400 hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                <a href={`mailto:${email}`} className="text-slate-400 hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} ZanTech. All rights reserved.
          </p>
          
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Back to Top
            <span className="p-2 rounded-full bg-slate-800 group-hover:bg-blue-600 transition-colors">
              <ArrowUp size={16} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;