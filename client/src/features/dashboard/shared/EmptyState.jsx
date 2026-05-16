import { motion } from 'framer-motion';
import { FileQuestion, Package, Inbox } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export default function EmptyState({
  title = 'No data yet',
  message = 'Get started by taking your first action',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  type = 'default',
}) {
  const iconColors = {
    default: 'text-gray-400 dark:text-gray-600',
    success: 'text-brand',
    warning: 'text-yellow-500',
  };

  return (
    <Card glass className="p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Icon with Floating Animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800/50">
            <Icon className={`w-10 h-10 ${iconColors[type]}`} />
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-brand-deepest dark:text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button
            glass
            onClick={onAction}
            className="mt-4"
          >
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </Card>
  );
}
