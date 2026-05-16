import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-brand',
  trend,
  trendLabel = 'vs last month',
  isLoading = false,
}) {
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600 dark:text-green-400';
    if (trend < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  if (isLoading) {
    return (
      <Card glass className="p-6">
        <div className="space-y-3">
          <div className="skeleton h-4 w-24 rounded"></div>
          <div className="skeleton h-8 w-32 rounded"></div>
          <div className="skeleton h-3 w-20 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card glass className="p-6 card-hover group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title */}
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>

            {/* Value */}
            <h3 className="text-3xl font-bold text-brand-deepest dark:text-white mb-2">
              {value}
            </h3>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}

            {/* Trend Indicator */}
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-3 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-semibold">
                  {Math.abs(trend)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {trendLabel}
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <div className={`
              ${iconBg} 
              rounded-xl p-3 
              shadow-soft
              transition-transform duration-300
              group-hover:scale-110 group-hover:rotate-6
            `}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
