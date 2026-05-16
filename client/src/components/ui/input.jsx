import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type = "text", glass = false, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg px-4 py-2 text-sm transition-all duration-200",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        glass
          ? "backdrop-blur-md bg-white/50 border border-white/20 shadow-[0_4px_16px_0_rgba(31,38,135,0.1)] placeholder:text-gray-600 focus-visible:ring-brand/50 dark:bg-gray-800/30 dark:border-gray-700/30 dark:placeholder:text-gray-400 dark:text-white"
          : "border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus-visible:ring-brand ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-brand-light",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef(({ className, glass = false, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg px-4 py-3 text-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        glass
          ? "backdrop-blur-md bg-white/50 border border-white/20 shadow-[0_4px_16px_0_rgba(31,38,135,0.1)] placeholder:text-gray-600 focus-visible:ring-brand/50 dark:bg-gray-800/30 dark:border-gray-700/30 dark:placeholder:text-gray-400 dark:text-white"
          : "border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus-visible:ring-brand ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-brand-light",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Input, Textarea };
