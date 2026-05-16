import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowRight, 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Star,
  Code,
  Palette,
  PenTool,
  Video as VideoIcon,
  DollarSign,
  Clock,
  Shield,
  Zap,
  Sparkles,
  Award,
  Target,
  Plus,
  FileText,
  User
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Footer from "../components/layout/Footer";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


const HERO_IMAGES = {
  background: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&q=80",
  main: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80",
  design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop&q=80",
  meeting: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=400&fit=crop&q=80",
};

const USER_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
];

const TRUST_INDICATORS = [
  { icon: CheckCircle, text: "No credit card required" },
  { icon: Shield, text: "Secure payments" },
  { icon: Clock, text: "24/7 support" }
];

const STATS_DATA = [
  { number: "25K+", label: "Active Freelancers", icon: Users },
  { number: "15K+", label: "Projects Completed", icon: Briefcase },
  { number: "98%", label: "Client Satisfaction", icon: Award },
  { number: "Pakistan", label: "Serving Pakistan", icon: Target }
];

const CATEGORIES_DATA = [
  { 
    icon: Code, 
    name: "Development", 
    jobs: "850+ jobs", 
    gradient: "from-brand/90 to-brand-dark",
    bgHover: "group-hover:from-brand/10 group-hover:to-brand-dark/10",
    iconBg: "from-brand to-brand-dark"
  },
  { 
    icon: Palette, 
    name: "Design", 
    jobs: "620+ jobs", 
    gradient: "from-brand-light/90 to-brand",
    bgHover: "group-hover:from-brand-light/10 group-hover:to-brand/10",
    iconBg: "from-brand-light to-brand"
  },
  { 
    icon: PenTool, 
    name: "Writing", 
    jobs: "480+ jobs", 
    gradient: "from-brand-dark/90 to-brand-deepest",
    bgHover: "group-hover:from-brand-dark/10 group-hover:to-brand-deepest/10",
    iconBg: "from-brand-dark to-brand-deepest"
  },
  { 
    icon: VideoIcon, 
    name: "Video Editing", 
    jobs: "350+ jobs", 
    gradient: "from-brand to-brand-light",
    bgHover: "group-hover:from-brand/10 group-hover:to-brand-light/10",
    iconBg: "from-brand to-brand-light"
  },
];

const FEATURES_DATA = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your transactions are safe with escrow system and local payment gateways like JazzCash and Easypaisa.",
    gradient: "from-brand to-brand-dark",
    glowColor: "brand"
  },
  {
    icon: Zap,
    title: "Fast Hiring",
    description: "Find and hire talented Pakistani freelancers within hours, not days.",
    gradient: "from-brand-light to-brand",
    glowColor: "brand-light"
  },
  {
    icon: Users,
    title: "Verified Talent",
    description: "All freelancers are verified with CNIC and reviewed to ensure quality and authenticity.",
    gradient: "from-brand-dark to-brand-deepest",
    glowColor: "brand-dark"
  },
  {
    icon: DollarSign,
    title: "Fair Pricing in PKR",
    description: "Competitive rates in Pakistani Rupees with transparent pricing and no hidden fees.",
    gradient: "from-brand to-brand-light",
    glowColor: "brand"
  }
];

const PARTNERS_ROW1 = [
  { name: 'JazzCash', logo: 'https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png' },
  { name: 'Easypaisa', logo: 'https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png' },
  { name: 'NayaPay', logo: 'https://crystalpng.com/wp-content/uploads/2025/09/nayapay-logo-768x768.png' },
  { name: 'SadaPay', logo: 'https://image.pngaaa.com/228/7678228-middle.png' },
  { name: 'Visa', logo: 'https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png' },
  { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg' },
  { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
  { name: 'Figma', logo: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png' },
];

const PARTNERS_ROW2 = [
  { name: 'MongoDB', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-mongodb-logo-icon-download-in-svg-png-gif-file-formats--wordmark-programming-langugae-freebies-pack-logos-icons-1175140.png' },
  { name: 'Stripe', logo: 'https://cdn.freebiesupply.com/logos/large/2x/stripe-logo-png-transparent.png' },
  { name: 'AWS', logo: 'https://logos-world.net/wp-content/uploads/2021/08/Amazon-Web-Services-AWS-Logo.png' },
  { name: 'GitHub', logo: 'https://cdn-icons-png.flaticon.com/512/25/25231.png' },
  { name: 'Vercel', logo: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png' },
  { name: 'Tailwind CSS', logo: 'https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg' },
  { name: 'TypeScript', logo: 'https://cdn.iconscout.com/icon/free/png-256/free-typescript-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-7-pack-logos-icons-2945272.png' },
  { name: 'Express', logo: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/expressjs_logo_icon_169185.png' },
];

const TESTIMONIALS_DATA = [
  {
    name: "Ayesha Khan",
    role: "Graphic Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    content: "Linkify helped me connect with clients across Pakistan. The platform is easy to use and payments are secure through local methods like JazzCash.",
    rating: 5
  },
  {
    name: "Ahmed Hassan",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    content: "Best freelancing platform for Pakistani developers. Fast payments in PKR and quality projects from local businesses.",
    rating: 5
  },
  {
    name: "Fatima Malik",
    role: "Content Writer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    content: "The community is supportive and I love working with Pakistani clients who understand our culture and work ethics. Highly recommend!",
    rating: 5
  }
];

const BENTO_IMAGES = [
  { src: HERO_IMAGES.design, alt: "Designer at work", badge: "Design", icon: Palette },
  { src: HERO_IMAGES.meeting, alt: "Remote meeting", badge: "Meeting", icon: VideoIcon }
];

const SOCIAL_PROOF_ITEMS = [
  { icon: Star, text: "4.9/5 rating", color: "text-yellow-300 fill-yellow-300" },
  { icon: Users, text: "25K+ Pakistani users", color: "" },
  { icon: TrendingUp, text: "Growing fast", color: "" }
];

function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Initialize smooth scroll
  useSmoothScroll();
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const categoriesRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Scroll-based parallax
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 200]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 0.8]);

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Smoother ScrollTrigger defaults
      ScrollTrigger.defaults({
        toggleActions: 'play none none none',
        scroller: 'body',
      });

      // Animate stats on scroll with delay to ensure visibility
      setTimeout(() => {
        const statItems = document.querySelectorAll('.stat-item');
        if (statItems.length > 0) {
          gsap.set('.stat-item', { opacity: 1 });
          gsap.fromTo(
            '.stat-item',
            { 
              opacity: 0, 
              y: 60,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              stagger: 0.2,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate category cards with 3D effect
      setTimeout(() => {
        const categoryCards = document.querySelectorAll('.category-card');
        if (categoryCards.length > 0) {
          gsap.set('.category-card', { opacity: 1 });
          gsap.fromTo(
            '.category-card',
            { 
              opacity: 0, 
              y: 80,
              rotateX: 15,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 1.2,
              stagger: 0.15,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: categoriesRef.current,
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 150);

      // Animate features with stagger
      setTimeout(() => {
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
          gsap.set('.feature-card', { opacity: 1 });
          gsap.fromTo(
            '.feature-card',
            { 
              opacity: 0, 
              y: 70,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: featuresRef.current,
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 200);

      // Animate testimonials with slide in
      setTimeout(() => {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        if (testimonialCards.length > 0) {
          gsap.set('.testimonial-card', { opacity: 1 });
          gsap.fromTo(
            '.testimonial-card',
            { 
              opacity: 0,
              x: -80,
              scale: 0.95
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.testimonials-section',
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 250);

      // Animate CTA section with zoom
      setTimeout(() => {
        const ctaContent = document.querySelectorAll('.cta-content');
        if (ctaContent.length > 0) {
          gsap.set('.cta-content', { opacity: 1 });
          gsap.fromTo(
            '.cta-content',
            { 
              opacity: 0,
              scale: 0.85,
              y: 60
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 300);

      // Text reveal animation for headings
      setTimeout(() => {
        const textReveal = document.querySelectorAll('.text-reveal');
        if (textReveal.length > 0) {
          gsap.set('.text-reveal', { opacity: 1 });
          gsap.fromTo(
            '.text-reveal',
            { 
              opacity: 0,
              y: 40
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              stagger: 0.1,
              scrollTrigger: {
                trigger: '.text-reveal',
                start: 'top 85%',
                once: true,
              }
            }
          );
        }
      }, 100);
    
    }, statsRef);
    
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Authenticated Hero Section - Same style as non-authenticated
  const renderAuthenticatedHero = () => {
    const isFreelancer = user?.role === 'freelancer';
    
    return (
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-0 md:pt-0"
      >
        {/* Background Image - Same as non-authenticated */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGES.background}
            alt="Team working together" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/60 via-brand/50 to-brand-deepest/60 dark:from-gray-900/70 dark:via-gray-800/65 dark:to-black/70" />
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 z-[1] opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-grid-white bg-[size:32px_32px]" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {[...Array(20)].map((_, i) => (
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
        
        {/* Main Content Container */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-[10]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="relative z-10">
              {/* Trust Badge - Personalized */}
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="mb-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white border border-white/30 shadow-2xl hover:bg-white/30 transition-all duration-300 cursor-pointer">
                  <motion.span 
                    className="relative flex h-2 w-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </motion.span>
                  <Sparkles className="w-4 h-4 text-white" />
                  {isFreelancer ? 'Freelancer Account Active' : 'Client Account Active'}
                </span>
              </motion.div>
              
              {/* Main Heading - Personalized */}
              <motion.h1 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-white"
              >
                <span className="block text-white">Welcome back,</span>
                <motion.span 
                  className="block mt-2 bg-gradient-to-r from-brand-light via-white to-brand-light bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  {user?.name?.split(' ')[0]}! 👋
                </motion.span>
              </motion.h1>
              
              {/* Subtitle - Personalized */}
              <motion.p 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="text-xl md:text-2xl mb-12 text-white max-w-2xl leading-relaxed font-light"
              >
                {isFreelancer 
                  ? "Ready to discover new opportunities and grow your freelancing career across Pakistan."
                  : "Let's find the perfect talent for your projects and build something amazing together."}
              </motion.p>

              {/* CTA Buttons - Personalized */}
              <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="group bg-white dark:bg-brand text-brand dark:text-white hover:bg-brand-light dark:hover:bg-brand-dark text-lg px-10 py-6 h-auto w-full sm:w-auto shadow-2xl hover:shadow-brand-lg transition-all duration-300 font-semibold relative overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand dark:from-brand-dark dark:to-brand-deepest"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </motion.div>
                </Link>
                <Link to={isFreelancer ? '/jobs' : '/jobs/create'}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="group border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-brand backdrop-blur-sm text-lg px-10 py-6 h-auto transition-all duration-300 font-semibold">
                      {isFreelancer ? 'Browse Jobs' : 'Post a Job'}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
              {/* Trust Indicators - Personalized */}
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="mt-16 flex flex-wrap gap-8 text-white text-sm"
              >
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>{isFreelancer ? 'Active since ' + new Date().getFullYear() : 'Verified client'}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Shield className="h-5 w-5" />
                  <span>Secure account</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Clock className="h-5 w-5" />
                  <span>24/7 support</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Same Bento Grid as non-authenticated */}
            {renderBentoGrid()}
            {renderSimpleBento()}
          </div>
        </div>

        {/* Smooth Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0 z-[11]">
          <svg className="w-full h-auto text-white dark:text-gray-950" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <motion.path 
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.section>
    );
  };

  const renderTrustBadge = () => (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="mb-8"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-white border border-white/30 shadow-2xl hover:bg-white/30 transition-all duration-300 cursor-pointer">
        <motion.span 
          className="relative flex h-2 w-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </motion.span>
        <Sparkles className="w-4 h-4 text-white" />
        Join 25,000+ freelancers across Pakistan
      </span>
    </motion.div>
  );

  const renderCTAButtons = () => {
    if (isAuthenticated) {
      return (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
          <p className="text-lg mb-6 text-white">Welcome back, <span className="font-semibold">{user?.name}</span>! 👋</p>
          <Link to="/dashboard">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="group bg-white text-brand hover:bg-brand-light text-lg px-10 py-6 h-auto shadow-2xl hover:shadow-brand-lg transition-all duration-300">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-4">
        <Link to="/register">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="group bg-white dark:bg-brand text-brand dark:text-white hover:bg-brand-light dark:hover:bg-brand-dark text-lg px-10 py-6 h-auto w-full sm:w-auto shadow-2xl hover:shadow-brand-lg transition-all duration-300 font-semibold relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand dark:from-brand-dark dark:to-brand-deepest"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
        </Link>
        <Link to="/login">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" className="group border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-brand backdrop-blur-sm text-lg px-10 py-6 h-auto transition-all duration-300 font-semibold">
              Sign In
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    );
  };

  const renderBentoGrid = () => (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="relative hidden xl:block z-10">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
      
      {/* Main Image Container with Bento Grid Layout */}
      <div className="relative grid grid-cols-2 gap-4">
        {/* Large Main Image - Top Left */}
        <motion.div 
          className="col-span-2 relative rounded-3xl overflow-visible shadow-2xl h-80"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Image Container with overflow hidden */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20 z-10" />
            <img src={HERO_IMAGES.main} alt="Developer working on laptop" className="w-full h-full object-cover" />
          </div>
          
          {/* Floating Achievement Badge - Moved to top-left to avoid overlap */}
          <motion.div
            className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 z-20"
            animate={{ y: [-10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Top Rated</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Pro Seller</p>
              </div>
            </div>
          </motion.div>

          {/* Live Stats Badge - Moved to bottom-right */}
          <motion.div
            className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl px-4 py-2 z-20 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">1,234 Active Now</p>
          </motion.div>
        </motion.div>

        {/* Small Images - Bottom Row */}
        {BENTO_IMAGES.map((img, index) => (
          <motion.div 
            key={index}
            className="relative rounded-2xl overflow-hidden shadow-xl h-40"
            whileHover={{ scale: 1.05, rotate: index === 0 ? -2 : 2 }}
            animate={{ y: index === 0 ? [10, 0] : [-10, 0] }}
            transition={{ 
              duration: index === 0 ? 4 : 5, 
              repeat: Infinity, 
              repeatType: "reverse", 
              ease: "easeInOut" 
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-pink-500/20 to-rose-500/20' : 'from-green-500/20 to-emerald-500/20'} z-10`} />
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            
            {/* Category Badge */}
            <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1 z-20">
              <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                <img.icon className="h-3 w-3" />
                {img.badge}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Floating User Avatars - Adjusted position */}
        <motion.div
          className="absolute -left-6 top-1/4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 z-40"
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {USER_AVATARS.map((avatar, i) => (
                <img key={i} src={avatar} alt={`User ${i + 1}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-lg" />
              ))}
            </div>
            <div className="bg-gradient-to-r from-brand to-brand-dark text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">
              +99
            </div>
          </div>
        </motion.div>

        {/* Project Success Card - Moved further right and adjusted timing */}
        <motion.div
          className="absolute -top-8 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 z-40"
          animate={{ y: [-12, 0], rotate: [-2, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
        >
          <div className="flex items-start gap-3 min-w-[180px]">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Project Delivered</p>
              <p className="font-bold text-gray-900 dark:text-white">+Rs. 125,000</p>
              <p className="text-xs text-green-500 font-medium whitespace-nowrap">2 hours ago</p>
            </div>
          </div>
        </motion.div>

        {/* Rating Card - Adjusted position to avoid overlap */}
        <motion.div
          className="absolute -bottom-6 -right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 z-40"
          animate={{ y: [12, 0], rotate: [2, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
        >
          <div className="text-center min-w-[100px]">
            <div className="flex gap-1 justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Avg Rating</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Simplified version for tablets (lg screens) - fewer floating elements
  const renderSimpleBento = () => (
    <motion.div 
      initial={{ opacity: 1 }} 
      animate={{ opacity: 1 }} 
      className="relative hidden lg:block xl:hidden z-10"
    >
      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
      
      {/* Simplified Grid - Just main image */}
      <div className="relative">
        <motion.div 
          className="relative rounded-3xl overflow-hidden shadow-2xl h-96"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20 z-10" />
          <img src={HERO_IMAGES.main} alt="Developer working on laptop" className="w-full h-full object-cover" />
          
          {/* Only Achievement Badge */}
          <motion.div
            className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 z-20"
            animate={{ y: [-10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Top Rated</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Pro Seller</p>
              </div>
            </div>
          </motion.div>

          {/* Rating Badge */}
          <motion.div
            className="absolute bottom-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 z-20"
            animate={{ y: [10, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <div className="text-center">
              <div className="flex gap-1 justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Stats Below - REMOVED to avoid duplication */}
      </div>
    </motion.div>
  );

  const categories = CATEGORIES_DATA;
  const features = FEATURES_DATA;
  const stats = STATS_DATA;
  const testimonials = TESTIMONIALS_DATA;

  return (
    <div className="bg-white dark:bg-gray-950 overflow-hidden pb-24 md:pb-0">
      {/* Hero Section - Conditional based on authentication */}
      {isAuthenticated ? (
        renderAuthenticatedHero()
      ) : (
        <motion.section 
          ref={heroRef}
          className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950 pt-0 md:pt-0"
        >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGES.background}
            alt="Team working together" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay - Further reduced opacity */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/60 via-brand/50 to-brand-deepest/60 dark:from-gray-900/70 dark:via-gray-800/65 dark:to-black/70" />
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 z-[1] opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-grid-white bg-[size:32px_32px]" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {[...Array(20)].map((_, i) => (
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
        
        {/* Main Content Container */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-[10]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="relative z-10">
              {/* Trust Badge with Magnetic Effect */}
              {renderTrustBadge()}
              
              {/* Main Heading with Letter Animation */}
              <motion.h1 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-white"
              >
                <span className="block text-white">Find The Perfect</span>
                <motion.span 
                  className="block mt-2 bg-gradient-to-r from-brand-light via-white to-brand-light bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Freelancer or Job
                </motion.span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="text-xl md:text-2xl mb-12 text-white max-w-2xl leading-relaxed font-light"
              >
                Pakistan's leading freelancing platform. Connect with talented professionals or discover exciting opportunities across the country.
              </motion.p>

              {/* CTA Buttons with Hover Effects */}
              {renderCTAButtons()}
              
              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="mt-16 flex flex-wrap gap-8 text-white text-sm"
              >
                {TRUST_INDICATORS.map((item, i) => (
                  <motion.div 
                    key={i}
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Side - Hero Image */}
            {/* Full Bento Grid for XL+ screens */}
            {renderBentoGrid()}
            
            {/* Simplified version for LG screens (tablets) */}
            {renderSimpleBento()}
          </div>
        </div>

        {/* Smooth Wave Transition */}
        <div className="absolute bottom-0 left-0 right-0 z-[11]">
          <svg className="w-full h-auto text-white dark:text-gray-950" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <motion.path 
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.section>
      )}

      {/* Stats Section with Counter Animation */}
      <section ref={statsRef} className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #84A98C 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '40px 40px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="stat-item text-center group"
              >
                <div className="relative">
                  {/* Icon */}
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand to-brand-dark rounded-2xl flex items-center justify-center shadow-lg"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      boxShadow: "0 20px 40px rgba(132, 169, 140, 0.4)"
                    }}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    className="text-4xl md:text-6xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {stat.number}
                  </motion.div>
                  
                  {/* Decorative Line */}
                  <motion.div 
                    className="w-16 h-1 bg-gradient-brand mx-auto rounded-full mb-3"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  />
                </div>
                <div className="text-brand-deeper dark:text-brand-light font-medium text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section with 3D Tilt Effect */}
      <section ref={categoriesRef} className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Decorative Blur Circles */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-brand/10 dark:bg-brand/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 text-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-brand-deepest dark:text-white">
              Popular <span className="text-brand dark:text-brand-light">Categories</span>
            </h2>
            <p className="text-xl text-brand-deeper dark:text-gray-300 max-w-2xl mx-auto font-light">
              Explore opportunities across various fields
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -12,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="category-card"
              >
                <Card className="group relative overflow-hidden h-full hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
                  {/* Gradient Background on Hover - Fixed transition issue */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.iconBg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Icon Container with Brand Colors */}
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${category.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}
                      whileHover={{ 
                        scale: 1.15,
                        rotate: [-5, 5],
                      }}
                      transition={{ 
                        rotate: { duration: 0.3, repeat: 2, repeatType: "reverse" },
                        scale: { type: "spring", stiffness: 300 }
                      }}
                    >
                      <category.icon className="h-10 w-10 text-white drop-shadow-lg" strokeWidth={1.5} />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-brand dark:group-hover:text-brand-light font-medium flex items-center justify-center gap-2 transition-colors">
                      <Briefcase className="h-4 w-4" />
                      {category.jobs}
                    </p>
                    
                    {/* Animated Arrow */}
                    <motion.div 
                      className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="h-5 w-5 mx-auto text-brand dark:text-brand-light" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Magnetic Effect */}
      <section ref={featuresRef} className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-grid-brand/10 bg-[size:32px_32px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 text-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-brand-deepest dark:text-white">
              Why Choose <span className="text-brand dark:text-brand-light">Linkify</span>
            </h2>
            <p className="text-xl text-brand-deeper dark:text-gray-300 max-w-2xl mx-auto font-light">
              The platform that puts your success first
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="feature-card"
              >
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative overflow-hidden">
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
                  
                  <CardContent className="p-8 relative">
                    {/* Floating Icon */}
                    <motion.div 
                      className="relative mb-6 inline-block"
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}>
                        <feature.icon className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={1.5} />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Image Parallax */}
      <section className="testimonials-section py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 text-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-brand-deepest dark:text-white">
              What Our <span className="text-brand dark:text-brand-light">Users Say</span>
            </h2>
            <p className="text-xl text-brand-deeper dark:text-gray-300 max-w-2xl mx-auto font-light">
              Real stories from real people
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="testimonial-card"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                  <CardContent className="p-8">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-brand-deeper dark:text-gray-300 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <motion.img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <p className="font-semibold text-brand-deepest dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-brand dark:text-brand-light">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Glassmorphism */}
      <section className="cta-section relative py-32 bg-gradient-to-br from-brand via-brand-dark to-brand-deepest dark:from-gray-900 dark:via-gray-950 dark:to-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 dark:bg-brand/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-deepest/20 dark:bg-brand/10 rounded-full blur-3xl"
            animate={{
              scale: [1.5, 1, 1.5],
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 p-12 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                {isAuthenticated ? 'Need Help or Have Questions?' : 'Ready to Get Started?'}
              </h2>
              
              <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                {isAuthenticated 
                  ? 'Check out our resources, contact support, or explore the help center for assistance.'
                  : 'Join thousands of Pakistani freelancers and clients building their future on Linkify'}
              </p>
              
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/register">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="group bg-white dark:bg-brand text-brand dark:text-white hover:bg-brand-light dark:hover:bg-brand-dark text-lg px-12 py-7 h-auto shadow-2xl transition-all duration-300 font-semibold">
                        Create Free Account
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </Link>
                  
                  <Link to="/login">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" variant="outline" className="group border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-brand backdrop-blur-sm text-lg px-12 py-7 h-auto transition-all duration-300 font-semibold">
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              )}
              
              {/* Social Proof or Help Links */}
              <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white text-sm">
                {isAuthenticated ? (
                  <>
                    <Link to="/help-center">
                      <motion.div 
                        className="flex items-center gap-2 cursor-pointer hover:text-brand-light transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>Help Center</span>
                      </motion.div>
                    </Link>
                    <Link to="/contact">
                      <motion.div 
                        className="flex items-center gap-2 cursor-pointer hover:text-brand-light transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Shield className="h-5 w-5" />
                        <span>Contact Support</span>
                      </motion.div>
                    </Link>
                    <Link to="/about">
                      <motion.div 
                        className="flex items-center gap-2 cursor-pointer hover:text-brand-light transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Clock className="h-5 w-5" />
                        <span>About Us</span>
                      </motion.div>
                    </Link>
                  </>
                ) : (
                  SOCIAL_PROOF_ITEMS.map((item, i) => (
                    <motion.div 
                      key={i}
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span>{item.text}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners & Integrations Section - Infinite Scroll */}
      <section className="py-16 bg-white dark:bg-gray-950 overflow-hidden border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Trusted <span className="text-brand dark:text-brand-light">Partners & Integrations</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powered by leading Pakistani and international platforms
            </p>
          </motion.div>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Logos - First Row */}
          <div className="flex animate-scroll-left mb-8">
            {/* First set of logos */}
            <div className="flex gap-12 items-center px-6">
              {PARTNERS_ROW1.map((partner, index) => (
                <div 
                  key={`row1-${index}`}
                  className="flex items-center justify-center min-w-[180px] h-20 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-12 max-w-[140px] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-12 items-center px-6">
              {PARTNERS_ROW1.map((partner, index) => (
                <div 
                  key={`row1-dup-${index}`}
                  className="flex items-center justify-center min-w-[180px] h-20 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-12 max-w-[140px] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scrolling Logos - Second Row (Reverse Direction) */}
          <div className="flex animate-scroll-right">
            {/* First set of logos */}
            <div className="flex gap-12 items-center px-6">
              {PARTNERS_ROW2.map((partner, index) => (
                <div 
                  key={`row2-${index}`}
                  className="flex items-center justify-center min-w-[180px] h-20 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-12 max-w-[140px] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-12 items-center px-6">
              {PARTNERS_ROW2.map((partner, index) => (
                <div 
                  key={`row2-dup-${index}`}
                  className="flex items-center justify-center min-w-[180px] h-20 px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-12 max-w-[140px] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;