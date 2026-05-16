import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export default function ActionButton({
  title,
  description,
  icon: Icon,
  gradient = 'from-brand to-brand-dark',
  iconBg,
  action,
  onClick,
  disabled = false,
}) {
  // Support both 'action' and 'onClick' props for flexibility
  const handleClick = action || onClick;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <Card
        glass
        onClick={disabled ? undefined : handleClick}
        className={`
          p-6 cursor-pointer card-hover group
          transition-all duration-300
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-brand hover:border-brand/50'
          }
        `}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`
            ${iconBg || `bg-gradient-to-br ${gradient}`}
            rounded-xl p-3 
            shadow-soft
            transition-all duration-300
            ${!disabled && 'group-hover:shadow-brand-lg group-hover:scale-110'}
          `}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-base font-semibold text-brand-deepest dark:text-white">
                {title}
              </h4>
              {!disabled && (
                <ArrowRight className="
                  w-5 h-5 text-brand 
                  transition-transform duration-300 
                  group-hover:translate-x-1
                " />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
