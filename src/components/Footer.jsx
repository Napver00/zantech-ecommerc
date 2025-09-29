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
} from "lucide-react";
import { config } from "@/config";

const YouTubeIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
    <path d="M10 9.5L15 12L10 14.5V9.5Z" fill="white" />
  </svg>
);

const iconForPlatform = (platform) => {
  const p = platform?.toLowerCase?.();
  if (!p) return LinkIcon;
  if (p.includes("facebook")) return Facebook;
  if (p.includes("instagram")) return Instagram;
  if (p.includes("linkedin")) return Linkedin;
  if (p.includes("youtube")) return YouTubeIcon;
  // fallback for youtube, tiktok etc. use LinkIcon
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
      } finally {
        // finished
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

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.1),_transparent_50%)]"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img
                  src="/zantech-logo.webp"
                  alt="ZanTech"
                  className="h-10 mb-4 brightness-0 invert"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <h2 className="text-2xl font-bold text-white hidden">
                  ZanTech
                </h2>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                Awaken your hidden talent
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.length > 0 ? (
                  socialLinks.map((link) => {
                    const p = link.platform?.toLowerCase?.() || "";
                    if (p.includes("tiktok")) return null; // explicitly skip TikTok
                    const Icon = iconForPlatform(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white/10 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                      >
                        <Icon
                          size={20}
                          className="text-gray-300 group-hover:text-white transition-colors"
                        />
                      </a>
                    );
                  })
                ) : (
                  <>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                    >
                      <Facebook
                        size={20}
                        className="text-gray-300 group-hover:text-white transition-colors"
                      />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                    >
                      <Instagram
                        size={20}
                        className="text-gray-300 group-hover:text-white transition-colors"
                      />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                    >
                      <Linkedin
                        size={20}
                        className="text-gray-300 group-hover:text-white transition-colors"
                      />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Important Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white relative">
                Important Links
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-red-400 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/shop"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Shop
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/project"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Project
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      About
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Contact
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      FAQ
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white relative">
                Legal
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-red-400 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/terms"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Terms & Conditions
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Privacy Policy
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/return-policy"
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Return Policy
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white relative">
                Contact Us
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-red-400 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                    <MapPin size={16} className="text-blue-300 mt-0.5" />
                  </div>
                  <span className="text-gray-300 leading-relaxed">
                    {location}
                  </span>
                </li>

                {company?.phone && (
                  <li className="flex items-center group">
                    <div className="bg-green-500/20 p-2 rounded-lg mr-3 group-hover:bg-green-500/30 transition-colors">
                      <Phone size={16} className="text-green-300" />
                    </div>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-gray-300 hover:text-green-300 transition-colors"
                    >
                      {company.phone}
                    </a>
                  </li>
                )}

                <li className="flex items-center group">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
                    <Mail size={16} className="text-purple-300" />
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-300 hover:text-purple-300 transition-colors"
                  >
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; 2025 ZANTech. All Rights Reserved.
              </p>

              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="bg-blue-600 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                aria-label="Back to top"
              >
                <ArrowUp
                  size={20}
                  className="text-white group-hover:translate-y-[-2px] transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;