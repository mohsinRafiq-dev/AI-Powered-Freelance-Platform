import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export const LoaderWrapper = ({ 
  isLoading, 
  minTime = 1500, // Minimum display time in ms
  loader, // Loader component to show
  children 
}) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (isLoading) {
      // Start loading
      setShowLoader(true);
      setStartTime(Date.now());
    } else if (startTime) {
      // Check if minimum time has passed
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);

      if (remaining > 0) {
        // Wait for remaining time
        const timer = setTimeout(() => {
          setShowLoader(false);
          setStartTime(null);
        }, remaining);

        return () => clearTimeout(timer);
      } else {
        // Minimum time already passed
        setShowLoader(false);
        setStartTime(null);
      }
    }
  }, [isLoading, minTime, startTime]);

  return (
    <AnimatePresence mode="wait">
      {showLoader ? loader : children}
    </AnimatePresence>
  );
};

export default LoaderWrapper;
