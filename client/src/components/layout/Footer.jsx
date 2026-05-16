import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for GSAP animations
  const footerRef = useRef(null);
  const brandRef = useRef(null);

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Set initial visibility for all animated elements with existence checks
      const footerSections = document.querySelectorAll('.footer-section');
      const footerBottom = document.querySelector('.footer-bottom');
      
      if (footerSections.length > 0) {
        gsap.set('.footer-section', { opacity: 1 });
      }
      if (brandRef.current) {
        gsap.set(brandRef.current, { opacity: 1 });
      }
      if (footerBottom) {
        gsap.set('.footer-bottom', { opacity: 1 });
      }
      
      // Smoother ScrollTrigger defaults
      ScrollTrigger.defaults({
        toggleActions: 'play none none none',
        once: true,
      });

      // Animate footer sections with stagger after delay
      setTimeout(() => {
        const sections = document.querySelectorAll('.footer-section');
        if (sections.length > 0 && footerRef.current) {
          gsap.fromTo(
            '.footer-section',
            { 
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 85%',
              }
            }
          );
        }
      }, 100);

      // Animate huge brand name
      setTimeout(() => {
        if (brandRef.current) {
          gsap.fromTo(
            brandRef.current,
            { 
              opacity: 0,
              scale: 0.95,
              y: 30,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: brandRef.current,
                start: 'top 90%',
              }
            }
          );
        }
      }, 200);

      // Animate bottom bar
      setTimeout(() => {
        const bottomBar = document.querySelector('.footer-bottom');
        if (bottomBar) {
          gsap.fromTo(
            '.footer-bottom',
            { 
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.footer-bottom',
                start: 'top 95%',
              }
            }
          );
        }
      }, 300);
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  const footerLinks = {
    product: [
      { name: 'Browse Jobs', href: '/jobs' },
      { name: 'Find Freelancers', href: '/freelancers' },
      { name: 'Post a Job', href: '/jobs/create' },
      { name: 'Pricing', href: '/pricing' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Payment Guide', href: '/payment-guide' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
    social: [
      { name: 'Twitter', href: 'https://twitter.com' },
      { name: 'LinkedIn', href: 'https://linkedin.com' },
      { name: 'Facebook', href: 'https://facebook.com' },
      { name: 'Instagram', href: 'https://instagram.com' },
    ],
  };

  return (
    <footer ref={footerRef} className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Section - Newsletter (Opal Style) */}
            <div className="lg:col-span-5 footer-section">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                  Subscribe to the
                </h3>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Linkify Newsletter
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
                  Get weekly announcements and product updates directly to your inbox.
                </p>
                
                {/* Newsletter Form */}
                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light dark:focus:ring-brand text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm transition-all"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[50px]"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Section - Navigation Links */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
                {/* Products */}
                <div className="footer-section">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Products
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div className="footer-section">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="footer-section">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social */}
                <div className="footer-section">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Social
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.social.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Huge Brand Name Section */}
        <div
          ref={brandRef}
          className="py-6 md:py-8 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <h2 className="text-[80px] xs:text-[100px] sm:text-[140px] md:text-[180px] lg:text-[250px] xl:text-[350px] font-bold leading-none text-gray-900 dark:text-white select-none break-words text-center">
            Linkify
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom py-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Linkify. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;