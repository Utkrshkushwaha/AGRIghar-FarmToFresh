import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <FaLeaf className="text-lg" />
            </div>
            <span className="text-xl font-bold text-white">
              AGRI<span className="text-accent-400">ghar</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Connecting farmers directly with consumers. Fresh produce, fair prices, no middlemen.
            Empowering rural India through digital innovation.
          </p>
          <div className="flex gap-3">
            {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/browse", label: "Browse Products" },
              { to: "/register", label: "Join as Farmer" },
              { to: "/register", label: "Join as Consumer" },
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="hover:text-primary-400 transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaPhone className="text-primary-400 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-primary-400 flex-shrink-0" />
              <span>support@agrighar.in</span>
            </li>
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-primary-400 flex-shrink-0 mt-0.5" />
              <span>Rural Innovation Hub, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <p>© 2026 AGRIghar. Built with ❤️ by Team Green Coders — BGI Hackathon 2026</p>
        <p>Theme: Agriculture, FoodTech & Rural Innovation</p>
      </div>
    </div>
  </footer>
);

export default Footer;
