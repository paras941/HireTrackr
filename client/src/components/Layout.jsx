import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Settings,
  HelpCircle,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Theme state initialization
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme to HTML class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
    >
      {/* Sticky Header with Glassmorphism */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 shadow-md backdrop-blur-xl"
            : "bg-white/40 dark:bg-slate-950/40 border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 6 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 text-white"
            >
              <Briefcase className="h-5 w-5" />
            </motion.div>
            <span className="hidden text-xl font-extrabold sm:block tracking-tight text-slate-900 dark:text-white">
              Hire<span className="gradient-text">Trackr</span>
            </span>
          </NavLink>

          {/* Navigation & Toolbar */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </motion.button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white dark:ring-slate-900" />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl z-55"
                  >
                    <div className="border-b border-slate-100 dark:border-slate-800 p-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                      <NotificationItem
                        icon={<Sparkles className="h-4 w-4 text-amber-500" />}
                        title="New Recommendation"
                        message="2 new job roles match your profile"
                        time="2 min ago"
                      />
                      <NotificationItem
                        icon={<Bell className="h-4 w-4 text-indigo-500" />}
                        title="Follow-up Reminder"
                        message="Time to follow up with Google"
                        time="1 hour ago"
                      />
                      <NotificationItem
                        icon={<HelpCircle className="h-4 w-4 text-emerald-500" />}
                        title="Pro Tip"
                        message="Update your resume for better ATS scores"
                        time="1 day ago"
                      />
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 p-2">
                      <button className="w-full rounded-xl py-2 text-center text-sm font-semibold text-indigo-650 dark:text-indigo-400 hover:bg-indigo-500/5 transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-1 sm:ml-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 p-1.5 pr-2.5 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-sm"
              >
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                  {getInitials(user?.name)}
                </div>
                <span className="hidden text-sm font-bold text-slate-700 dark:text-slate-300 sm:block">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-250 ${showDropdown ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl z-55"
                  >
                    <div className="border-b border-slate-100 dark:border-slate-800 p-4">
                      <p className="font-bold text-slate-900 dark:text-white leading-none">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <DropdownItem icon={<User className="h-4 w-4" />} label="Profile" />
                      <DropdownItem icon={<Settings className="h-4 w-4" />} label="Settings" />
                      <DropdownItem icon={<HelpCircle className="h-4 w-4" />} label="Help Center" />
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 p-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-500 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Main Layout Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs font-semibold text-slate-450 dark:text-slate-500">
              © {new Date().getFullYear()} HireTrackr. Made with pride.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-xs font-bold text-slate-550 dark:text-slate-450 hover:text-indigo-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs font-bold text-slate-550 dark:text-slate-450 hover:text-indigo-500 transition-colors">
                Terms of Use
              </a>
              <a href="#" className="text-xs font-bold text-slate-550 dark:text-slate-450 hover:text-indigo-500 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Background click overlay when dropdowns are open */}
      {(showDropdown || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}
    </motion.div>
  );
};

const DropdownItem = ({ icon, label }) => (
  <motion.button
    whileHover={{ x: 3 }}
    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
  >
    {icon}
    {label}
  </motion.button>
);

const NotificationItem = ({ icon, title, message, time }) => (
  <motion.div
    whileHover={{ x: 2, backgroundColor: "rgba(99, 102, 241, 0.03)" }}
    className="flex cursor-pointer gap-3 rounded-xl p-2.5 transition-all"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
      <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">{message}</p>
      <p className="mt-1 text-[10px] text-slate-400">{time}</p>
    </div>
  </motion.div>
);

export default Layout;
