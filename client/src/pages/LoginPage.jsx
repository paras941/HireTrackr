import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Mail, Lock, ArrowRight, Briefcase, Sparkles } from "lucide-react";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await http.post("/auth/login", { email, password });
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="auth-background flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-350"
    >
      {/* Premium Floating Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -40, 0], 
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 15, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[15%] h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 40, 0], 
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
            rotate: [0, -15, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[8%] h-96 w-96 rounded-full bg-gradient-to-tr from-pink-500/10 to-purple-500/10 dark:from-pink-500/5 dark:to-purple-500/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[45%] top-[50%] h-64 w-64 rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-3xl"
        />
      </div>

      {/* Login Box Wrapper */}
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl transition-all duration-350">
        
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden w-1/2 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 dark:from-indigo-950/20 dark:to-purple-950/20 p-12 lg:block border-r border-slate-200/50 dark:border-slate-850"
        >
          <div className="flex h-full flex-col justify-between text-slate-800 dark:text-slate-200">
            <div>
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-white"
              >
                <Briefcase className="h-7 w-7" />
              </motion.div>
              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-extrabold tracking-tight"
              >
                HireTrackr
              </motion.h1>
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-lg text-slate-500 dark:text-slate-400 font-medium"
              >
                Your intelligent job application companion
              </motion.p>
            </div>

            {/* Smart Feature Checklist */}
            <div className="space-y-6 my-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">AI-Powered ATS Scoring</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Optimize your resume against target job profiles instantly</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Visual Kanban Tracking</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Organize applications with custom stages and drag & drop</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 dark:bg-pink-400/10 dark:text-pink-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Smart Insights & Alerts</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Receive actionable follow-up recommendations & reminders</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-slate-400 font-medium"
            >
              Trusted by tech job seekers globally
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-8 lg:w-1/2 lg:p-12 bg-white/40 dark:bg-slate-900/40"
        >
          <div className="mx-auto max-w-md">
            {/* Mobile Branding */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold gradient-text">HireTrackr</span>
            </div>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to continue your career journey</p>
            </motion.div>

            <motion.form
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-500" />
                  <input
                    type="email"
                    className="input-modern !pl-12"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-500" />
                  <input
                    type="password"
                    className="input-modern !pl-12"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-base font-semibold shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Signing you in...</span>
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4.5 w-4.5 transition-transform duration-250 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>

              <div className="relative my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OR</span>
                <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent dark:from-slate-800" />
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-sm"
            >
              <p className="text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  Create one free
                </Link>
              </p>
            </motion.div>

            {/* Quick Start Panel */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 rounded-2xl border border-indigo-500/10 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 p-4 text-center"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                ⚡ Quick Start
              </span>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Sign up with any email to explore all features instantly.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
