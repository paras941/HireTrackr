import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
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
      className="auth-background flex min-h-screen items-center justify-center p-4"
    >
      {/* Floating Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] h-64 w-64 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[10%] h-96 w-96 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[40%] top-[70%] h-48 w-48 rounded-full bg-pink-500/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
        {/* Left Side - Form */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full bg-white p-8 lg:w-1/2 lg:p-12"
        >
          <div className="mx-auto max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">HireTrackr</span>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Create your account</h2>
              <p className="mb-8 text-gray-500">Start tracking your dream job applications</p>
            </motion.div>

            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="input-modern"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="input-modern"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="input-modern"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={loading}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 transition-colors hover:text-purple-600"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-xs text-gray-400"
            >
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side - Features */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden w-1/2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-12 backdrop-blur-xl lg:block"
        >
          <div className="flex h-full flex-col justify-between text-white">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
              >
                <Briefcase className="h-8 w-8" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-2 text-4xl font-bold"
              >
                HireTrackr
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8 text-lg text-white/80"
              >
                Everything you need to land your dream job
              </motion.p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                    <span className="text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 rounded-2xl bg-white/10 p-6 backdrop-blur-sm"
            >
              <p className="mb-4 text-white/90">
                "HireTrackr helped me land my dream job at a top tech company. The ATS scoring feature was a game-changer!"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-sm font-bold">
                  SK
                </div>
                <div>
                  <p className="font-semibold">Sarah Kim</p>
                  <p className="text-sm text-white/60">Software Engineer at Google</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
