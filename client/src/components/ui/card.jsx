import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, glass = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border transition-all duration-300",
      glass 
        ? "backdrop-blur-xl bg-white/70 border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:bg-gray-800/40 dark:border-gray-700/30 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
        : "border-gray-200 bg-white text-gray-950 shadow-soft hover:shadow-soft-lg dark:border-brand-deeper dark:bg-brand-deepest dark:text-brand-light",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900",
      "dark:text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p 
    ref={ref} 
    className={cn(
      "text-sm text-gray-500",
      "dark:text-brand-light/70",
      className
    )} 
    {...props} 
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
