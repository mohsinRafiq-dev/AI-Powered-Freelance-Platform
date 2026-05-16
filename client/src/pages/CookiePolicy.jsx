import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cookie, 
  Shield, 
  Settings, 
  Eye,
  BarChart,
  Target,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  Globe,
  ArrowRight,
  ExternalLink,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import { toast } from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const COOKIE_TYPES = [
  {
    id: 1,
    type: 'essential',
    name: 'Essential Cookies',
    icon: Shield,
    description: 'Required for the platform to function properly. Cannot be disabled.',
    gradient: 'from-brand to-brand-dark',
    isRequired: true,
    examples: [
      'Authentication cookies (session management)',
      'Security cookies (CSRF protection)',
      'Load balancing cookies (server distribution)',
      'User input cookies (form data preservation)'
    ],
    duration: 'Session or up to 1 year',
    purpose: 'Enable core functionality and security features'
  },
  {
    id: 2,
    type: 'functional',
    name: 'Functional Cookies',
    icon: Settings,
    description: 'Remember your preferences and enhance your experience.',
    gradient: 'from-brand-light to-brand',
    isRequired: false,
    examples: [
      'Language preferences',
      'Theme settings (dark/light mode)',
      'Currency selection',
      'Timezone settings',
      'Notification preferences'
    ],
    duration: 'Up to 2 years',
    purpose: 'Personalize your experience and remember settings'
  },
  {
    id: 3,
    type: 'analytics',
    name: 'Analytics Cookies',
    icon: BarChart,
    description: 'Help us understand how you use Linkify to improve our services.',
    gradient: 'from-brand-dark to-brand-deepest',
    isRequired: false,
    examples: [
      'Google Analytics cookies (_ga, _gid)',
      'Page view tracking',
      'Feature usage analytics',
      'Performance metrics',
      'Error tracking'
    ],
    duration: 'Up to 2 years',
    purpose: 'Analyze usage patterns and improve platform performance'
  },
  {
    id: 4,
    type: 'marketing',
    name: 'Marketing Cookies',
    icon: Target,
    description: 'Deliver relevant advertisements and measure campaign effectiveness.',
    gradient: 'from-brand to-brand-light',
    isRequired: false,
    examples: [
      'Facebook Pixel',
      'Google Ads conversion tracking',
      'LinkedIn Insight Tag',
      'Retargeting cookies',
      'Ad performance metrics'
    ],
    duration: 'Up to 1 year',
    purpose: 'Show relevant ads and measure marketing effectiveness'
  }
];

const COOKIE_DETAILS = [
  {
    id: 1,
    name: 'session_token',
    type: 'Essential',
    purpose: 'Maintains your logged-in state',
    duration: 'Session',
    domain: 'linkify.com',
    icon: Shield
  },
  {
    id: 2,
    name: 'csrf_token',
    type: 'Essential',
    purpose: 'Protects against cross-site request forgery attacks',
    duration: 'Session',
    domain: 'linkify.com',
    icon: Shield
  },
  {
    id: 3,
    name: 'user_preferences',
    type: 'Functional',
    purpose: 'Stores your theme, language, and display preferences',
    duration: '1 year',
    domain: 'linkify.com',
    icon: Settings
  },
  {
    id: 4,
    name: '_ga',
    type: 'Analytics',
    purpose: 'Google Analytics - distinguishes unique users',
    duration: '2 years',
    domain: '.linkify.com',
    icon: BarChart
  },
  {
    id: 5,
    name: '_gid',
    type: 'Analytics',
    purpose: 'Google Analytics - distinguishes users',
    duration: '24 hours',
    domain: '.linkify.com',
    icon: BarChart
  },
  {
    id: 6,
    name: 'fbp',
    type: 'Marketing',
    purpose: 'Facebook Pixel - delivers and measures ads',
    duration: '90 days',
    domain: '.linkify.com',
    icon: Target
  },
  {
    id: 7,
    name: 'ads_conversion',
    type: 'Marketing',
    purpose: 'Tracks ad conversions and campaign effectiveness',
    duration: '30 days',
    domain: '.linkify.com',
    icon: Target
  }
];

const THIRD_PARTY_SERVICES = [
  {
    id: 1,
    name: 'Google Analytics',
    purpose: 'Website analytics and usage tracking',
    privacy_policy: 'https://policies.google.com/privacy',
    cookies: ['_ga', '_gid', '_gat'],
    icon: BarChart
  },
  {
    id: 2,
    name: 'Facebook',
    purpose: 'Social media integration and advertising',
    privacy_policy: 'https://www.facebook.com/privacy/explanation',
    cookies: ['fbp', 'fr'],
    icon: Target
  },
  {
    id: 3,
    name: 'Stripe',
    purpose: 'Payment processing',
    privacy_policy: 'https://stripe.com/privacy',
    cookies: ['__stripe_mid', '__stripe_sid'],
    icon: Shield
  },
  {
    id: 4,
    name: 'LinkedIn',
    purpose: 'Professional networking and advertising',
    privacy_policy: 'https://www.linkedin.com/legal/privacy-policy',
    cookies: ['li_sugr', 'lidc'],
    icon: Globe
  }
];

const CONTROL_METHODS = [
  {
    id: 1,
    icon: Settings,
    title: 'Cookie Preferences',
    description: 'Use our cookie preference center to manage your choices',
    action: 'Manage Preferences'
  },
  {
    id: 2,
    icon: Globe,
    title: 'Browser Settings',
    description: 'Configure cookie settings directly in your web browser',
    action: 'Browser Help'
  },
  {
    id: 3,
    icon: Eye,
    title: 'Third-Party Opt-Out',
    description: 'Opt out of third-party advertising cookies',
    action: 'Opt-Out Tools'
  }
];



function CookiePolicy() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: true
  });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({
        toggleActions: 'play none none none',
      });

      // Animate cookie type cards
      setTimeout(() => {
        const typeCards = document.querySelectorAll('.cookie-type-card');
        if (typeCards.length > 0) {
          gsap.set('.cookie-type-card', { opacity: 1 });
          gsap.fromTo(
            '.cookie-type-card',
            { opacity: 0, y: 60, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.cookie-types-section',
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate cookie details table
      setTimeout(() => {
        const detailRows = document.querySelectorAll('.cookie-detail-row');
        if (detailRows.length > 0) {
          gsap.set('.cookie-detail-row', { opacity: 1 });
          gsap.fromTo(
            '.cookie-detail-row',
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.cookie-details-section',
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 150);

      // Animate third-party cards
      setTimeout(() => {
        const thirdPartyCards = document.querySelectorAll('.third-party-card');
        if (thirdPartyCards.length > 0) {
          gsap.set('.third-party-card', { opacity: 1 });
          gsap.fromTo(
            '.third-party-card',
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.third-party-section',
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

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePreference = (type) => {
    if (type === 'essential') {
      toast.error('Essential cookies cannot be disabled');
      return;
    }
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSavePreferences = () => {
    // In a real implementation, this would save to localStorage/cookies
    toast.success('Cookie preferences saved successfully!');
    setShowPreferencesModal(false);
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    });
    toast.success('All cookies accepted');
  };

  const handleRejectAll = () => {
    setCookiePreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    });
    toast.success('Only essential cookies enabled');
  };

  return (
    <div className="bg-white dark:bg-gray-950 overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 bg-gradient-to-br from-brand via-brand-dark to-brand-deepest dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white bg-[size:32px_32px]" />
        </div>

        {/* Floating Cookie Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Cookie className="w-8 h-8 text-white/20" />
            </motion.div>
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
              <Cookie className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Cookie Policy
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
              Learn how we use cookies and similar technologies to improve your experience
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-white text-sm mb-8"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Full Control</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>Transparent Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Easy Management</span>
              </div>
            </motion.div>

            <p className="text-white/80 text-sm mb-8">
              Last updated: November 16, 2025
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                onClick={() => setShowPreferencesModal(true)}
                className="bg-white text-brand hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Manage Cookie Preferences
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto text-white dark:text-gray-950" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* What Are Cookies Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-brand dark:border-brand-light bg-brand/5 dark:bg-brand/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      What Are Cookies?
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, enabling key functionality, and helping us understand how you use Linkify.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      We use both first-party cookies (set by Linkify) and third-party cookies (set by other services we use). You have control over which cookies you accept, except for essential cookies which are necessary for the platform to function.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Cookie Types Section */}
      <section className="cookie-types-section py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Types of <span className="text-brand dark:text-brand-light">Cookies We Use</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Understanding different cookie categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {COOKIE_TYPES.map((cookieType) => (
              <motion.div
                key={cookieType.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cookie-type-card"
              >
                <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${cookieType.gradient} rounded-2xl flex items-center justify-center`}>
                        <cookieType.icon className="h-8 w-8 text-white" />
                      </div>
                      {cookieType.isRequired ? (
                        <span className="px-3 py-1 bg-brand/20 text-brand dark:text-brand-light rounded-full text-xs font-semibold">
                          Required
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTogglePreference(cookieType.type)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {cookiePreferences[cookieType.type] ? (
                            <ToggleRight className="h-6 w-6 text-brand" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {cookieType.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {cookieType.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-brand rounded-full"></span>
                          Examples:
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                          {cookieType.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{cookieType.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Details Table Section */}
      <section className="cookie-details-section py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Specific <span className="text-brand dark:text-brand-light">Cookie Details</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Detailed information about individual cookies
            </p>
          </motion.div>

          <Card className="border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Cookie Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Purpose</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {COOKIE_DETAILS.map((cookie) => (
                    <motion.tr
                      key={cookie.id}
                      className="cookie-detail-row hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      initial={{ opacity: 1 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-dark rounded-lg flex items-center justify-center flex-shrink-0">
                            <cookie.icon className="h-4 w-4 text-white" />
                          </div>
                          <code className="text-sm font-mono text-gray-900 dark:text-white">
                            {cookie.name}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cookie.type === 'Essential' 
                            ? 'bg-brand/20 text-brand dark:text-brand-light'
                            : cookie.type === 'Functional'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : cookie.type === 'Analytics'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        }`}>
                          {cookie.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {cookie.purpose}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {cookie.duration}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Third-Party Services Section */}
      <section className="third-party-section py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Third-Party <span className="text-brand dark:text-brand-light">Services</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              External services that may set cookies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {THIRD_PARTY_SERVICES.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -5 }}
                className="third-party-card"
              >
                <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {service.purpose}
                        </p>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Cookies: </span>
                            <span className="font-mono text-xs text-gray-900 dark:text-white">
                              {service.cookies.join(', ')}
                            </span>
                          </div>
                          <a
                            href={service.privacy_policy}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-brand dark:text-brand-light hover:underline"
                          >
                            Privacy Policy
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Control Methods Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How to <span className="text-brand dark:text-brand-light">Control Cookies</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              You have multiple ways to manage your cookie preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONTROL_METHODS.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 bg-gray-50 dark:bg-gray-900 hover:shadow-xl transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand to-brand-dark rounded-2xl flex items-center justify-center mb-6">
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {method.description}
                    </p>
                    <Button 
                      onClick={() => method.id === 1 && setShowPreferencesModal(true)}
                      className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white"
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Impact of Disabling Cookies
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      If you disable certain cookies, some features of Linkify may not work properly. Essential cookies cannot be disabled as they are necessary for basic functionality. Disabling analytics cookies won't affect your experience but will prevent us from improving the platform based on usage data.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      You can always change your preferences later through the cookie preference center or your browser settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Cookie Preferences Modal */}
      <AnimatePresence>
        {showPreferencesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreferencesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Cookie Preferences
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your cookie settings
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPreferencesModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <XCircle className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  {COOKIE_TYPES.map((cookieType) => (
                    <div key={cookieType.id} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${cookieType.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <cookieType.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {cookieType.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {cookieType.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTogglePreference(cookieType.type)}
                          disabled={cookieType.isRequired}
                          className={`flex-shrink-0 ${cookieType.isRequired ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {cookiePreferences[cookieType.type] ? (
                            <ToggleRight className="h-8 w-8 text-brand" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {cookieType.isRequired && (
                        <span className="inline-block px-2 py-1 bg-brand/20 text-brand dark:text-brand-light rounded text-xs font-semibold">
                          Always Active
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white py-6"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 py-6"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 py-6"
                  >
                    Reject All
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0
        }}
        onClick={scrollToTop}
        className="fixed bottom-24 md:bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white rounded-full shadow-2xl flex items-center justify-center transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowRight className="h-6 w-6 transform -rotate-90" />
      </motion.button>

      <Footer />
    </div>
  );
}

export default CookiePolicy;
