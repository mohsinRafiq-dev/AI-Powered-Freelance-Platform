import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const LazyLoadItem = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '50px',
  animateOnLoad = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = itemRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  if (animateOnLoad) {
    return (
      <div ref={itemRef} className={className}>
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        ) : (
          <div className="min-h-[200px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div ref={itemRef} className={className}>
      {isVisible ? (
        children
      ) : (
        <div className="min-h-[200px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
      )}
    </div>
  );
};

export default LazyLoadItem;
