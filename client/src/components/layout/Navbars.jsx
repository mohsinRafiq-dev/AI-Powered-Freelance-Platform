import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  LogOut, 
  User, 
  Home, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Menu, 
  X,
  Moon,
  Sun,
  Search,
  Bell,
  Settings,
  ChevronDown,
  LayoutDashboard,
  UserCircle,
  CreditCard,
  HelpCircle,
  FileText,
  Plus,
  Wallet,
  Receipt,
  ArrowUpDown
} from "lucide-react";
import { logoutUser } from "../../store/slices/authSlice";
import { Button } from "../ui/button";
import { Loader } from "../common/Loader";
import { useNotifications } from "../../hooks/api";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, isLoggingOut } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Initialize darkMode from localStorage immediately to prevent mismatch
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      const isDark = saved === 'true';
      // Apply theme immediately
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return isDark;
    }
    return false;
  });
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Notification hook (data + mutations). Keep dropdown state local to Navbar
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    isLoading: notificationsLoading,
  } = useNotifications({ enabled: isAuthenticated });

  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Normalize notifications to an array to avoid runtime errors
  // Handle both direct arrays and wrapped responses
  const notificationList = useMemo(() => {
    let normalized = [];
    
    if (Array.isArray(notifications)) {
      normalized = notifications;
    } else if (notifications && typeof notifications === 'object') {
      // Try different possible structures
      normalized = notifications.items || 
                   notifications.notifications || 
                   (notifications.data && Array.isArray(notifications.data) ? notifications.data : null) ||
                   Object.values(notifications).filter(v => v && typeof v === 'object' && (v.title || v.message || v.type));
    }
    
    // Debug: Log first notification to see structure
    if (normalized.length > 0 && process.env.NODE_ENV === 'development') {
      console.log('[Navbars] First notification structure:', normalized[0]);
    }
    
    return normalized;
  }, [notifications]);

  const toggleNotificationDropdown = useCallback(() => {
    setNotificationDropdownOpen((s) => !s);
  }, []);

  const closeNotificationDropdown = useCallback(() => {
    setNotificationDropdownOpen(false);
  }, []);

  // Helper to format notification createdAt safely. Falls back to ObjectId timestamp when possible.
  const formatNotificationDate = (notification) => {
    if (!notification) {
      return { date: 'Just now', time: '' };
    }

    // Try multiple date field names (Mongoose uses createdAt, some APIs use created_at)
    const raw = notification?.createdAt ?? notification?.created_at ?? notification?.timestamp ?? null;
    let d = null;

    if (raw) {
      // If it's already a Date object
      if (raw instanceof Date) {
        d = raw;
      }
      // If it's a string, parse it
      else if (typeof raw === 'string') {
        // Try parsing as ISO string or any valid date string
        d = new Date(raw);
        // Validate the parsed date
        if (Number.isNaN(d.getTime())) {
          d = null;
        }
      }
      // If it's a number (timestamp in milliseconds or seconds)
      else if (typeof raw === 'number') {
        // If it's a Unix timestamp in seconds (less than year 2000 in ms), convert to ms
        const timestamp = raw < 946684800000 ? raw * 1000 : raw;
        d = new Date(timestamp);
        if (Number.isNaN(d.getTime())) {
          d = null;
        }
      }
      // If it's an object with date methods (like a Mongoose date)
      else if (raw && typeof raw === 'object' && 'getTime' in raw && typeof raw.getTime === 'function') {
        try {
          d = new Date(raw.getTime());
        } catch (e) {
          d = null;
        }
      }
    }

    // Fallback to ObjectId timestamp extraction (MongoDB ObjectId contains timestamp)
    if ((!d || Number.isNaN(d.getTime())) && notification?._id) {
      try {
        const idStr = String(notification._id);
        // MongoDB ObjectId: first 8 characters are timestamp in hex (seconds since epoch)
        if (idStr.length >= 8 && /^[0-9a-fA-F]{24}$/.test(idStr)) {
          const hexTimestamp = idStr.substring(0, 8);
          const ts = parseInt(hexTimestamp, 16) * 1000; // Convert to milliseconds
          d = new Date(ts);
          if (Number.isNaN(d.getTime())) {
            d = null;
          }
        }
      } catch (e) {
        // Silently fail - we'll use fallback
        d = null;
      }
    }

    // Final validation - if still no valid date, return fallback
    if (!d || Number.isNaN(d.getTime())) {
      return { date: 'Just now', time: '' };
    }

    // Calculate relative time for recent notifications
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Show relative time for recent notifications
    if (diffMins < 1) {
      return { date: 'Just now', time: '' };
    } else if (diffMins < 60) {
      return { date: `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`, time: '' };
    } else if (diffHours < 24) {
      return { date: `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`, time: '' };
    } else if (diffDays < 7) {
      return { date: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`, time: '' };
    }

    // For older notifications, show formatted date and time
    try {
      const isToday = d.toDateString() === now.toDateString();
      const isYesterday = d.toDateString() === new Date(now.getTime() - 86400000).toDateString();
      
      if (isToday) {
        return {
          date: 'Today',
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (isYesterday) {
        return {
          date: 'Yesterday',
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined }),
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
      }
    } catch (e) {
      // Fallback to simple format
      return { date: d.toLocaleDateString(), time: d.toLocaleTimeString() };
    }
  };
  
  // Long press state management
  const longPressTimerRef = useRef(null);
  const pressStartTimeRef = useRef(null);
  const isLongPressRef = useRef(false);

  // Sync dark mode with localStorage on mount (backup, but initialization is now in useState)
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    // Only update if there's a mismatch (shouldn't happen, but safety check)
    if (savedDarkMode !== darkMode) {
      setDarkMode(savedDarkMode);
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  // Hide navbar on desktop when footer is in view
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const footer = document.querySelector('footer');
      
      if (footer && window.innerWidth >= 1024) { // Only on desktop
        const footerRect = footer.getBoundingClientRect();
        const isFooterVisible = footerRect.top <= window.innerHeight;
        
        if (isFooterVisible) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      // Close notification dropdown if clicking outside
      if (notificationDropdownOpen && !event.target.closest('[data-notification-dropdown]')) {
        closeNotificationDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationDropdownOpen, closeNotificationDropdown]);

  // Close user dropdown on route change and support Escape key to close
  useEffect(() => {
    if (userDropdownOpen) {
      const handleKey = (e) => {
        if (e.key === 'Escape') setUserDropdownOpen(false);
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [userDropdownOpen]);

  // Close notification dropdown on Escape key
  useEffect(() => {
    if (notificationDropdownOpen) {
      const handleKey = (e) => {
        if (e.key === 'Escape') closeNotificationDropdown();
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [notificationDropdownOpen, closeNotificationDropdown]);

  useEffect(() => {
    // Close dropdown when navigating to another route
    setUserDropdownOpen(false);
    closeNotificationDropdown();
  }, [location.pathname, closeNotificationDropdown]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      toast.success('Dark mode enabled 🌙', { duration: 2000 });
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('Light mode enabled ☀️', { duration: 2000 });
    }
  };

  const handleLogout = async () => {
    try {
      console.log('[Navbars] Logout initiated');
      
      // Call logout API which clears token and localStorage
      await dispatch(logoutUser()).unwrap();
      
      // Double-check everything is cleared
      dispatch({ type: 'auth/clearAuth' });
      localStorage.removeItem('redirectAfterAuth');
      localStorage.removeItem('linkify_token');
      sessionStorage.clear();
      
      // Note: We don't sign out of Google accounts globally
      // The prompt=select_account parameter will show account picker on next login
      
      toast.success('Logged out successfully');
      console.log('[Navbars] Logout complete, navigating to login');
      
      // Small delay to ensure state is cleared before navigation
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    } catch (error) {
      console.error('[Navbars] Logout error:', error);
      // Even on error, ensure everything is cleared
      dispatch({ type: 'auth/clearAuth' });
      localStorage.clear();
      sessionStorage.clear();
      toast.error('Logout completed');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    }
  };

  // Vibration utility function
  const triggerVibration = (pattern = 'tap') => {
    if (!('vibrate' in navigator)) return;
    
    const patterns = {
      tap: 50,                    // Short tap
      longPress: 100              // Long press confirmation
    };
    
    navigator.vibrate(patterns[pattern] || 50);
  };

  // Long press handlers
  const handlePressStart = () => {
    pressStartTimeRef.current = Date.now();
    isLongPressRef.current = false;
    
    // Set timeout for long press
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      
      // Trigger vibration when long press is detected
      triggerVibration('longPress');
      
      setMobileMenuOpen(true);
    }, 500);
  };

  const handlePressEnd = () => {
    // Clear timeout
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Check if it was a short press
    if (pressStartTimeRef.current && !isLongPressRef.current) {
      const pressDuration = Date.now() - pressStartTimeRef.current;
      if (pressDuration < 500) {
        // Short press - navigate to profile
        triggerVibration('tap');
        navigate('/profile/me');
      }
    }

    // Reset
    pressStartTimeRef.current = null;
    isLongPressRef.current = false;
  };

  const handlePressCancel = () => {
    // Clear timeout
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Reset
    pressStartTimeRef.current = null;
    isLongPressRef.current = false;
  };

  // Dynamic nav links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { to: "/", label: "Home", icon: Home },
      { to: "/jobs", label: "Browse Jobs", icon: Briefcase },
    ];

    if (isAuthenticated && user) {
      if (user.role === 'freelancer') {
        return [
          ...baseLinks,
          { to: "/jobs/recommended", label: "Recommended", icon: Briefcase, badge: true },
          { to: "/contracts", label: "Contracts", icon: FileText },
          { to: "/messages", label: "Messages", icon: MessageSquare },
        ];
      } else if (user.role === 'client') {
        return [
          ...baseLinks,
          { to: "/jobs/my-jobs", label: "My Jobs", icon: Briefcase },
          { to: "/contracts", label: "Contracts", icon: FileText },
          { to: "/messages", label: "Messages", icon: MessageSquare },
        ];
      }
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();
  
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Logout Loading Overlay */}
      {isLoggingOut && <Loader variant="fullscreen" text="Logging Out" />}
      
      {/* Desktop & Tablet Navbar - Hidden when footer visible */}
      {/*
        Desktop-only changes (lg+):
        - Reduced vertical padding and overall height for a lighter header
        - Increased horizontal spacing for balanced layout (logo / center links / actions)
        - Nav link sizes reduced and given focus-visible rings for keyboard users
        - Moved theme toggle into the user dropdown to declutter header
        - User dropdown aligned to open below the navbar and given a constrained max height
        These adjustments apply only to the lg+ nav markup below.
      */}
      <motion.nav 
        ref={navbarRef}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:block fixed top-4 left-0 right-0 z-50 px-4"
      >
        <div className="relative max-w-7xl mx-auto overflow-visible">
          {/* Glassmorphism Container */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100/40 dark:border-gray-800/30 shadow-lg px-6 py-1 h-16">
            <div className="flex justify-between items-center h-full flex-nowrap whitespace-nowrap">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 cursor-pointer">
                <span className="text-2xl font-bold text-brand tracking-tight">Linkify</span>
              </Link>
              
              {/* Desktop Navigation Links - center aligned. 
                  At lg we use tighter gaps to avoid wrapping; xl restores full spacing. */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-8 lg:gap-4 xl:gap-8">
                  {navLinks.map((link) => (
                    <Link key={link.to} to={link.to} className="relative">
                      <motion.div
                        className={`flex items-center space-x-2 px-3 py-1.5 lg:px-3 lg:py-1 xl:px-4 xl:py-1.5 rounded-lg transition-colors duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand cursor-pointer whitespace-nowrap ${
                          isActive(link.to)
                            ? 'bg-brand/95 text-white shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <link.icon className="h-4 w-4" />
                        <span className="font-medium">{link.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
              
                {/* Right Side Actions */}
                {/* At lg (1024px) we reduce gaps and collapse some actions into the dropdown to avoid overflow.
                  At xl we show full actions including Post a Job and username. */}
                <div className="flex items-center gap-6 lg:gap-4 xl:gap-6">
                {/* Desktop theme toggle removed from top bar.
                    Moved into the desktop user dropdown to declutter header.
                    Tablet/mobile toggles remain untouched elsewhere. */}

                {isAuthenticated ? (
                  <>
                    {/* Client Post Job Button */}
                    {user?.role === 'client' && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-shrink-0">
                        {/* Show full Post a Job only at xl. At lg it's collapsed into dropdown to prevent overflow. */}
                        <Link 
                          to="/jobs/create" 
                          className="hidden xl:inline-flex px-3 py-1.5 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand whitespace-nowrap"
                        >
                          Post a Job
                        </Link>
                      </motion.div>
                    )}
                    
                    {/* Notifications */}
                    <div className="relative" data-notification-dropdown>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Debug: track when navbar notification dialog is toggled
                          const nextState = !notificationDropdownOpen;
                          console.log(
                            '[Navbar] Notification bell clicked. Dialog will be:',
                            nextState ? 'OPEN' : 'CLOSED'
                          );
                          toggleNotificationDropdown();
                        }}
                        className="relative p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex-shrink-0"
                      >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </motion.button>

                      {/* Notification Dropdown */}
                      <AnimatePresence>
                        {notificationDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.985 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-[99999]"
                          >
                            {/* Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-brand/8 to-brand-dark/8 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Notifications
                                </h3>
                                {unreadCount > 0 && (
                                  <button
                                    onClick={markAllRead}
                                    className="text-xs text-brand hover:text-brand-dark font-medium"
                                  >
                                    Mark all read
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                              {notificationsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader size="sm" />
                                </div>
                              ) : notificationList.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No notifications yet
                                  </p>
                                </div>
                              ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {notificationList.map((notification, index) => {
                                    // Get notification ID with fallback to index for key prop
                                    const nid = notification?._id ?? notification?.id ?? `notification-${index}`;
                                    
                                    return (
                                      <div
                                        key={nid}
                                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                        onClick={() => {
                                          // Only mark as read if we have a valid ID and notification is unread
                                          if (!notification.isRead && nid && nid !== `notification-${index}`) {
                                            try {
                                              markAsRead(nid);
                                            } catch (error) {
                                              console.error('[Navbars] Error marking notification as read:', error);
                                            }
                                          }
                                          closeNotificationDropdown();
                                          const data = notification.data || notification.payload || {};
                                          if (data.conversationId) {
                                            navigate(`/messages/${data.conversationId}`);
                                          } else if (data.jobId) {
                                            navigate(`/jobs/${data.jobId}`);
                                          } else if (data.contractId) {
                                            navigate(`/contracts/${data.contractId}`);
                                          } else if (notification.link) {
                                            navigate(notification.link);
                                          }
                                        }}
                                      >
                                        <div className="flex items-start space-x-3">
                                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                                            !notification.isRead ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                          }`} />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                              {notification.title || notification.type || 'Notification'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                              {notification.message || 'No message available'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                              {(() => {
                                                const t = formatNotificationDate(notification);
                                                return t.time ? `${t.date} at ${t.time}` : t.date;
                                              })()}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Footer */}
                            {notificationList.length > 0 && (
                              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                                <button
                                  onClick={() => {
                                    closeNotificationDropdown();
                                    navigate('/notifications'); // You might want to create this route
                                  }}
                                  className="text-sm text-brand hover:text-brand-dark font-medium"
                                >
                                  View all notifications
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <motion.button 
                        id="user-menu-button"
                        aria-controls="user-menu-desktop"
                        aria-expanded={userDropdownOpen}
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand cursor-pointer flex-shrink-0"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        {/* Hide username at lg to save horizontal space; show at xl */}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden xl:inline-block truncate">
                          {user?.name?.split(' ')[0] || 'User'}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                      </motion.button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {userDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.985 }}
                            transition={{ duration: 0.2 }}
                            // Ensure dropdown opens below the navbar (not overlapping): use top-full
                            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-y-auto z-50 max-h-[70vh]"
                            style={{ minWidth: 220 }}
                          >
                            {/* User Info Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-brand/8 to-brand-dark/8 border-b border-transparent">
                              <div className="flex items-center space-x-3">
                                {user?.avatar ? (
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email || ''}
                                  </p>
                                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-brand/20 text-brand-dark">
                                    {user?.role || 'User'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                              <Link
                                to="/dashboard"
                                onClick={() => setUserDropdownOpen(false)}
                                role="menuitem"
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <LayoutDashboard className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">Dashboard</span>
                              </Link>
                              <Link
                                to="/profile"
                                onClick={() => setUserDropdownOpen(false)}
                                role="menuitem"
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <UserCircle className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">My Profile</span>
                              </Link>

                              {/* Post a Job moved here for lg (visible at lg and hidden at xl)
                                  - prevents header overflow on laptop widths
                                  - hidden at xl to avoid duplicate top-bar CTA */}
                              {user?.role === 'client' && (
                                <Link
                                  to="/jobs/create"
                                  onClick={() => setUserDropdownOpen(false)}
                                  role="menuitem"
                                  className="hidden lg:flex xl:hidden items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                                >
                                  <Plus className="h-5 w-5 text-brand" />
                                  <span className="text-sm font-medium">Post a Job</span>
                                </Link>
                              )}

                              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                              {/* Wallet & Payments Section */}
                              <Link
                                to="/wallet"
                                onClick={() => setUserDropdownOpen(false)}
                                role="menuitem"
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <Wallet className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">My Wallet</span>
                              </Link>
                              <Link
                                to="/transactions"
                                onClick={() => setUserDropdownOpen(false)}
                                role="menuitem"
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <Receipt className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">Transactions</span>
                              </Link>
                              <Link
                                to="/withdrawals"
                                onClick={() => setUserDropdownOpen(false)}
                                role="menuitem"
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <ArrowUpDown className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">Withdrawals</span>
                              </Link>

                              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                              <Link
                                to="/settings"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <Settings className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">Settings</span>
                              </Link>

                              <Link
                                to="/billing"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <CreditCard className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">Billing</span>
                              </Link>

                              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                              <Link
                                to="/help"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md"
                              >
                                <HelpCircle className="h-5 w-5 text-brand" />
                                <span className="text-sm font-medium">Help & Support</span>
                              </Link>

                                  {/* Divider */}
                                  <div className="my-2 border-t border-gray-100 dark:border-gray-700"></div>

                                  {/* Theme toggle moved into desktop dropdown
                                      - keeps preference persistence via existing toggleDarkMode()
                                      - shows current mode and uses accessible label
                                      - desktop-only placement (tablet/mobile unchanged)
                                  */}
                                  <div className="px-4 py-2">
                                    <button
                                      onClick={() => toggleDarkMode()}
                                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                                      aria-label="Toggle theme"
                                    >
                                      <div className="flex items-center gap-3">
                                        {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                                        <div className="text-sm">
                                          <div className="font-medium">Theme</div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400">{darkMode ? 'Dark' : 'Light'}</div>
                                        </div>
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">Switch</div>
                                    </button>
                                  </div>

                                  {/* Divider */}
                                  <div className="my-2 border-t border-gray-100 dark:border-gray-700"></div>

                                  {/* Logout Button */}
                                  <button
                                    onClick={() => {
                                      setUserDropdownOpen(false);
                                      handleLogout();
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-md"
                                  >
                                    <LogOut className="h-5 w-5" />
                                    <span className="text-sm font-medium">Logout</span>
                                  </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="ghost" 
                          className="font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                        >
                          Login
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/register">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          className="font-medium bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg shadow-brand/30 hover:shadow-xl hover:shadow-brand/40 rounded-xl"
                        >
                          Get Started
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Tablet Menu Button */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="hidden md:block lg:hidden fixed top-4 right-4 z-50"
      >
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl text-gray-700 dark:text-gray-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </motion.div>

      {/* Tablet Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="hidden md:block lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="hidden md:block lg:hidden fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-2xl font-bold text-brand tracking-tight">Linkify</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* User Profile (if authenticated) */}
                {isAuthenticated && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-brand/10 to-brand-dark/10 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover shadow-lg ring-2 ring-brand/30"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-brand/20 text-brand-dark">
                          {user?.role || 'User'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl flex items-center justify-center space-x-2">
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Go to Dashboard</span>
                        </Button>
                      </Link>
                      
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl border-brand text-brand hover:bg-brand/10 flex items-center justify-center space-x-2">
                          <UserCircle className="h-4 w-4" />
                          <span>My Profile</span>
                        </Button>
                      </Link>
                    </div>

                    {/* Wallet & Payments Section */}
                    <div className="mt-4 space-y-2">
                      <Link to="/wallet" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl border-brand text-brand hover:bg-brand/10 flex items-center justify-center space-x-2">
                          <Wallet className="h-4 w-4" />
                          <span>My Wallet</span>
                        </Button>
                      </Link>
                      <Link to="/transactions" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center space-x-2">
                          <Receipt className="h-4 w-4" />
                          <span>Transactions</span>
                        </Button>
                      </Link>
                      <Link to="/withdrawals" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center space-x-2">
                          <ArrowUpDown className="h-4 w-4" />
                          <span>Withdrawals</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActive(link.to)
                          ? 'bg-brand text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Dark Mode Toggle */}
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        darkMode ? 'bg-brand' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                        animate={{ x: darkMode ? 26 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        {darkMode ? (
                          <Moon className="h-3 w-3 text-brand" />
                        ) : (
                          <Sun className="h-3 w-3 text-yellow-500" />
                        )}
                      </motion.div>
                    </button>
                  </div>
                </div>

                {/* Auth Buttons (if not authenticated) */}
                {!isAuthenticated && (
                  <div className="mt-6 space-y-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl border-2 border-brand text-brand hover:bg-brand hover:text-white">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg rounded-xl">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Additional Menu Items (if authenticated) */}
                {isAuthenticated && (
                  <div className="mt-6 space-y-2">
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Settings className="h-5 w-5 text-brand" />
                      <span className="font-medium">Settings</span>
                    </Link>

                    <Link
                      to="/billing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <CreditCard className="h-5 w-5 text-brand" />
                      <span className="font-medium">Billing</span>
                    </Link>

                    <Link
                      to="/help"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <HelpCircle className="h-5 w-5 text-brand" />
                      <span className="font-medium">Help & Support</span>
                    </Link>
                  </div>
                )}

                {/* Logout Button (if authenticated) */}
                {isAuthenticated && (
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation - Hidden on message conversation pages */}
      {!location.pathname.match(/^\/messages\/[^/]+$/) && (
        <motion.nav 
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-3 rounded-t-3xl shadow-2xl">
          <div className="flex justify-around items-center">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  className={`p-3 rounded-2xl ${
                    isActive(link.to)
                      ? 'bg-brand text-white shadow-lg shadow-brand/30'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon className="h-6 w-6" />
                </motion.div>
                {isActive(link.to) && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute -bottom-3 w-1 h-1 bg-brand rounded-full"
                  />
                )}
              </Link>
            ))}
            
            {/* Profile/Menu Button */}
            {isAuthenticated ? (
              <div className="relative flex flex-col items-center">
                <motion.div
                  onPointerDown={handlePressStart}
                  onPointerUp={handlePressEnd}
                  onPointerLeave={handlePressCancel}
                  onPointerCancel={handlePressCancel}
                  className={`rounded-2xl cursor-pointer select-none ${
                    isActive('/profile') || isActive('/profile/me')
                      ? 'ring-2 ring-brand shadow-lg shadow-brand/30'
                      : ''
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover pointer-events-none"
                      draggable="false"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center text-white font-semibold shadow-lg pointer-events-none">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </motion.div>
              </div>
            ) : (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  className="p-3 rounded-2xl text-gray-600 dark:text-gray-400"
                  whileTap={{ scale: 0.9 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              </button>
            )}
          </div>
        </div>
      </motion.nav>
      )}

      {/* Mobile Menu Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl p-6 pb-28 max-h-[85vh] overflow-y-auto"
            >
              {/* Handle Bar */}
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>

              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-brand/10 to-brand-dark/10 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover shadow-lg ring-2 ring-brand/30"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-brand/20 text-brand-dark">
                          {user?.role || 'User'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4 mb-6">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full mb-2 h-12 bg-gradient-to-r from-brand to-brand-dark text-white rounded-xl flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Button>
                    </Link>
                    
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand hover:text-brand rounded-xl flex items-center justify-center space-x-2 font-medium shadow-sm hover:shadow-md transition-all">
                        <UserCircle className="h-5 w-5" />
                        <span>My Profile</span>
                      </Button>
                    </Link>
                  </div>

                  {/* Wallet & Payments Section */}
                  <div className="space-y-2 mb-4">
                    <Link
                      to="/wallet"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Wallet className="h-5 w-5 text-brand" />
                      <span className="font-medium">My Wallet</span>
                    </Link>
                    <Link
                      to="/transactions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Receipt className="h-5 w-5 text-brand" />
                      <span className="font-medium">Transactions</span>
                    </Link>
                    <Link
                      to="/withdrawals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <ArrowUpDown className="h-5 w-5 text-brand" />
                      <span className="font-medium">Withdrawals</span>
                    </Link>
                  </div>

                  {/* Additional Menu Items */}
                  <div className="space-y-2 mb-4">
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Settings className="h-5 w-5 text-brand" />
                      <span className="font-medium">Settings</span>
                    </Link>

                    <Link
                      to="/billing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <CreditCard className="h-5 w-5 text-brand" />
                      <span className="font-medium">Billing</span>
                    </Link>

                    <Link
                      to="/help"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <HelpCircle className="h-5 w-5 text-brand" />
                      <span className="font-medium">Help & Support</span>
                    </Link>

                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      {darkMode ? (
                        <>
                          <Sun className="h-5 w-5 text-brand" />
                          <span className="font-medium">Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5 text-brand" />
                          <span className="font-medium">Dark Mode</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full h-12 flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all font-semibold shadow-sm"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full mb-2 h-12 rounded-xl border-2 border-brand text-brand hover:bg-brand hover:text-white font-medium">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-12 bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg rounded-xl font-medium">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Swipeable Dark Mode Toggle - iOS Style */}
                  <div className="w-full px-4 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {darkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Swipe to switch
                      </span>
                    </div>
                    <motion.div
                      className={`relative w-full h-14 rounded-[20px] overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gradient-to-r from-gray-800/90 via-gray-900/90 to-black/90' 
                          : 'bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90'
                      }`}
                      style={{
                        boxShadow: darkMode 
                          ? 'inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.1)' 
                          : 'inset 0 2px 8px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    >
                      {/* Swipe Indicator Particles */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0 }}
                      >
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-1 h-1 rounded-full ${darkMode ? 'bg-white/40' : 'bg-brand/40'}`}
                            style={{
                              top: `${20 + i * 10}%`,
                              left: darkMode ? `${10 + i * 5}%` : `${60 + i * 5}%`
                            }}
                          />
                        ))}
                      </motion.div>

                      <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        dragMomentum={false}
                        onDrag={(e, info) => {
                          // Create ripple effect while dragging
                          const direction = info.offset.x > 0 ? 'right' : 'left';
                          if (Math.abs(info.offset.x) > 10) {
                            // Trigger haptic feedback
                            if ('vibrate' in navigator) {
                              navigator.vibrate(1);
                            }
                          }
                        }}
                        onDragEnd={(e, { offset, velocity }) => {
                          const swipe = offset.x;
                          const swipeVelocity = velocity.x;
                          
                          // Determine if it's a significant swipe
                          if (Math.abs(swipe) > 60 || Math.abs(swipeVelocity) > 600) {
                            // Trigger success haptic
                            if ('vibrate' in navigator) {
                              navigator.vibrate([30, 10, 30]);
                            }
                            
                            if (darkMode && (swipe < -60 || swipeVelocity < -600)) {
                              // Swipe left when dark mode is on -> turn off (light mode)
                              toggleDarkMode();
                            } else if (!darkMode && (swipe > 60 || swipeVelocity > 600)) {
                              // Swipe right when light mode is on -> turn on dark mode
                              toggleDarkMode();
                            }
                          }
                        }}
                        className={`absolute top-1 h-12 rounded-[18px] flex items-center justify-center font-semibold text-sm backdrop-blur-xl transition-all duration-300 ${
                          darkMode 
                            ? 'left-1 right-[50%] bg-gradient-to-br from-gray-700/95 via-gray-800/95 to-gray-900/95 text-white shadow-2xl' 
                            : 'left-[50%] right-1 bg-white/95 text-gray-800 shadow-2xl'
                        }`}
                        style={{
                          boxShadow: darkMode
                            ? '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                            : '0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                          border: darkMode 
                            ? '1px solid rgba(255,255,255,0.1)' 
                            : '1px solid rgba(0,0,0,0.05)'
                        }}
                        whileDrag={{ 
                          scale: 0.98,
                          boxShadow: darkMode 
                            ? '0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 20px rgba(132, 169, 140, 0.3)'
                            : '0 12px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,1), 0 0 20px rgba(132, 169, 140, 0.4)'
                        }}
                        animate={{
                          left: darkMode ? '4px' : '50%',
                          right: darkMode ? '50%' : '4px'
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 35,
                          mass: 0.8
                        }}
                      >
                        <motion.div
                          className="flex items-center space-x-2 px-2"
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 0.5,
                            repeat: 0,
                            repeatType: "reverse"
                          }}
                        >
                          {darkMode ? (
                            <>
                              <motion.div
                                animate={{ 
                                  rotate: 360,
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                                }}
                              >
                                <Moon className="h-5 w-5" />
                              </motion.div>
                              <span className="font-semibold">Dark</span>
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={{ 
                                  rotate: 360,
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                                }}
                              >
                                <Sun className="h-5 w-5 text-yellow-500" />
                              </motion.div>
                              <span className="font-semibold">Light</span>
                            </>
                          )}
                        </motion.div>
                      </motion.div>

                      {/* Glow Effect on Swipe */}
                      <motion.div
                        className={`absolute inset-0 rounded-[20px] pointer-events-none ${
                          darkMode 
                            ? 'bg-gradient-to-r from-brand/20 via-transparent to-transparent'
                            : 'bg-gradient-to-l from-brand/20 via-transparent to-transparent'
                        }`}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.5 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
