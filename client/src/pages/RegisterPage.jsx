import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { ArrowRight, Briefcase, CheckCircle2, User, Mail, Lock } from "lucide-react";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await http.post("/auth/register", form);
      login(data.token, data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "AI-powered resume analysis",
    "Visual Kanban job tracking",
    "Smart application insights",
    "Interview preparation tips",
    "Progress analytics dashboard"
  ];

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
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
            rotate: [0, -15, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-[15%] h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 40, 0], 
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 15, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] left-[8%] h-96 w-96 rounded-full bg-gradient-to-tr from-pink-500/10 to-purple-500/10 dark:from-pink-500/5 dark:to-purple-500/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[45%] top-[50%] h-64 w-64 rounded-full bg-pink-500/5 dark:bg-pink-500/3 blur-3xl"
        />
      </div>

      {/* Register Box Wrapper */}
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl transition-all duration-350">
        
        {/* Left Side - Register Form */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-8 lg:w-1/2 lg:p-12 bg-white/40 dark:bg-slate-900/40 border-r border-slate-200/50 dark:border-slate-850"
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
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create account</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Start tracking your dream job applications today</p>
            </motion.div>

            <motion.form
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors duration-205 group-focus-within:text-indigo-500" />
                  <input
                    type="text"
                    className="input-modern !pl-12"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors duration-205 group-focus-within:text-indigo-500" />
                  <input
                    type="email"
                    className="input-modern !pl-12"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors duration-205 group-focus-within:text-indigo-500" />
                  <input
                    type="password"
                    className="input-modern !pl-12"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-base font-semibold shadow-indigo-500/20 mt-6"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4.5 w-4.5 transition-transform duration-250 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-sm"
            >
              <p className="text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-xs text-slate-400 leading-relaxed"
            >
              By creating an account, you agree to our Terms of Service & Privacy Policy.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side - Branding & Testimonial */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden w-1/2 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 dark:from-indigo-950/20 dark:to-purple-950/20 p-12 lg:flex flex-col justify-between text-slate-800 dark:text-slate-200"
        >
          <div>
            <motion.div
              initial={{ scale: 0.8, rotate: 10 }}
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
              Everything you need to land your dream job
            </motion.p>

            <div className="space-y-4 my-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-350">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonial Quote */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md shadow-sm"
          >
            <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">
              "HireTrackr helped me land my dream job at a top tech company. The ATS scoring feature was a game-changer!"
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-200/40 dark:border-slate-800/40 pt-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-xs font-bold text-white shadow-md">
                SK
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Sarah Kim</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Software Engineer at Google</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
