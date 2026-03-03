import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
 
export default function header() {
  return (
    <div className="bg-third p-1 flex justify-between items-center text-white px-4 md:px-8">
      <div className="text-sm md:text-base flex gap-6">
        <a
          href="mailto:info@joot.com"
          className="hover:underline hover:text-white/90 transition-colors duration-150"
        >
          info@joot.com
        </a>
        <a
          href="tel:+201110005551"
          className="hover:underline hover:text-white/90 transition-colors duration-150"
        >
          +201110005551
        </a>
      </div>

      <div className="text-sm md:text-base">
        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="Facebook"
            className="group inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <FaFacebook size={18} />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            title="Twitter"
            className="group inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <FaXTwitter size={18} />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="group inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <FaInstagram size={18} />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="group inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            <FaLinkedin size={18} />

          </a>
        </div>
      </div>
    </div>
  );
}
