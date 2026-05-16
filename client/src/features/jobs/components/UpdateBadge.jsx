import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const UpdateBadge = ({ show, message = 'Updated', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center"
        >
          <Badge 
            variant="outline" 
            className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 animate-pulse"
          >
            <Zap className="w-3 h-3 mr-1" />
            {message}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to manage update badge state
export const useUpdateIndicator = (queryKey) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('Updated');

  useEffect(() => {
    if (!window.queryClient) return;

    const unsubscribe = window.queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.queryKey[0] === queryKey) {
        setShowUpdate(true);
        setUpdateMessage('Updated');
      }
    });

    return unsubscribe;
  }, [queryKey]);

  const hideUpdate = () => setShowUpdate(false);
  
  const triggerUpdate = (message = 'Updated') => {
    setUpdateMessage(message);
    setShowUpdate(true);
  };

  return {
    showUpdate,
    updateMessage,
    hideUpdate,
    triggerUpdate,
  };
};
