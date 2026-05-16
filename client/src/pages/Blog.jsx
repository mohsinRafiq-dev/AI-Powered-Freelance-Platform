import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  TrendingUp,
  Search
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



const BLOG_POSTS = [
  {
    id: 1,
    title: 'How to Build a Successful Freelance Career in Pakistan 2025',
    excerpt: 'Discover the essential strategies and tools you need to thrive as a Pakistani freelancer in today\'s competitive market.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop',
    author: 'Ayesha Khan',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date: 'November 15, 2025',
    readTime: '8 min read',
    category: 'Career Tips',
    featured: true
  },
  {
    id: 2,
    title: 'Top 10 Skills in Demand for Pakistani Freelancers',
    excerpt: 'Stay ahead of the curve by learning these high-demand skills that Pakistani clients are actively seeking.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop',
    author: 'Ahmed Hassan',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    date: 'November 12, 2025',
    readTime: '6 min read',
    category: 'Skills',
    featured: true
  },
  {
    id: 3,
    title: 'Pricing Your Services in PKR: A Complete Guide',
    excerpt: 'Learn how to set competitive rates in Pakistani Rupees that reflect your value while attracting the right clients.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
    author: 'Fatima Malik',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    date: 'November 10, 2025',
    readTime: '10 min read',
    category: 'Business',
    featured: false
  },
  {
    id: 4,
    title: 'Remote Work Best Practices for Pakistan',
    excerpt: 'Master the art of remote work with these proven strategies for productivity and work-life balance in Pakistan.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
    author: 'Hassan Ali',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    date: 'November 8, 2025',
    readTime: '7 min read',
    category: 'Productivity',
    featured: false
  },
  {
    id: 5,
    title: 'Building Your Personal Brand as a Pakistani Freelancer',
    excerpt: 'Stand out from the crowd by creating a compelling personal brand that attracts ideal Pakistani clients.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    author: 'Sana Rahman',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    date: 'November 5, 2025',
    readTime: '9 min read',
    category: 'Marketing',
    featured: false
  },
  {
    id: 6,
    title: 'Managing Client Relationships Effectively in Pakistan',
    excerpt: 'Build lasting client relationships with Pakistani businesses using these communication and project management tips.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop',
    author: 'Zain Ahmed',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    date: 'November 3, 2025',
    readTime: '8 min read',
    category: 'Client Management',
    featured: false
  }
];

const CATEGORIES = [
  'All Posts',
  'Career Tips',
  'Skills',
  'Business',
  'Productivity',
  'Marketing',
  'Client Management'
];

const TRENDING_TOPICS = [
  { name: 'AI & Automation', count: 24 },
  { name: 'Web Development', count: 18 },
  { name: 'Design Trends', count: 15 },
  { name: 'Freelance Tips', count: 32 },
  { name: 'Remote Work', count: 21 }
];



function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [searchQuery, setSearchQuery] = useState('');
  
  const heroRef = useRef(null);
  const postsRef = useRef(null);

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

      // Animate featured posts
      setTimeout(() => {
        const featuredCards = document.querySelectorAll('.featured-post-card');
        if (featuredCards.length > 0) {
          gsap.set('.featured-post-card', { opacity: 1 });
          gsap.fromTo(
            '.featured-post-card',
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.featured-section',
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate blog cards
      setTimeout(() => {
        const blogCards = document.querySelectorAll('.blog-card');
        if (blogCards.length > 0) {
          gsap.set('.blog-card', { opacity: 1 });
          gsap.fromTo(
            '.blog-card',
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: postsRef.current,
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

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = BLOG_POSTS.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="bg-white dark:bg-gray-950 overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 bg-gradient-to-br from-brand via-brand-dark to-brand-deepest dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white bg-[size:32px_32px]" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
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
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Linkify Blog
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
              Insights, tips, and stories to help you succeed in your freelance journey
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white dark:bg-gray-800 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900 dark:text-white placeholder:text-gray-400 shadow-2xl"
                />
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

      {/* Featured Posts Section */}
      <section className="featured-section py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-brand" />
              Featured Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Don't miss these popular posts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -8 }}
                className="featured-post-card"
              >
                <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-brand/20 text-brand dark:text-brand-light rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-brand dark:hover:text-brand-light transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.authorImage} 
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {post.author}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {post.date}
                          </p>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section ref={postsRef} className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Category Filter */}
              <div className="mb-8 flex flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ y: -5 }}
                    className="blog-card"
                  >
                    <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2 py-1 bg-brand/20 text-brand dark:text-brand-light rounded text-xs font-semibold">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-brand dark:hover:text-brand-light transition-colors cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <img 
                            src={post.authorImage} 
                            alt={post.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-xs">
                              {post.author}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {post.date}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {regularPosts.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    No articles found matching your criteria
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Trending Topics */}
                <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-brand" />
                      Trending Topics
                    </h3>
                    <div className="space-y-3">
                      {TRENDING_TOPICS.map((topic, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ x: 5 }}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {topic.name}
                          </span>
                          <span className="text-sm text-brand dark:text-brand-light">
                            {topic.count} posts
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="border-2 border-brand dark:border-brand-light bg-brand/5 dark:bg-brand/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Subscribe to Our Newsletter
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      Get the latest articles and tips delivered to your inbox
                    </p>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand/50 mb-3 text-gray-900 dark:text-white"
                    />
                    <Button className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white">
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;
