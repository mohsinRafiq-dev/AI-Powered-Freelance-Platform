import * as React from "react";
import { cn } from "../../lib/utils";

const Label = React.forwardRef(({ className, glass = false, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        glass 
          ? "backdrop-blur-sm text-gray-900 dark:text-white"
          : "text-gray-900 dark:text-gray-200",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };
