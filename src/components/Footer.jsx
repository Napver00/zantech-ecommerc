import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              <img src="public\zantech-logo.webp" alt="" />
            </h2>
            <p className="text-gray-600">
              Your partner in DIY robotics and high-quality electronic components for hobbyists and makers.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-blue-600"><Facebook size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-blue-600"><Instagram size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-blue-600"><Linkedin size={20} /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">IMPORTANT LINKS</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">Shop</a></li>
              <li><a href="#" className="hover:underline">Project</a></li>
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">LEGAL</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Refund & Returns Policy</a></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">CONTACT US</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 shrink-0" />
                <span>Barishal, Barisal Division Bangladesh</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 shrink-0" />
                <a href="mailto:zantechbd@gmail.com" className="hover:underline">zantechbd@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between">
          <p>&copy; 2025 ZANTech. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
