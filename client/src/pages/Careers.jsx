import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Heart,
  Coffee,
  Rocket,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const JOB_OPENINGS = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Karachi/Remote',
    type: 'Full-time',
    salary: 'Rs. 250k - 350k/month',
    description: 'Build beautiful, responsive user interfaces using React, TypeScript, and modern CSS frameworks.',
    requirements: [
      '5+ years of frontend development experience',
      'Expert in React, TypeScript, and modern JavaScript',
      'Strong understanding of UI/UX principles',
      'Experience with REST APIs and GraphQL'
    ],
    gradient: 'from-brand to-brand-dark'
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'Lahore/Remote',
    type: 'Full-time',
    salary: 'Rs. 200k - 280k/month',
    description: 'Create intuitive, delightful user experiences that help Pakistani freelancers and clients succeed.',
    requirements: [
      '4+ years of product design experience',
      'Proficiency in Figma and design systems',
      'Strong portfolio demonstrating UX thinking',
      'Experience with user research and testing'
    ],
    gradient: 'from-brand-light to-brand'
  },
  {
    id: 3,
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Islamabad/Remote',
    type: 'Full-time',
    salary: 'Rs. 270k - 380k/month',
    description: 'Build scalable, reliable backend systems that power thousands of Pakistani freelancing transactions.',
    requirements: [
      '5+ years of backend development experience',
      'Expert in Node.js, Python, or Go',
      'Strong database design skills (SQL & NoSQL)',
      'Experience with microservices architecture'
    ],
    gradient: 'from-brand-dark to-brand-deepest'
  },
  {
    id: 4,
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Karachi/Remote',
    type: 'Full-time',
    salary: 'Rs. 150k - 220k/month',
    description: 'Help our Pakistani users succeed by providing exceptional support and building strong relationships.',
    requirements: [
      '3+ years of customer success experience',
      'Excellent communication skills in English and Urdu',
      'Problem-solving mindset',
      'Experience with SaaS products'
    ],
    gradient: 'from-brand to-brand-light'
  },
  {
    id: 5,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Lahore/Remote',
    type: 'Full-time',
    salary: 'Rs. 180k - 260k/month',
    description: 'Drive growth through creative marketing campaigns targeting the Pakistani freelancing market.',
    requirements: [
      '4+ years of marketing experience',
      'Strong analytical and creative skills',
      'Experience with digital marketing in Pakistan',
      'Data-driven decision making'
    ],
    gradient: 'from-brand-dark to-brand'
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Islamabad/Remote',
    type: 'Full-time',
    salary: 'Rs. 250k - 330k/month',
    description: 'Ensure our infrastructure is reliable, scalable, and secure for Pakistani users.',
    requirements: [
      '4+ years of DevOps experience',
      'Expert in AWS, Docker, and Kubernetes',
      'Strong scripting skills (Bash, Python)',
      'Experience with CI/CD pipelines'
    ],
    gradient: 'from-brand to-brand-dark'
  }
];

const BENEFITS = [
  {
    id: 1,
    icon: MapPin,
    title: 'Work from Anywhere',
    description: 'Fully remote team with flexible work arrangements',
    gradient: 'from-brand to-brand-dark'
  },
  {
    id: 2,
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs',
    gradient: 'from-brand-light to-brand'
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Growth Opportunities',
    description: 'Continuous learning budget and career development',
    gradient: 'from-brand-dark to-brand-deepest'
  },
  {
    id: 4,
    icon: Coffee,
    title: 'Work-Life Balance',
    description: 'Unlimited PTO and flexible working hours',
    gradient: 'from-brand to-brand-light'
  },
  {
    id: 5,
    icon: Users,
    title: 'Amazing Team',
    description: 'Collaborative culture with talented colleagues',
    gradient: 'from-brand-dark to-brand'
  },
  {
    id: 6,
    icon: Rocket,
    title: 'Equity & Bonuses',
    description: 'Competitive compensation with stock options',
    gradient: 'from-brand to-brand-dark'
  }
];

const COMPANY_VALUES = [
  'Innovation and continuous improvement',
  'Transparency and open communication',
  'Diversity and inclusion',
  'Customer-first mindset',
  'Work-life harmony',
  'Remote-first culture'
];

const HIRING_PROCESS = [
  {
    step: 1,
    title: 'Apply',
    description: 'Submit your application through our careers portal'
  },
  {
    step: 2,
    title: 'Initial Screen',
    description: '15-30 minute call with our recruiting team'
  },
  {
    step: 3,
    title: 'Technical/Skills Assessment',
    description: 'Role-specific evaluation of your skills'
  },
  {
    step: 4,
    title: 'Team Interviews',
    description: 'Meet with potential teammates and managers'
  },
  {
    step: 5,
    title: 'Final Interview',
    description: 'Conversation with leadership team'
  },
  {
    step: 6,
    title: 'Offer',
    description: 'Receive and review your offer package'
  }
];


function Careers() {
  const heroRef = useRef(null);
  const jobsRef = useRef(null);
  const benefitsRef = useRef(null);

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

      // Animate job cards
      setTimeout(() => {
        const jobCards = document.querySelectorAll('.job-card');
        if (jobCards.length > 0) {
          gsap.set('.job-card', { opacity: 1 });
          gsap.fromTo(
            '.job-card',
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: jobsRef.current,
                start: 'top 75%',
                once: true,
              }
            }
          );
        }
      }, 100);

      // Animate benefit cards
      setTimeout(() => {
        const benefitCards = document.querySelectorAll('.benefit-card');
        if (benefitCards.length > 0) {
          gsap.set('.benefit-card', { opacity: 1 });
          gsap.fromTo(
            '.benefit-card',
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: benefitsRef.current,
                start: 'top 80%',
                once: true,
              }
            }
          );
        }
      }, 150);

      // Animate process steps
      setTimeout(() => {
        const processSteps = document.querySelectorAll('.process-step');
        if (processSteps.length > 0) {
          gsap.set('.process-step', { opacity: 1 });
          gsap.fromTo(
            '.process-step',
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.process-section',
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
              <Briefcase className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Join Our Team
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Help us build the future of work. We're looking for talented, passionate people to join our mission.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-white text-sm mb-8"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>50+ Team Members</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Fully Remote</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Fast Growing</span>
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

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Work at <span className="text-brand dark:text-brand-light">Linkify?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We offer more than just a job – we offer a career and a community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit) => (
              <motion.div
                key={benefit.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className="benefit-card"
              >
                <Card className="h-full border-0 bg-white dark:bg-gray-800 hover:shadow-2xl transition-all">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center`}>
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section ref={jobsRef} className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Open <span className="text-brand dark:text-brand-light">Positions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Find your next opportunity with us
            </p>
          </motion.div>

          <div className="space-y-6">
            {JOB_OPENINGS.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ x: 5 }}
                className="job-card"
              >
                <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light transition-all bg-white dark:bg-gray-800">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${job.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Briefcase className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {job.description}
                        </p>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Requirements:
                          </h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircle className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="lg:w-48 flex-shrink-0">
                        <Button className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white py-6">
                          Apply Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process Section */}
      <section className="process-section py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Hiring <span className="text-brand dark:text-brand-light">Process</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              What to expect when you apply
            </p>
          </motion.div>

          <div className="relative">
            {/* Process line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand/30 dark:bg-brand-light/30" />

            <div className="space-y-8">
              {HIRING_PROCESS.map((step) => (
                <motion.div
                  key={step.step}
                  className="process-step relative pl-20"
                  initial={{ opacity: 1 }}
                >
                  <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What We <span className="text-brand dark:text-brand-light">Value</span>
            </h2>
          </motion.div>

          <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMPANY_VALUES.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <CheckCircle className="h-6 w-6 text-brand flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            <Rocket className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Don't see a perfect fit? Send us your resume and let's talk about how you can contribute
            </p>
            <Button className="bg-white text-brand hover:bg-gray-100 px-8 py-6 text-lg">
              Send General Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Careers;
