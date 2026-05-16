import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  FileText,
  Users,
  Shield,
  CreditCard,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



const HELP_CATEGORIES = [
  {
    id: 1,
    title: 'Getting Started',
    icon: Lightbulb,
    description: 'Learn the basics of Linkify',
    gradient: 'from-brand to-brand-dark',
    articleCount: 8
  },
  {
    id: 2,
    title: 'Account & Profile',
    icon: Users,
    description: 'Manage your account settings',
    gradient: 'from-brand-light to-brand',
    articleCount: 12
  },
  {
    id: 3,
    title: 'Jobs & Projects',
    icon: FileText,
    description: 'Post and find jobs',
    gradient: 'from-brand-dark to-brand-deepest',
    articleCount: 15
  },
  {
    id: 4,
    title: 'Payments & Billing',
    icon: CreditCard,
    description: 'Payment methods and invoices',
    gradient: 'from-brand to-brand-light',
    articleCount: 10
  },
  {
    id: 5,
    title: 'Safety & Security',
    icon: Shield,
    description: 'Keep your account secure',
    gradient: 'from-brand-dark to-brand',
    articleCount: 6
  },
  {
    id: 6,
    title: 'Technical Support',
    icon: Settings,
    description: 'Troubleshooting and fixes',
    gradient: 'from-brand to-brand-dark',
    articleCount: 9
  }
];

const FAQ_DATA = [
  {
    id: 1,
    category: 'General',
    question: 'What is Linkify and how does it work?',
    answer: 'Linkify is a freelancing platform that connects talented professionals with clients who need their services. You can browse jobs, submit proposals, and get hired for projects that match your skills. Clients can post jobs, review freelancer profiles, and hire the best talent for their projects.'
  },
  {
    id: 2,
    category: 'General',
    question: 'How do I create an account?',
    answer: 'Creating an account is easy! Click the "Sign Up" button in the top right corner, fill in your details, choose whether you\'re a freelancer or client, and verify your email address. You\'ll be able to start using Linkify immediately after verification.'
  },
  {
    id: 3,
    category: 'Account',
    question: 'How do I update my profile information?',
    answer: 'Go to your Dashboard and click on "Profile" in the navigation menu. From there, you can edit your personal information, add skills, update your portfolio, and customize your profile settings. Don\'t forget to save your changes!'
  },
  {
    id: 4,
    category: 'Account',
    question: 'Can I have both a freelancer and client account?',
    answer: 'Yes! You can switch between freelancer and client modes from your account settings. This allows you to hire talent for some projects while offering your own services for others.'
  },
  {
    id: 5,
    category: 'Jobs',
    question: 'How do I find jobs that match my skills?',
    answer: 'Use the job search feature with filters for skills, budget, and project type. You can also browse recommended jobs based on your profile, save interesting opportunities, and set up job alerts to get notified of new postings that match your criteria.'
  },
  {
    id: 6,
    category: 'Jobs',
    question: 'What should I include in my proposal?',
    answer: 'A great proposal should include: a personalized greeting, clear understanding of the project requirements, your relevant experience and portfolio samples, proposed timeline and milestones, your rate and total project cost, and any questions you have about the project.'
  },
  {
    id: 7,
    category: 'Payments',
    question: 'How do I get paid for my work?',
    answer: 'Linkify uses a secure escrow system. When a client hires you, they deposit funds into escrow. Once you complete milestones or the full project, the client releases payment to your Linkify account. You can then withdraw funds to your bank account or PayPal.'
  },
  {
    id: 8,
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept JazzCash, Easypaisa, bank transfers, and major debit/credit cards. All payments are processed in Pakistani Rupees (PKR). For withdrawals, you can transfer funds to your Pakistani bank account, JazzCash, or Easypaisa wallet.'
  },
  {
    id: 9,
    category: 'Security',
    question: 'How do I report suspicious activity?',
    answer: 'If you encounter suspicious behavior, scams, or violations of our terms, use the "Report" button on the job posting or user profile. You can also contact our support team directly at support@linkify.com with details about the issue.'
  },
  {
    id: 10,
    category: 'Security',
    question: 'Is my personal information safe?',
    answer: 'Absolutely! We use industry-standard encryption to protect your data, never share your personal information without permission, and comply with GDPR and other privacy regulations. Read our Privacy Policy for more details.'
  },
  {
    id: 11,
    category: 'Technical',
    question: 'What browsers are supported?',
    answer: 'Linkify works best on the latest versions of Chrome, Firefox, Safari, and Edge. We also support mobile browsers on iOS and Android devices. For the best experience, keep your browser updated.'
  },
  {
    id: 12,
    category: 'Technical',
    question: 'I\'m having trouble uploading files. What should I do?',
    answer: 'Make sure your file is under 25MB and in a supported format (PDF, DOC, DOCX, JPG, PNG, ZIP). Check your internet connection, try clearing your browser cache, or try a different browser. If issues persist, contact our support team.'
  }
];

const CONTACT_OPTIONS = [
  {
    id: 1,
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    availability: 'Available 24/7',
    action: 'Start Chat',
    gradient: 'from-brand to-brand-dark'
  },
  {
    id: 2,
    icon: Mail,
    title: 'Email Support',
    description: 'support@linkify.com',
    availability: 'Response within 24 hours',
    action: 'Send Email',
    gradient: 'from-brand-light to-brand'
  },
  {
    id: 3,
    icon: Phone,
    title: 'Phone Support',
    description: '+1 (555) 123-4567',
    availability: 'Mon-Fri, 9AM-6PM EST',
    action: 'Call Now',
    gradient: 'from-brand-dark to-brand-deepest'
  }
];

const QUICK_LINKS = [
  { id: 1, title: 'How to Post a Job', url: '#', icon: FileText },
  { id: 2, title: 'How to Submit a Proposal', url: '#', icon: BookOpen },
  { id: 3, title: 'Understanding Payments', url: '#', icon: CreditCard },
  { id: 4, title: 'Account Security Tips', url: '#', icon: Shield },
  { id: 5, title: 'Platform Fees Explained', url: '#', icon: HelpCircle },
  { id: 6, title: 'Dispute Resolution', url: '#', icon: AlertCircle }
];

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const faqRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({
        toggleActions: 'play none none none',
      });

      // Animate categories
      setTimeout(() => {
        const categoryCards = document.querySelectorAll('.category-card');
        if (categoryCards.length > 0) {
          gsap.set('.category-card', { opacity: 1 });
          gsap.fromTo(
            '.category-card',
            { opacity: 0, y: 60, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: categoriesRef.current,
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate FAQ items
      setTimeout(() => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length > 0) {
          gsap.set('.faq-item', { opacity: 1 });
          gsap.fromTo(
            '.faq-item',
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: faqRef.current,
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 150);

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
              duration: 0.9,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.contact-section',
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

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(FAQ_DATA.map(faq => faq.category))];

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
              <HelpCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              How Can We Help You?
            </h1>
            
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light">
              Search our knowledge base or browse categories to find answers
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 bg-white dark:bg-gray-800 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900 dark:text-white placeholder:text-gray-400 shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-white text-sm"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>500+ Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>Live Chat Available</span>
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

      {/* Help Categories Section */}
      <section ref={categoriesRef} className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by <span className="text-brand dark:text-brand-light">Category</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find answers organized by topic
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HELP_CATEGORIES.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="category-card"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 cursor-pointer group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-sm text-brand dark:text-brand-light font-medium">
                        {category.articleCount} articles
                      </span>
                      <motion.div
                        className="text-brand dark:text-brand-light"
                        whileHover={{ x: 5 }}
                      >
                        →
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Articles
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_LINKS.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all group border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center flex-shrink-0">
                  <link.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand-light transition-colors font-medium">
                  {link.title}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked <span className="text-brand dark:text-brand-light">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Quick answers to common questions
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                className="faq-item"
                initial={{ opacity: 1 }}
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light transition-all bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-start justify-between gap-4 text-left"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {faq.question}
                        </h3>
                        <span className="text-sm text-brand dark:text-brand-light">
                          {faq.category}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-6 w-6 text-brand dark:text-brand-light" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-gray-400" />
                        )}
                      </motion.div>
                    </button>
                    
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedFaq === faq.id ? 'auto' : 0,
                        opacity: expandedFaq === faq.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No FAQs found matching your criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="contact-section py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Still Need <span className="text-brand dark:text-brand-light">Help?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Our support team is here for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONTACT_OPTIONS.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="contact-card"
              >
                <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${option.gradient} rounded-3xl flex items-center justify-center mb-6`}>
                      <option.icon className="h-10 w-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      {option.title}
                    </h3>
                    
                    <p className="text-gray-900 dark:text-white font-medium mb-2">
                      {option.description}
                    </p>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      {option.availability}
                    </p>
                    
                    <Button className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HelpCenter;
