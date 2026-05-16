import { motion } from 'framer-motion';

/**
 * Consistent page header for all admin pages
 */
export const AdminPageHeader = ({ 
  title, 
  description, 
  actions,
  breadcrumbs = []
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6"
    >
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm mb-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-gray-400 dark:text-gray-600">/</span>
                )}
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? 'text-brand-deepest dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                >
                  {crumb}
                </span>
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-bold text-brand-deepest dark:text-white mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex gap-3">
          {actions}
        </div>
      )}
    </motion.div>
  );
};

export default AdminPageHeader;
