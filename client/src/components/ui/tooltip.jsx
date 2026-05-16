import { useState } from 'react';

/**
 * Simple Tooltip Component
 */
export const TooltipProvider = ({ children }) => {
  return <>{children}</>;
};

export const Tooltip = ({ children }) => {
  return <>{children}</>;
};

export const TooltipTrigger = ({ asChild, children }) => {
  return <>{children}</>;
};

export const TooltipContent = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
};





