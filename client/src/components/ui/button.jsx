import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", glass = false, ...props }, ref) => {
  const variants = {
    default: glass
      ? "backdrop-blur-md bg-brand/80 text-white hover:bg-brand border border-brand/30 shadow-[0_4px_16px_0_rgba(82,121,111,0.3)] hover:shadow-[0_6px_20px_0_rgba(82,121,111,0.4)] dark:bg-brand/70 dark:hover:bg-brand dark:border-brand/40"
      : "bg-brand text-white hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand-dark shadow-sm hover:shadow-md transition-shadow",
    destructive: glass
      ? "backdrop-blur-md bg-red-600/80 text-white hover:bg-red-600 border border-red-600/30 shadow-[0_4px_16px_0_rgba(220,38,38,0.3)] dark:bg-red-700/70 dark:hover:bg-red-700"
      : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-sm",
    outline: glass
      ? "backdrop-blur-md bg-white/50 border-2 border-white/30 hover:bg-white/70 text-gray-900 dark:bg-gray-800/50 dark:border-gray-700/30 dark:hover:bg-gray-800/70 dark:text-white shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]"
      : "border-2 border-brand-deeper bg-white hover:bg-brand-light text-brand-deepest dark:border-brand-deeper dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
    secondary: glass
      ? "backdrop-blur-md bg-brand-light/60 text-brand-deepest hover:bg-brand-light/80 border border-brand/20 dark:bg-brand-deeper/50 dark:text-brand-light dark:hover:bg-brand-deeper/70"
      : "bg-brand-light text-brand-deepest hover:bg-brand-dark hover:text-white dark:bg-brand-deeper dark:text-brand-light dark:hover:bg-brand",
    ghost: glass
      ? "backdrop-blur-sm hover:bg-white/20 text-gray-700 hover:text-gray-900 dark:hover:bg-gray-700/30 dark:text-gray-300 dark:hover:text-white"
      : "hover:bg-brand-light text-brand-deeper hover:text-brand-deepest dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white",
    link: "text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:focus-visible:ring-brand-light focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
