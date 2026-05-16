import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Consistent loading component for admin panel
 */
export const AdminLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <Loader2 className="w-12 h-12 text-brand animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-brand/20" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
      </motion.div>
    </div>
  );
};

/**
 * Table skeleton loader
 */
export const AdminTableLoading = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          {[...Array(columns)].map((_, j) => (
            <div
              key={j}
              className="h-12 bg-brand-light/30 dark:bg-gray-800/50 rounded-lg flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Card skeleton loader
 */
export const AdminCardLoading = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-32 bg-brand-light/30 dark:bg-gray-800/50 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default AdminLoading;
