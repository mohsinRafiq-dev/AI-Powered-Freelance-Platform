import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Loader = ({ 
  variant = "fullscreen", 
  size = "default",
  text = "Loading...",
  className = "",
  state = "loading",
  minDisplayTime = 1500,
  onMinTimeComplete = null
}) => {
  const [hasMinTimePassed, setHasMinTimePassed] = useState(false);
  
  // Detect dark mode
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  // Ensure loader shows for minimum time
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMinTimePassed(true);
      if (onMinTimeComplete) {
        onMinTimeComplete();
      }
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onMinTimeComplete]);


  // Size configurations
  const sizeConfig = {
    small: { spinner: 16, text: "text-xs", spacing: "gap-2" },
    default: { spinner: 24, text: "text-sm", spacing: "gap-3" },
    large: { spinner: 40, text: "text-lg", spacing: "gap-4" },
  };

  const currentSize = sizeConfig[size] || sizeConfig.default;

  // Theme colors - clean and minimal
  const colors = {
    primary: isDark ? "#84A98C" : "#52796F",
    text: isDark ? "#E8E8E8" : "#2F3E46",
    bg: isDark ? "rgba(31, 41, 55, 0.98)" : "rgba(255, 255, 255, 0.98)",
    success: isDark ? "#10B981" : "#059669",
  };

  // Loading spinner component
  const Spinner = ({ size: spinnerSize, className: spinnerClass = "" }) => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={spinnerClass}
    >
      <Loader2 
        size={spinnerSize} 
        style={{ color: colors.primary }}
        strokeWidth={2.5}
      />
    </motion.div>
  );

  // Success checkmark component
  const SuccessIcon = ({ size: iconSize }) => (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <CheckCircle2 
        size={iconSize} 
        style={{ color: colors.success }}
        strokeWidth={2.5}
      />
    </motion.div>
  );

  // Animated dots
  const AnimatedDots = () => (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );


  // Inline variant - for cards and sections
  if (variant === "inline") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`flex flex-col items-center justify-center ${currentSize.spacing} py-8 ${className}`}
      >
        {state === "success" ? (
          <SuccessIcon size={currentSize.spinner * 1.5} />
        ) : (
          <Spinner size={currentSize.spinner * 1.5} />
        )}
        
        {text && (
          <p className={`font-medium ${currentSize.text}`} style={{ color: colors.text }}>
            {text}
            {state === "loading" && <AnimatedDots />}
          </p>
        )}
      </motion.div>
    );
  }


  // Button variant - compact for buttons
  if (variant === "button") {
    return (
      <div className={`flex items-center justify-center ${currentSize.spacing} ${className}`}>
        {state === "success" ? (
          <SuccessIcon size={currentSize.spinner} />
        ) : (
          <Spinner size={currentSize.spinner} />
        )}
        
        {text && (
          <span className={`font-medium ${currentSize.text}`} style={{ color: colors.text }}>
            {text}
            {state === "loading" && <AnimatedDots />}
          </span>
        )}
      </div>
    );
  }

  // Fullscreen variant - for page transitions and major operations
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 ${className}`}
        style={{
          backgroundColor: colors.bg,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Main content */}
        <div className="flex flex-col items-center gap-6">
          {state === "success" ? (
            <>
              <SuccessIcon size={64} />
              {text && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <p className="text-2xl font-semibold" style={{ color: colors.success }}>
                    {text}
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <Spinner size={64} />
              {text && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <p className="text-xl font-medium" style={{ color: colors.text }}>
                    {text}
                    <AnimatedDots />
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Subtle brand mark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-8 text-xs font-medium tracking-wider"
          style={{ color: colors.text }}
        >
          LINKIFY
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Convenience exports for common use cases
export const FullscreenLoader = (props) => <Loader variant="fullscreen" {...props} />;
export const InlineLoader = (props) => <Loader variant="inline" {...props} />;
export const ButtonLoader = (props) => <Loader variant="button" {...props} />;
export const SuccessLoader = (props) => <Loader state="success" {...props} />;

export default Loader;
