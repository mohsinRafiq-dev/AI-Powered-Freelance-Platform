import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Lock,
  CreditCard,
  Ban,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const TERMS_SECTIONS = [
  {
    id: 1,
    icon: FileText,
    title: 'Acceptance of Terms',
    slug: 'acceptance',
    gradient: 'from-brand to-brand-dark',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing and using Linkify ("Service", "Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this platform.'
      },
      {
        subtitle: 'Modifications',
        text: 'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.'
      },
      {
        subtitle: 'Eligibility',
        text: 'You must be at least 18 years old to use this Service. By using Linkify, you represent and warrant that you are of legal age to form a binding contract and meet all eligibility requirements.'
      }
    ]
  },
  {
    id: 2,
    icon: Users,
    title: 'User Accounts',
    slug: 'accounts',
    gradient: 'from-brand-light to-brand',
    content: [
      {
        subtitle: 'Account Registration',
        text: 'To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.'
      },
      {
        subtitle: 'Account Security',
        text: 'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party and to notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.'
      },
      {
        subtitle: 'Account Types',
        text: 'Linkify offers two types of accounts: Freelancer accounts and Client accounts. Users may maintain both types simultaneously. Each account type has specific features, responsibilities, and obligations as outlined in our platform documentation.'
      },
      {
        subtitle: 'Account Termination',
        text: 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.'
      }
    ]
  },
  {
    id: 3,
    icon: Shield,
    title: 'User Conduct & Responsibilities',
    slug: 'conduct',
    gradient: 'from-brand-dark to-brand-deepest',
    content: [
      {
        subtitle: 'Prohibited Activities',
        text: 'You agree not to engage in any of the following prohibited activities: (a) violating laws and regulations; (b) infringing on intellectual property rights; (c) transmitting viruses or malicious code; (d) spamming or phishing; (e) impersonating others; (f) harassment or hate speech; (g) manipulating the platform or circumventing security measures.'
      },
      {
        subtitle: 'Content Standards',
        text: 'All content you post, upload, or share on Linkify must be accurate, lawful, and not misleading. You must own or have the necessary rights to all content you submit. Content must not be defamatory, obscene, threatening, or violate any third-party rights.'
      },
      {
        subtitle: 'Professional Conduct',
        text: 'Users agree to conduct themselves professionally, communicate respectfully, deliver work as promised, meet agreed-upon deadlines, and resolve disputes amicably. Freelancers must accurately represent their skills and experience. Clients must provide clear project requirements and timely feedback.'
      },
      {
        subtitle: 'Reporting Violations',
        text: 'If you become aware of any violations of these Terms, please report them to us immediately at support@linkify.com. We take violations seriously and will investigate all reports promptly.'
      }
    ]
  },
  {
    id: 4,
    icon: CreditCard,
    title: 'Payment Terms',
    slug: 'payments',
    gradient: 'from-brand to-brand-light',
    content: [
      {
        subtitle: 'Service Fees',
        text: 'Linkify charges service fees for successful transactions. Freelancers pay a service fee of 10% on earnings up to Rs. 25,000, 5% on earnings between Rs. 25,001 and Rs. 500,000, and 3% on earnings over Rs. 500,000 with a single client. Clients pay a 3% processing fee on all payments.'
      },
      {
        subtitle: 'Payment Processing',
        text: 'All payments are processed through our secure payment system in Pakistani Rupees (PKR). We support JazzCash, Easypaisa, debit cards, credit cards, and bank transfers. Payments are held in escrow until project milestones are completed and approved by the client.'
      },
      {
        subtitle: 'Withdrawals',
        text: 'Freelancers may withdraw funds from their Linkify account to their Pakistani bank account, JazzCash, or Easypaisa wallet. Withdrawals are processed within 3-5 business days. A minimum balance of Rs. 2,500 is required for withdrawal. We reserve the right to hold funds for up to 14 days for security purposes.'
      },
      {
        subtitle: 'Refunds & Disputes',
        text: 'Refund requests must be submitted within 30 days of payment. We will review all refund requests on a case-by-case basis. In the event of a dispute, funds will be held in escrow until the dispute is resolved through our resolution process or by mutual agreement.'
      },
      {
        subtitle: 'Tax Obligations',
        text: 'Users are responsible for determining and paying all applicable taxes in Pakistan associated with their use of the Service. Linkify provides tax documentation as required by Pakistani tax laws but is not responsible for users\' tax obligations. Please consult with a Pakistani tax professional regarding your obligations.'
      }
    ]
  },
  {
    id: 5,
    icon: Scale,
    title: 'Intellectual Property',
    slug: 'intellectual-property',
    gradient: 'from-brand-dark to-brand',
    content: [
      {
        subtitle: 'Platform Content',
        text: 'The Service and its original content, features, and functionality are owned by Linkify and are protected by Pakistani intellectual property laws, copyright, trademark, and other applicable regulations.'
      },
      {
        subtitle: 'User Content',
        text: 'You retain all rights to content you submit, post, or display on or through the Service. By submitting content, you grant Linkify a non-exclusive, royalty-free license within Pakistan to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content for the purpose of operating and providing the Service.'
      },
      {
        subtitle: 'Work Product',
        text: 'Unless otherwise agreed in writing, all work product created by a Freelancer for a Client becomes the property of the Client upon full payment. Freelancers may showcase completed work in their portfolio unless prohibited by a non-disclosure agreement.'
      },
      {
        subtitle: 'Trademark Usage',
        text: 'Linkify\'s trademarks, logos, and service marks are owned by Linkify. You may not use these in connection with any product or service without our prior written permission.'
      }
    ]
  },
  {
    id: 6,
    icon: Lock,
    title: 'Privacy & Data Protection',
    slug: 'privacy',
    gradient: 'from-brand to-brand-dark',
    content: [
      {
        subtitle: 'Privacy Policy',
        text: 'Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding your personal information.'
      },
      {
        subtitle: 'Data Collection',
        text: 'We collect information you provide directly to us, information we obtain automatically when you use the Service, and information from other sources. This includes account information, profile data, payment information, communications, and usage data.'
      },
      {
        subtitle: 'Data Usage',
        text: 'We use collected data to provide and improve the Service, process transactions, send notifications, prevent fraud, comply with legal obligations, and for other purposes with your consent.'
      },
      {
        subtitle: 'Data Security',
        text: 'We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.'
      }
    ]
  },
  {
    id: 7,
    icon: Ban,
    title: 'Limitation of Liability',
    slug: 'liability',
    gradient: 'from-brand-light to-brand',
    content: [
      {
        subtitle: 'Service Disclaimer',
        text: 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Linkify makes no warranties, expressed or implied, regarding the Service, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.'
      },
      {
        subtitle: 'Limitation of Damages',
        text: 'To the maximum extent permitted by law, Linkify shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.'
      },
      {
        subtitle: 'User Interactions',
        text: 'Linkify is not responsible for the conduct of any user of the Service, whether online or offline. You agree to take reasonable precautions in all interactions with other users. We do not verify the identity of users or the accuracy of information provided by users.'
      },
      {
        subtitle: 'Third-Party Links',
        text: 'The Service may contain links to third-party websites or services that are not owned or controlled by Linkify. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.'
      },
      {
        subtitle: 'Maximum Liability',
        text: 'Linkify\'s total liability to you for all claims arising from your use of the Service shall not exceed the amount you paid to Linkify in the twelve months preceding the claim, or Rs. 5,000, whichever is greater.'
      }
    ]
  },
  {
    id: 8,
    icon: AlertCircle,
    title: 'Dispute Resolution',
    slug: 'disputes',
    gradient: 'from-brand-dark to-brand-deepest',
    content: [
      {
        subtitle: 'Informal Resolution',
        text: 'If you have a dispute with Linkify, you agree to first contact us and attempt to resolve the dispute informally by sending a written notice to support@linkify.com. We will attempt to resolve the dispute through good-faith negotiation.'
      },
      {
        subtitle: 'Arbitration Agreement',
        text: 'If informal resolution fails, you agree that any dispute arising out of or relating to these Terms or the Service will be resolved through binding arbitration, rather than in court, except that you may assert claims in small claims court if your claims qualify.'
      },
      {
        subtitle: 'Class Action Waiver',
        text: 'You agree to resolve disputes with Linkify on an individual basis. You agree not to bring or participate in any class, consolidated, or representative action against Linkify.'
      },
      {
        subtitle: 'Governing Law',
        text: 'These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Linkify operates, without regard to its conflict of law provisions.'
      }
    ]
  },
  {
    id: 9,
    icon: Clock,
    title: 'Term & Termination',
    slug: 'termination',
    gradient: 'from-brand to-brand-light',
    content: [
      {
        subtitle: 'Term',
        text: 'These Terms remain in full force and effect while you use the Service. You may terminate your account at any time by contacting us or using the account deletion feature in your settings.'
      },
      {
        subtitle: 'Termination by Linkify',
        text: 'We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.'
      },
      {
        subtitle: 'Effect of Termination',
        text: 'Upon termination, all rights granted to you under these Terms will immediately cease. You will no longer have access to your account or any content associated with it. Provisions regarding intellectual property, disclaimers, limitations of liability, and dispute resolution will survive termination.'
      },
      {
        subtitle: 'Outstanding Obligations',
        text: 'Termination of your account does not relieve you of any obligations incurred prior to termination, including payment obligations. Any funds owed to you will be released according to our standard procedures after termination.'
      }
    ]
  },
  {
    id: 10,
    icon: FileText,
    title: 'General Provisions',
    slug: 'general',
    gradient: 'from-brand-dark to-brand',
    content: [
      {
        subtitle: 'Entire Agreement',
        text: 'These Terms constitute the entire agreement between you and Linkify regarding the use of the Service, superseding any prior agreements between you and Linkify relating to your use of the Service.'
      },
      {
        subtitle: 'Severability',
        text: 'If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.'
      },
      {
        subtitle: 'Waiver',
        text: 'No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and Linkify\'s failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.'
      },
      {
        subtitle: 'Assignment',
        text: 'You may not assign or transfer these Terms or your rights hereunder, in whole or in part, without our prior written consent. We may assign these Terms at any time without notice or consent.'
      },
      {
        subtitle: 'Contact Information',
        text: 'If you have any questions about these Terms, please contact us at legal@linkify.com or by mail at Linkify Legal Department, [Address]. We will respond to all inquiries within 5 business days.'
      }
    ]
  }
];

const TABLE_OF_CONTENTS = TERMS_SECTIONS.map(section => ({
  id: section.id,
  title: section.title,
  slug: section.slug,
  icon: section.icon
}));


function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');
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
    }, heroRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button
      setShowBackToTop(window.scrollY > 500);

      // Update active section
      const sections = document.querySelectorAll('.content-section');
      let currentSection = 'acceptance';
      
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
              <Scale className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
              Last updated: November 16, 2025
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-white text-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Effective immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Legally binding</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Read carefully</span>
              </div>
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
                        Have questions about our terms?
                      </p>
                      <Button className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white">
                        Contact Legal Team
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
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Important Notice
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          Please read these Terms of Service carefully before using Linkify. By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Terms Sections */}
              {TERMS_SECTIONS.map((section, index) => (
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

              {/* Acceptance Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-brand dark:text-brand-light mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Thank You for Reading
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                      By continuing to use Linkify, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white">
                        I Accept the Terms
                      </Button>
                      <Button variant="outline" className="border-2 border-gray-300 dark:border-gray-600">
                        Download PDF Copy
                      </Button>
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

export default TermsOfService;
