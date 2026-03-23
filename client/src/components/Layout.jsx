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
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 shadow-lg backdrop-blur-xl"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30"
            >
              <Briefcase className="h-5 w-5 text-white" />
            </motion.div>
            <span className="hidden text-xl font-bold sm:block">
              <span className="gradient-text">HireTrackr</span>
            </span>
          </NavLink>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
                  >
                    <div className="border-b border-slate-100 p-4">
                      <h3 className="font-semibold text-slate-900">Notifications</h3>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-2">
                      <NotificationItem
                        icon={<Sparkles className="h-4 w-4 text-yellow-500" />}
                        title="New recommendation"
                        message="2 new job roles match your profile"
                        time="2 min ago"
                      />
                      <NotificationItem
                        icon={<Bell className="h-4 w-4 text-blue-500" />}
                        title="Follow-up reminder"
                        message="Time to follow up with Google"
                        time="1 hour ago"
                      />
                      <NotificationItem
                        icon={<HelpCircle className="h-4 w-4 text-green-500" />}
                        title="Pro tip"
                        message="Update your resume for better ATS scores"
                        time="1 day ago"
                      />
                    </div>
                    <div className="border-t border-slate-100 p-2">
                      <button className="w-full rounded-xl py-2 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            <div className="relative ml-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 p-1.5 pr-3 transition-all hover:shadow-md"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                  {getInitials(user?.name)}
                </div>
                <span className="hidden text-sm font-medium text-slate-700 sm:block">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
                  >
                    <div className="border-b border-slate-100 p-4">
                      <p className="font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <DropdownItem icon={<User className="h-4 w-4" />} label="Profile" />
                      <DropdownItem icon={<Settings className="h-4 w-4" />} label="Settings" />
                      <DropdownItem icon={<HelpCircle className="h-4 w-4" />} label="Help Center" />
                    </div>
                    <div className="border-t border-slate-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Built with HireTrackr
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-600">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-600">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-600">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Click outside handler */}
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
  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
    {icon}
    {label}
  </button>
);

const NotificationItem = ({ icon, title, message, time }) => (
  <div className="flex cursor-pointer gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="font-medium text-slate-900">{title}</p>
      <p className="truncate text-sm text-slate-500">{message}</p>
      <p className="mt-1 text-xs text-slate-400">{time}</p>
    </div>
  </div>
);

export default Layout;
