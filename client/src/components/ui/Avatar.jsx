import * as React from "react";
import { cn } from "../../lib/utils";

const Avatar = React.forwardRef(({ src, alt = "Avatar", size = "md", className, ...props }, ref) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-brand-light/30 dark:bg-gray-700",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<span class="font-medium text-brand-deepest dark:text-white">${getInitials(alt)}</span>`;
          }}
        />
      ) : (
        <span className="font-medium text-brand-deepest dark:text-white">
          {getInitials(alt)}
        </span>
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };
