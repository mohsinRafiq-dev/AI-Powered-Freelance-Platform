import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database,
  Share2,
  Bell,
  MapPin,
  CreditCard,
  Users,
  Settings,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



const PRIVACY_SECTIONS = [
  {
    id: 1,
    icon: Eye,
    title: 'Information We Collect',
    slug: 'information-collection',
    gradient: 'from-brand to-brand-dark',
    content: [
      {
        subtitle: 'Information You Provide',
        text: 'We collect information you provide directly to us, including: Account information (name, email, password, phone number), Profile information (bio, skills, portfolio, work history, education), Payment information (credit card details, bank account information, billing address), Communications (messages, support tickets, feedback), and Content you post (job postings, proposals, reviews, ratings).'
      },
      {
        subtitle: 'Automatically Collected Information',
        text: 'When you use Linkify, we automatically collect: Device information (IP address, browser type, operating system, device identifiers), Usage data (pages visited, features used, time spent, click patterns), Location data (approximate location based on IP address), Cookies and tracking technologies (preferences, session data, analytics), and Log data (access times, error logs, referrer URLs).'
      },
      {
        subtitle: 'Information from Third Parties',
        text: 'We may receive information from: Social media platforms (if you connect your account), Payment processors (transaction data, fraud detection), Identity verification services (background checks, credential verification), Analytics providers (demographic data, interests), and Marketing partners (campaign performance, conversion data).'
      }
    ]
  },
  {
    id: 2,
    icon: Database,
    title: 'How We Use Your Information',
    slug: 'information-usage',
    gradient: 'from-brand-light to-brand',
    content: [
      {
        subtitle: 'Providing Services',
        text: 'We use your information to: Create and manage your account, facilitate job postings and proposals, process payments and transactions, enable communication between users, provide customer support, personalize your experience, and deliver requested services and features.'
      },
      {
        subtitle: 'Improving Our Platform',
        text: 'We analyze data to: Understand how users interact with Linkify, identify and fix technical issues, develop new features and improvements, conduct research and analytics, test new functionality, optimize performance and user experience, and ensure platform security and reliability.'
      },
      {
        subtitle: 'Communications',
        text: 'We use your contact information to send: Service notifications (account activity, payment confirmations), Marketing communications (new features, promotions, newsletters), Security alerts (unusual activity, policy changes), Support responses (help desk replies, status updates), and Administrative messages (terms updates, maintenance notices).'
      },
      {
        subtitle: 'Legal and Safety',
        text: 'We process information to: Comply with legal obligations, enforce our Terms of Service, protect against fraud and abuse, resolve disputes, prevent illegal activity, protect user safety and security, and respond to legal requests from authorities.'
      }
    ]
  },
  {
    id: 3,
    icon: Share2,
    title: 'Information Sharing & Disclosure',
    slug: 'information-sharing',
    gradient: 'from-brand-dark to-brand-deepest',
    content: [
      {
        subtitle: 'With Other Users',
        text: 'Your profile information is visible to other Linkify users. When you submit proposals or post jobs, relevant information is shared with counterparties. Reviews and ratings you provide are publicly visible. Messages sent through the platform are delivered to recipients.'
      },
      {
        subtitle: 'Service Providers',
        text: 'We share information with third-party service providers who assist us: Payment processors (transaction handling), Cloud hosting providers (data storage), Email service providers (communications), Analytics services (usage insights), Customer support tools (ticket management), Identity verification services (background checks), and Marketing platforms (campaign management).'
      },
      {
        subtitle: 'Business Transfers',
        text: 'If Linkify is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our platform of any change in ownership or use of your information.'
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required by law, court order, or governmental request, or if we believe disclosure is necessary to: Comply with legal processes, enforce our agreements, protect our rights and property, protect user safety, or prevent fraud or security issues.'
      },
      {
        subtitle: 'With Your Consent',
        text: 'We may share your information for other purposes with your explicit consent or at your direction, such as when you authorize a third-party application to access your Linkify account.'
      }
    ]
  },
  {
    id: 4,
    icon: Lock,
    title: 'Data Security',
    slug: 'data-security',
    gradient: 'from-brand to-brand-light',
    content: [
      {
        subtitle: 'Security Measures',
        text: 'We implement comprehensive security measures including: Encryption of data in transit (TLS/SSL) and at rest (AES-256), Secure authentication protocols and password hashing, Regular security audits and vulnerability assessments, Access controls and permission management, Network security and firewalls, Intrusion detection and prevention systems, and Security monitoring and incident response procedures.'
      },
      {
        subtitle: 'Data Storage',
        text: 'Your data is stored on secure servers located in data centers with: Physical security controls (access restrictions, surveillance), Environmental controls (temperature, humidity, fire suppression), Redundant power and network connectivity, Regular backups and disaster recovery plans, and Compliance with industry standards (SOC 2, ISO 27001).'
      },
      {
        subtitle: 'Payment Security',
        text: 'Payment information is handled according to PCI-DSS standards. We do not store full credit card numbers on our servers. Payment processing is handled by certified third-party payment processors with bank-level security.'
      },
      {
        subtitle: 'Security Limitations',
        text: 'While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.'
      }
    ]
  },
  {
    id: 5,
    icon: Settings,
    title: 'Your Privacy Rights',
    slug: 'privacy-rights',
    gradient: 'from-brand-dark to-brand',
    content: [
      {
        subtitle: 'Access and Portability',
        text: 'You have the right to: Access your personal information, request a copy of your data in a portable format, review information we have collected about you, and understand how your data is being used. You can download your data from your account settings or by contacting support.'
      },
      {
        subtitle: 'Correction and Update',
        text: 'You can update most of your information through your account settings. If you need assistance correcting inaccurate information, contact our support team. We will respond to correction requests within 30 days.'
      },
      {
        subtitle: 'Deletion',
        text: 'You have the right to request deletion of your personal information. We will delete your data within 30 days of your request, subject to: Legal retention requirements, ongoing transactions or disputes, fraud prevention and security needs, and backup retention periods (up to 90 days). Some information may remain in anonymized form for analytics.'
      },
      {
        subtitle: 'Opt-Out Rights',
        text: 'You can opt out of: Marketing emails (via unsubscribe link), Promotional notifications (in settings), Personalized advertising (via ad preferences), Cookie tracking (via browser settings), and Data sharing with third parties for marketing (via privacy settings).'
      },
      {
        subtitle: 'Do Not Sell',
        text: 'We do not sell your personal information to third parties. If our practices change, we will update this policy and provide you with opt-out options as required by law.'
      }
    ]
  },
  {
    id: 6,
    icon: Globe,
    title: 'Data Storage and Security',
    slug: 'data-storage',
    gradient: 'from-brand to-brand-dark',
    content: [
      {
        subtitle: 'Data Location',
        text: 'Linkify operates in Pakistan, and your information is stored and processed on secure servers within Pakistan. We comply with Pakistani data protection laws and regulations.'
      },
      {
        subtitle: 'Security Measures',
        text: 'We implement industry-standard security measures including: Encrypted data transmission (SSL/TLS), Secure server infrastructure, Regular security audits, Access controls and authentication, and CNIC verification for user identity protection.'
      },
      {
        subtitle: 'Data Protection',
        text: 'We comply with Pakistani data protection regulations and implement appropriate safeguards to protect your personal information. Your data is protected with encryption both in transit and at rest.'
      },
      {
        subtitle: 'Pakistani Users',
        text: 'As a Pakistan-based platform, we adhere to the Electronic Transactions Ordinance 2002 and other applicable Pakistani laws regarding data protection and privacy. We ensure your information is handled in accordance with local regulations.'
      }
    ]
  },
  {
    id: 7,
    icon: Users,
    title: 'Children\'s Privacy',
    slug: 'childrens-privacy',
    gradient: 'from-brand-light to-brand',
    content: [
      {
        subtitle: 'Age Restrictions',
        text: 'Linkify is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If you are under 18, do not use Linkify or provide any information to us.'
      },
      {
        subtitle: 'Parental Notice',
        text: 'If we learn that we have collected personal information from a child under 18, we will delete that information as quickly as possible. If you believe we have collected information from a child under 18, please contact us immediately at privacy@linkify.com.'
      },
      {
        subtitle: 'Verification',
        text: 'We may request age verification during account creation. Accounts found to belong to users under 18 will be terminated immediately, and associated data will be deleted in accordance with our data retention policies.'
      }
    ]
  },
  {
    id: 8,
    icon: Bell,
    title: 'Cookies & Tracking Technologies',
    slug: 'cookies-tracking',
    gradient: 'from-brand-dark to-brand-deepest',
    content: [
      {
        subtitle: 'Types of Cookies',
        text: 'We use several types of cookies: Essential cookies (required for platform functionality), Preference cookies (remember your settings), Analytics cookies (understand usage patterns), Marketing cookies (deliver relevant ads), and Third-party cookies (from integrated services).'
      },
      {
        subtitle: 'Other Tracking Technologies',
        text: 'In addition to cookies, we use: Web beacons (track email opens and clicks), Pixels (measure ad effectiveness), Local storage (store preferences locally), and Session replay tools (improve user experience).'
      },
      {
        subtitle: 'Managing Cookies',
        text: 'You can control cookies through: Browser settings (block all or specific cookies), Cookie consent manager (on our website), Opt-out tools (from advertising networks), and Do Not Track signals (where supported). Note that disabling certain cookies may limit platform functionality.'
      },
      {
        subtitle: 'Third-Party Analytics',
        text: 'We use third-party analytics services like Google Analytics to understand usage patterns. These services may use cookies and collect information about your use of Linkify and other websites. Review their privacy policies for details on their practices.'
      }
    ]
  },
  {
    id: 9,
    icon: FileText,
    title: 'Data Retention',
    slug: 'data-retention',
    gradient: 'from-brand to-brand-light',
    content: [
      {
        subtitle: 'Retention Periods',
        text: 'We retain your information for as long as necessary to: Provide our services, comply with legal obligations, resolve disputes, enforce agreements, and maintain security. Different types of information have different retention periods based on their purpose and legal requirements.'
      },
      {
        subtitle: 'Active Accounts',
        text: 'While your account is active, we retain all account and profile information. Usage logs are typically retained for 2 years. Communication history is retained for 5 years or as required by law. Transaction records are kept for 7 years for tax and accounting purposes.'
      },
      {
        subtitle: 'Deleted Accounts',
        text: 'After account deletion: Personal information is removed within 30 days, Backups containing your data are deleted within 90 days, Some information may be retained in anonymized form for analytics, and certain information may be retained longer as required by law (e.g., tax records, legal disputes).'
      },
      {
        subtitle: 'Legal Holds',
        text: 'In certain circumstances (ongoing investigations, litigation, regulatory inquiries), we may be required to retain information beyond normal retention periods. We will notify you if your data is subject to a legal hold.'
      }
    ]
  },
  {
    id: 10,
    icon: AlertCircle,
    title: 'Policy Updates & Contact',
    slug: 'updates-contact',
    gradient: 'from-brand-dark to-brand',
    content: [
      {
        subtitle: 'Policy Changes',
        text: 'We may update this Privacy Policy from time to time. We will notify you of material changes by: Posting the updated policy on our website, Sending an email notification to your registered email address, Displaying a prominent notice on the platform, and Requiring acceptance for continued use (for significant changes).'
      },
      {
        subtitle: 'Review Date',
        text: 'The "Last Updated" date at the top of this policy indicates when it was last revised. We encourage you to review this policy periodically to stay informed about how we protect your information.'
      },
      {
        subtitle: 'Contact Information',
        text: 'If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: Email: privacy@linkify.com, Mail: Linkify Privacy Team, [Address], Phone: +1 (555) 123-4567. We will respond to all inquiries within 5 business days.'
      },
      {
        subtitle: 'Data Protection Officer',
        text: 'For users in the EU/EEA, you can contact our Data Protection Officer at: dpo@linkify.com. Our DPO oversees compliance with data protection laws and handles privacy-related inquiries.'
      },
      {
        subtitle: 'Supervisory Authority',
        text: 'If you are in the EU/EEA, you have the right to lodge a complaint with your local data protection supervisory authority if you believe we have violated your privacy rights.'
      }
    ]
  }
];

const TABLE_OF_CONTENTS = PRIVACY_SECTIONS.map(section => ({
  id: section.id,
  title: section.title,
  slug: section.slug,
  icon: section.icon
}));

const YOUR_RIGHTS_SUMMARY = [
  {
    id: 1,
    icon: Eye,
    title: 'Right to Access',
    description: 'Request a copy of your personal data'
  },
  {
    id: 2,
    icon: Download,
    title: 'Right to Portability',
    description: 'Download your data in a portable format'
  },
  {
    id: 3,
    icon: Settings,
    title: 'Right to Correction',
    description: 'Update or correct inaccurate information'
  },
  {
    id: 4,
    icon: Trash2,
    title: 'Right to Deletion',
    description: 'Request deletion of your personal data'
  },
  {
    id: 5,
    icon: Bell,
    title: 'Right to Opt-Out',
    description: 'Opt out of marketing communications'
  },
  {
    id: 6,
    icon: Shield,
    title: 'Right to Object',
    description: 'Object to certain data processing'
  }
];


function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('information-collection');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const tocRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({
        toggleActions: 'play none none none',
      });

      // Animate TOC items
      setTimeout(() => {
        const tocItems = document.querySelectorAll('.toc-item');
        if (tocItems.length > 0) {
          gsap.set('.toc-item', { opacity: 1 });
          gsap.fromTo(
            '.toc-item',
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: tocRef.current,
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate content sections
      setTimeout(() => {
        const contentSections = document.querySelectorAll('.content-section');
        if (contentSections.length > 0) {
          gsap.set('.content-section', { opacity: 1 });
          gsap.fromTo(
            '.content-section',
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: contentRef.current,
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 150);

      // Animate rights cards
      setTimeout(() => {
        const rightsCards = document.querySelectorAll('.rights-card');
        if (rightsCards.length > 0) {
          gsap.set('.rights-card', { opacity: 1 });
          gsap.fromTo(
            '.rights-card',
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.rights-section',
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

      const sections = document.querySelectorAll('.content-section');
      let currentSection = 'information-collection';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (slug) => {
    const element = document.getElementById(slug);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-gray-950 overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 bg-gradient-to-br from-brand via-brand-dark to-brand-deepest dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white bg-[size:32px_32px]" />
        </div>

        {/* Floating Particles */}
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
              <Shield className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
              Your privacy matters to us. Learn how we collect, use, and protect your data.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-white text-sm mb-8"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span>Your Data Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>Full Transparency</span>
              </div>
            </motion.div>

            <p className="text-white/80 text-sm">
              Last updated: November 16, 2025 • Effective immediately
            </p>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto text-white dark:text-gray-950" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Your Rights Summary Section */}
      <section className="rights-section py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Privacy <span className="text-brand dark:text-brand-light">Rights</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              You have control over your personal information
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {YOUR_RIGHTS_SUMMARY.map((right) => (
              <motion.div
                key={right.id}
                whileHover={{ y: -5, scale: 1.02 }}
                className="rights-card"
              >
                <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center mb-4">
                      <right.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {right.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {right.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white px-8 py-6 text-lg">
              Manage Your Privacy Settings
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sticky Table of Contents */}
            <div ref={tocRef} className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-brand" />
                      Table of Contents
                    </h2>
                    
                    <nav className="space-y-2">
                      {TABLE_OF_CONTENTS.map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => scrollToSection(item.slug)}
                          whileHover={{ x: 5 }}
                          className={`toc-item w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                            activeSection === item.slug
                              ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium text-sm">{item.title}</span>
                        </motion.button>
                      ))}
                    </nav>

                    <div className="mt-8 p-4 bg-brand/10 dark:bg-brand/5 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        Questions about privacy?
                      </p>
                      <Button className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white">
                        Contact Privacy Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Content Sections */}
            <div ref={contentRef} className="lg:col-span-8">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <Card className="border-2 border-brand dark:border-brand-light bg-brand/5 dark:bg-brand/10">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Our Commitment to Privacy
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          At Linkify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. We are committed to transparency and giving you control over your personal data.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          By using Linkify, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Privacy Sections */}
              {PRIVACY_SECTIONS.map((section) => (
                <motion.div
                  key={section.id}
                  id={section.slug}
                  initial={{ opacity: 1 }}
                  className="content-section mb-12 scroll-mt-32"
                >
                  <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light transition-all bg-white dark:bg-gray-800">
                    <CardContent className="p-8">
                      {/* Section Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-14 h-14 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <section.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-brand dark:text-brand-light font-medium mb-1">
                            Section {section.id}
                          </div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {section.title}
                          </h2>
                        </div>
                      </div>

                      {/* Section Content */}
                      <div className="space-y-6">
                        {section.content.map((item, idx) => (
                          <div key={idx}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-brand rounded-full"></span>
                              {item.subtitle}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-4">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Contact Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Shield className="h-16 w-16 text-brand dark:text-brand-light mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Your Privacy Matters
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                        We are committed to protecting your privacy and being transparent about our data practices. If you have questions or concerns, our privacy team is here to help.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white">
                          Contact Privacy Team
                        </Button>
                        <Button variant="outline" className="border-2 border-gray-300 dark:border-gray-600">
                          Download Privacy Policy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0
        }}
        onClick={scrollToTop}
        className="fixed bottom-24 md:bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white rounded-full shadow-2xl flex items-center justify-center transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowRight className="h-6 w-6 transform -rotate-90" />
      </motion.button>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
