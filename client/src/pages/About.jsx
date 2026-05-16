import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Heart, 
  Users, 
  TrendingUp,
  Award,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: Users, number: '25K+', label: 'Active Users', gradient: 'from-brand to-brand-dark' },
  { icon: Globe, number: 'Pakistan', label: 'Nationwide Coverage', gradient: 'from-brand-light to-brand' },
  { icon: Award, number: '15K+', label: 'Projects Completed', gradient: 'from-brand-dark to-brand-deepest' },
  { icon: TrendingUp, number: '98%', label: 'Satisfaction Rate', gradient: 'from-brand to-brand-light' }
];

const VALUES = [
  {
    id: 1,
    icon: Heart,
    title: 'People First',
    description: 'We believe in putting people at the center of everything we do. Our platform is designed to empower freelancers and clients to succeed together.',
    gradient: 'from-brand to-brand-dark'
  },
  {
    id: 2,
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Building a secure platform with CNIC verification, escrow payments, and fair dispute resolution. Your security is our priority.',
    gradient: 'from-brand-light to-brand'
  },
  {
    id: 3,
    icon: Zap,
    title: 'Innovation',
    description: 'Continuously improving our platform with cutting-edge technology to make freelancing easier, faster, and more efficient for everyone.',
    gradient: 'from-brand-dark to-brand-deepest'
  },
  {
    id: 4,
    icon: Target,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our service, from user experience to customer support, ensuring the highest quality.',
    gradient: 'from-brand to-brand-light'
  }
];

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Ayesha Rahman',
    role: 'CEO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Former tech executive with 15+ years in Pakistan\'s IT industry'
  },
  {
    id: 2,
    name: 'Ali Ahmed',
    role: 'CTO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Software architect passionate about building scalable platforms'
  },
  {
    id: 3,
    name: 'Sana Malik',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Product visionary focused on user experience for Pakistani market'
  },
  {
    id: 4,
    name: 'Hassan Khan',
    role: 'Head of Engineering',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Engineering leader focused on technical excellence'
  }
];

const MILESTONES = [
  {
    year: '2020',
    title: 'Founded in Pakistan',
    description: 'Linkify was born from a vision to revolutionize freelancing in Pakistan'
  },
  {
    year: '2021',
    title: 'Launched Platform',
    description: 'Released MVP and onboarded first 1,000 Pakistani users'
  },
  {
    year: '2022',
    title: 'Nationwide Expansion',
    description: 'Expanded to all major cities in Pakistan with JazzCash & Easypaisa integration'
  },
  {
    year: '2023',
    title: 'Major Milestone',
    description: 'Reached 10,000 completed projects and Rs. 500M in transactions'
  },
  {
    year: '2024',
    title: 'CNIC Verification',
    description: 'Introduced CNIC verification for enhanced security and trust'
  },
  {
    year: '2025',
    title: 'Leading Platform',
    description: '25K+ users and recognized as Pakistan\'s top freelancing platform'
  }
];

function About() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const valuesRef = useRef(null);

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

      // Animate stats
      setTimeout(() => {
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length > 0) {
          gsap.set('.stat-card', { opacity: 1 });
          gsap.fromTo(
            '.stat-card',
            { opacity: 0, y: 60, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate value cards
      setTimeout(() => {
        const valueCards = document.querySelectorAll('.value-card');
        if (valueCards.length > 0) {
          gsap.set('.value-card', { opacity: 1 });
          gsap.fromTo(
            '.value-card',
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: valuesRef.current,
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 150);

      // Animate team cards
      setTimeout(() => {
        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length > 0) {
          gsap.set('.team-card', { opacity: 1 });
          gsap.fromTo(
            '.team-card',
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.team-section',
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 200);

      // Animate timeline items
      setTimeout(() => {
        const milestoneItems = document.querySelectorAll('.milestone-item');
        if (milestoneItems.length > 0) {
          gsap.set('.milestone-item', { opacity: 1 });
          gsap.fromTo(
            '.milestone-item',
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.timeline-section',
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 250);
    }, heroRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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
              <Heart className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              About Linkify
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              We're on a mission to empower Pakistani freelancers and businesses by creating the most trusted and innovative freelancing platform in Pakistan.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button className="bg-white text-brand hover:bg-gray-100 px-8 py-6 text-lg">
                Join Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Contact Us
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto text-white dark:text-gray-950" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card text-center"
                initial={{ opacity: 1 }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-brand dark:text-brand-light mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our <span className="text-brand dark:text-brand-light">Story</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Linkify was founded in 2020 with a simple yet powerful vision: to create a platform where talented Pakistani professionals and businesses can connect seamlessly across the country. We saw the traditional employment model changing and wanted to be at the forefront of Pakistan's freelance revolution.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              What started as a small team of passionate Pakistani entrepreneurs has grown into a thriving community of over 25,000 freelancers and clients from Karachi to Islamabad, Lahore to Peshawar. We've facilitated thousands of successful projects, helping Pakistani businesses scale and freelancers build sustainable careers.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Today, Linkify stands as a testament to Pakistani talent and innovation. We're not just a platform; we're a movement towards a more flexible, inclusive, and empowering future of work in Pakistan, supporting local payment methods like JazzCash and Easypaisa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-brand dark:text-brand-light">Values</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((value) => (
              <motion.div
                key={value.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="value-card"
              >
                <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our <span className="text-brand dark:text-brand-light">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Milestones that shaped who we are today
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand/30 dark:bg-brand-light/30" />

            <div className="space-y-8">
              {MILESTONES.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="milestone-item relative pl-20"
                  initial={{ opacity: 1 }}
                >
                  <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {milestone.year}
                  </div>
                  <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our <span className="text-brand dark:text-brand-light">Team</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The passionate people behind Linkify
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -10 }}
                className="team-card"
              >
                <Card className="border-0 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-brand dark:text-brand-light font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand via-brand-dark to-brand-deepest dark:from-gray-900 dark:via-gray-950 dark:to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Us on Our Mission
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Be part of a team that's revolutionizing the future of work
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-brand hover:bg-gray-100 px-8 py-6 text-lg">
                View Open Positions
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
