import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  Send,
  Clock,
  HeadphonesIcon,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const CONTACT_METHODS = [
  {
    id: 1,
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email anytime',
    value: 'support@linkify.pk',
    action: 'mailto:support@linkify.pk',
    gradient: 'from-brand to-brand-dark'
  },
  {
    id: 2,
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 9am to 6pm PKT',
    value: '+92 21 1234 5678',
    action: 'tel:+922112345678',
    gradient: 'from-brand-light to-brand'
  },
  {
    id: 3,
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Available during business hours',
    value: 'Start a conversation',
    action: '#',
    gradient: 'from-brand-dark to-brand-deepest'
  },
  {
    id: 4,
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come say hello',
    value: 'Karachi, Pakistan',
    action: '#',
    gradient: 'from-brand to-brand-light'
  }
];

const OFFICES = [
  {
    id: 1,
    city: 'Karachi',
    country: 'Pakistan',
    address: 'Plot 123, Block 5, Clifton',
    zipCode: '75600',
    phone: '+92 21 1234 5678',
    email: 'karachi@linkify.pk',
    image: '🏙️'
  },
  {
    id: 2,
    city: 'Lahore',
    country: 'Pakistan',
    address: '45 MM Alam Road, Gulberg III',
    zipCode: '54000',
    phone: '+92 42 3456 7890',
    email: 'lahore@linkify.pk',
    image: '🕌'
  },
  {
    id: 3,
    city: 'Islamabad',
    country: 'Pakistan',
    address: 'F-7 Markaz, Blue Area',
    zipCode: '44000',
    phone: '+92 51 2345 6789',
    email: 'islamabad@linkify.pk',
    image: '🏛️'
  }
];

const SUPPORT_OPTIONS = [
  {
    id: 1,
    icon: HeadphonesIcon,
    title: 'Priority Support',
    description: 'For enterprise customers',
    badge: 'Enterprise'
  },
  {
    id: 2,
    icon: MessageSquare,
    title: 'Community Forum',
    description: 'Ask questions and get answers',
    badge: 'Free'
  },
  {
    id: 3,
    icon: Clock,
    title: 'Help Center',
    description: 'Browse our knowledge base',
    badge: 'Self-service'
  }
];

const SOCIAL_LINKS = [
  {
    id: 1,
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com',
    color: 'hover:text-blue-600'
  },
  {
    id: 2,
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com',
    color: 'hover:text-sky-500'
  },
  {
    id: 3,
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com',
    color: 'hover:text-blue-700'
  },
  {
    id: 4,
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    color: 'hover:text-pink-600'
  },
  {
    id: 5,
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com',
    color: 'hover:text-gray-900 dark:hover:text-white'
  }
];

function Contact() {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const officesRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({
        toggleActions: 'play none none none',
      });

      // Animate contact cards
      setTimeout(() => {
        const contactCards = document.querySelectorAll('.contact-card');
        if (contactCards.length > 0) {
          gsap.set('.contact-card', { opacity: 1 });
          gsap.fromTo(
            '.contact-card',
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.contact-methods',
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate office cards
      setTimeout(() => {
        const officeCards = document.querySelectorAll('.office-card');
        if (officeCards.length > 0) {
          gsap.set('.office-card', { opacity: 1 });
          gsap.fromTo(
            '.office-card',
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: officesRef.current,
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 150);

      // Animate support options
      setTimeout(() => {
        const supportCards = document.querySelectorAll('.support-card');
        if (supportCards.length > 0) {
          gsap.set('.support-card', { opacity: 1 });
          gsap.fromTo(
            '.support-card',
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.support-section',
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 200);
    }, heroRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-950 overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 bg-gradient-to-br from-brand via-brand-dark to-brand-deepest dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white bg-[size:32px_32px]" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl mb-8"
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Have a question or need help? We're here for you. Reach out to our Pakistan-based support team.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-white text-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>Live Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>3 Pakistan Offices</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto text-white dark:text-gray-950" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="contact-methods py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your <span className="text-brand dark:text-brand-light">Preferred Way</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Multiple ways to reach us, whichever works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_METHODS.map((method) => (
              <motion.a
                key={method.id}
                href={method.action}
                whileHover={{ y: -8, scale: 1.02 }}
                className="contact-card block"
              >
                <Card className="h-full border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light transition-all bg-white dark:bg-gray-800 hover:shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center`}>
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {method.description}
                    </p>
                    <p className="text-brand dark:text-brand-light font-semibold">
                      {method.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={formRef} className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Send Us a <span className="text-brand dark:text-brand-light">Message</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Fill out the form and we'll get back to you within 24 hours
            </p>
          </motion.div>

          <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-8">
              {formSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-brand dark:focus:border-brand-light focus:ring-0 transition-colors"
                        placeholder="Ahmed Khan"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-brand dark:focus:border-brand-light focus:ring-0 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-brand dark:focus:border-brand-light focus:ring-0 transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="6"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-brand dark:focus:border-brand-light focus:ring-0 transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white py-6 text-lg"
                  >
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Offices Section */}
      <section ref={officesRef} className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-brand dark:text-brand-light">Pakistan Offices</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Visit us in major cities across Pakistan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {OFFICES.map((office) => (
              <motion.div
                key={office.id}
                whileHover={{ y: -8 }}
                className="office-card"
              >
                <Card className="h-full border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light transition-all bg-white dark:bg-gray-800">
                  <CardContent className="p-8">
                    <div className="text-6xl text-center mb-6">
                      {office.image}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                      {office.city}
                    </h3>
                    <p className="text-brand dark:text-brand-light font-semibold text-center mb-6">
                      {office.country}
                    </p>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{office.address}<br />{office.zipCode}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <a href={`tel:${office.phone}`} className="hover:text-brand dark:hover:text-brand-light">
                          {office.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <a href={`mailto:${office.email}`} className="hover:text-brand dark:hover:text-brand-light">
                          {office.email}
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="support-section py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              More Ways to Get <span className="text-brand dark:text-brand-light">Support</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {SUPPORT_OPTIONS.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ x: 5 }}
                className="support-card"
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light transition-all bg-white dark:bg-gray-800 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <option.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-brand/10 text-brand dark:bg-brand-light/10 dark:text-brand-light rounded-full text-sm font-medium">
                        {option.badge}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Follow Us on <span className="text-brand dark:text-brand-light">Social Media</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              Stay connected and up to date with our latest news
            </p>

            <div className="flex justify-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  className={`w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
