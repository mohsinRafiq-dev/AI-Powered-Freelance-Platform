import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/button';
import Footer from '../components/layout/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-24 lg:py-32 relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* 404 Number with Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <h1 className="text-9xl lg:text-[12rem] font-bold bg-gradient-to-br from-brand via-brand-dark to-brand-deepest bg-clip-text text-transparent leading-none">
                  404
                </h1>
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-brand-dark/20 to-brand-deepest/20 blur-3xl -z-10 rounded-full"></div>
              </div>
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="mb-6 flex justify-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand/20 via-brand-dark/20 to-brand-deepest/20 dark:from-brand/30 dark:via-brand-dark/30 dark:to-brand-deepest/30 flex items-center justify-center border-2 border-brand/30 dark:border-brand/40 shadow-lg">
                <FileQuestion className="w-12 h-12 text-brand dark:text-brand-light" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Page Not Found
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-2 border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-white transition-all duration-300 px-8 py-6 text-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Home
              </Button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">You might be looking for:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-medium transition-colors flex items-center gap-2 group"
                >
                  <Search className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Browse Jobs
                </button>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <button
                  onClick={() => navigate('/about')}
                  className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-medium transition-colors"
                >
                  About Us
                </button>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <button
                  onClick={() => navigate('/help')}
                  className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-medium transition-colors"
                >
                  Help Center
                </button>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand font-medium transition-colors"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand/10 dark:bg-brand/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-dark/10 dark:bg-brand-dark/5 rounded-full blur-3xl"></div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotFound;

