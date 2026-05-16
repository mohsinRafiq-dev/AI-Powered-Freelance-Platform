import * as React from 'react';
import { cn } from '../../lib/utils';

const TabsContext = React.createContext({
  activeTab: '',
  setActiveTab: () => {},
});

/**
 * Tabs Container Component
 */
const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

/**
 * Tabs List Component
 */
const TabsList = ({ children, className }) => {
  return (
    <div
      className={cn(
        'inline-flex h-12 items-center justify-start rounded-lg bg-gray-100 dark:bg-gray-800 p-1.5 text-gray-600 dark:text-gray-400',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Tabs Trigger Component
 */
const TabsTrigger = ({ value, children, icon: Icon, className }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white dark:bg-gray-700 text-brand dark:text-brand-light shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

/**
 * Tabs Content Component
 */
const TabsContent = ({ value, children, className }) => {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      className={cn(
        'mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

