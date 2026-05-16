import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", size = "default", glass = false, ...props }, ref) => {
  const variants = {
    default: glass
      ? "backdrop-blur-md bg-blue-600/70 text-white border border-blue-600/30 shadow-[0_2px_8px_0_rgba(37,99,235,0.3)]"
      : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
    secondary: glass
      ? "backdrop-blur-md bg-gray-200/70 text-gray-900 border border-gray-300/30 dark:bg-gray-700/70 dark:text-gray-200 dark:border-gray-600/30"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    destructive: glass
      ? "backdrop-blur-md bg-red-600/70 text-white border border-red-600/30 shadow-[0_2px_8px_0_rgba(220,38,38,0.3)]"
      : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
    outline: glass
      ? "backdrop-blur-sm bg-white/30 border border-gray-300/50 text-gray-900 dark:bg-gray-800/30 dark:border-gray-600/50 dark:text-gray-200"
      : "border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-200",
    success: glass
      ? "backdrop-blur-md bg-green-600/70 text-white border border-green-600/30 shadow-[0_2px_8px_0_rgba(22,163,74,0.3)]"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    green: glass
      ? "backdrop-blur-md bg-green-600/70 text-white border border-green-600/30 shadow-[0_2px_8px_0_rgba(22,163,74,0.3)]"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: glass
      ? "backdrop-blur-md bg-blue-600/70 text-white border border-blue-600/30 shadow-[0_2px_8px_0_rgba(37,99,235,0.3)]"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    purple: glass
      ? "backdrop-blur-md bg-purple-600/70 text-white border border-purple-600/30 shadow-[0_2px_8px_0_rgba(147,51,234,0.3)]"
      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    yellow: glass
      ? "backdrop-blur-md bg-yellow-600/70 text-white border border-yellow-600/30 shadow-[0_2px_8px_0_rgba(234,179,8,0.3)]"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    red: glass
      ? "backdrop-blur-md bg-red-600/70 text-white border border-red-600/30 shadow-[0_2px_8px_0_rgba(220,38,38,0.3)]"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    orange: glass
      ? "backdrop-blur-md bg-orange-600/70 text-white border border-orange-600/30 shadow-[0_2px_8px_0_rgba(234,88,12,0.3)]"
      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  const sizes = {
    default: "px-3 py-1 text-xs",
    sm: "px-2 py-0.5 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-light focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
