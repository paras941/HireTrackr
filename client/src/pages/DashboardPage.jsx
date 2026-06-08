import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts";
import {
  Upload, FileText, Sparkles, Target,
  Briefcase, Plus, Clock, AlertCircle, CheckCircle2, XCircle,
  BarChart3, Lightbulb, ChevronRight, Zap, RefreshCw
} from "lucide-react";
import Layout from "../components/Layout";
import KanbanBoard from "../components/KanbanBoard";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";

const CircularProgress = ({ percentage }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
      <svg className="h-full w-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="fill-none stroke-slate-200 dark:stroke-slate-800"
          strokeWidth="5"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          className="fill-none stroke-indigo-500 dark:stroke-indigo-400"
          strokeWidth="5"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-extrabold text-slate-800 dark:text-white">
        {percentage}%
      </span>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [isResumeDragging, setIsResumeDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [newApp, setNewApp] = useState({ company: "", role: "", notes: "" });
  const [loading, setLoading] = useState({ upload: false, analyze: false, create: false });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [resumeRes, recRes, appRes, analyticsRes, reminderRes] = await Promise.all([
        http.get("/resume").catch(() => ({ data: null })),
        http.get("/insights/recommendations").catch(() => ({ data: [] })),
        http.get("/applications"),
        http.get("/insights/analytics"),
        http.get("/applications/reminders/list?days=7"),
      ]);
      setResume(resumeRes.data);
      setRecommendations(recRes.data || []);
      setApplications(appRes.data?.data || appRes.data || []);
      setAnalytics(analyticsRes.data);
      setReminders(reminderRes.data?.reminders || []);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleResumeFile = (file) => {
    if (!file) {
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error("Please upload a PDF file");
      return;
    }

    uploadResume(file);
  };

  const uploadResume = async (file) => {
    setLoading((l) => ({ ...l, upload: true }));
    try {
      const formData = new FormData();
      formData.append("resume", file);
      await http.post("/resume/upload", formData);
      toast.success("Resume uploaded successfully!");
      refreshData();
    } catch (err) {
      toast.error("Failed to upload resume");
    } finally {
      setLoading((l) => ({ ...l, upload: false }));
    }
  };

  const runAnalysis = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    setLoading((l) => ({ ...l, analyze: true }));
    try {
      const { data } = await http.post("/resume/analyze", { jobDescription });
      setAnalysis(data);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error("Analysis failed");
    } finally {
      setLoading((l) => ({ ...l, analyze: false }));
    }
  };

  const createApplication = async (e) => {
    e.preventDefault();
    if (!newApp.company || !newApp.role) {
      toast.error("Please fill in company and role");
      return;
    }
    setLoading((l) => ({ ...l, create: true }));
    try {
      await http.post("/applications", {
        ...newApp,
        status: "Applied",
        jobDescription,
        missingKeywords: analysis?.missingKeywords || [],
        atsScore: analysis?.matchPercentage || 0
      });
      toast.success("Application added!");
      setNewApp({ company: "", role: "", notes: "" });
      refreshData();
    } catch (err) {
      toast.error("Failed to add application");
    } finally {
      setLoading((l) => ({ ...l, create: false }));
    }
  };

  const onStatusChange = async (id, status) => {
    try {
      await http.put(`/applications/${id}`, { status, lastResponseDate: new Date() });
      toast.success(`Status updated to ${status}`);
      refreshData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await http.delete(`/applications/${id}`);
      toast.success("Application deleted successfully");
      refreshData();
    } catch (err) {
      toast.error("Failed to delete application");
    }
  };

  const insights = useMemo(() => analytics?.smartInsights || [], [analytics]);

  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 40) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-450";
  };

  const handleResumeDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResumeDragging(true);
  };

  const handleResumeDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResumeDragging(false);
  };

  const handleResumeDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResumeDragging(false);

    const [file] = event.dataTransfer.files || [];
    handleResumeFile(file);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 20 } }
  };

  const CHART_COLORS = ['#6366f1', '#10b981', '#f43f5e'];

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-xl shadow-xl text-xs text-white">
          <p className="font-bold">{payload[0].name}</p>
          <p className="mt-1 text-indigo-400 font-semibold">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-xl shadow-xl text-xs text-white">
          <p className="font-bold">{payload[0].payload.skill}</p>
          <p className="mt-1 text-purple-400 font-semibold">Missing from {payload[0].value} job profiles</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Track your job applications and optimize your resume
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Total Applications"
            value={analytics?.totalApplications || 0}
            color="indigo"
            progress={100}
            description="Active database entries"
          />
          <StatsCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Interview Rate"
            value={`${analytics?.interviewRate || 0}%`}
            color="green"
            progress={analytics?.interviewRate || 0}
            description="Target interview rate: 30%"
          />
          <StatsCard
            icon={<XCircle className="h-5 w-5" />}
            label="Rejection Rate"
            value={`${analytics?.rejectionRate || 0}%`}
            color="red"
            progress={analytics?.rejectionRate || 0}
            description="Applications processed & inactive"
          />
          <StatsCard
            icon={<Clock className="h-5 w-5" />}
            label="Pending Follow-ups"
            value={reminders.length}
            color="yellow"
            progress={reminders.length > 0 ? Math.min(reminders.length * 20, 100) : 0}
            description="Actions required this week"
          />
        </motion.div>

        {/* Resume Upload & ATS Section */}
        <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 shadow-xl">
          <div className="border-b border-slate-200/50 dark:border-slate-800 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-950/20 dark:to-purple-950/20 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 text-white">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Resume ATS Optimizer</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Optimize your resume for Applicant Tracking Systems</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upload Section */}
              <div className="flex flex-col justify-between">
                <label
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
                    isResumeDragging
                      ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-400/5 shadow-inner"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-500/3 dark:hover:bg-indigo-400/3"
                  }`}
                  onDragOver={handleResumeDragOver}
                  onDragLeave={handleResumeDragLeave}
                  onDrop={handleResumeDrop}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleResumeFile(e.target.files?.[0])}
                    disabled={loading.upload}
                  />
                  {loading.upload ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                      <div className="spinner text-indigo-650" />
                      <p className="text-sm font-bold text-slate-650 dark:text-slate-350">Uploading and scanning...</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-650 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-350">
                        <Upload className="h-8 w-8" />
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">Drop your resume here</p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">PDF format only, maximum size 5MB</p>
                    </>
                  )}
                </label>

                {resume && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-400/5 p-4 text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold leading-none">Resume uploaded & parsed</p>
                      <p className="text-xs font-medium mt-1 truncate">{resume.fileName}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Target Job Description
                </label>
                <textarea
                  className="input-modern h-38 resize-none"
                  placeholder="Paste the job description here to analyze how well your resume matches..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={runAnalysis}
                  disabled={loading.analyze || !resume}
                  className="btn-primary mt-4 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading.analyze ? (
                    <>
                      <div className="spinner" />
                      <span>Scanning Match...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5" />
                      Analyze Match
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden border-t border-slate-200/50 dark:border-slate-800/80 pt-6"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Match Score Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">ATS Match Score</p>
                        <p className={`mt-2 text-4xl font-extrabold ${getScoreColor(analysis.matchPercentage)}`}>
                          {analysis.matchPercentage}%
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-2">Resume fit strength</p>
                      </div>
                      <CircularProgress percentage={analysis.matchPercentage} />
                    </div>

                    {/* Missing Keywords */}
                    <div className="rounded-2xl border border-rose-500/10 bg-rose-500/3 dark:bg-rose-450/3 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-550 dark:text-rose-400">Missing Keywords</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {analysis.missingKeywords.length > 0 ? (
                          analysis.missingKeywords.slice(0, 6).map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
                            >
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">None detected</span>
                        )}
                        {analysis.missingKeywords.length > 6 && (
                          <span className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                            +{analysis.missingKeywords.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/3 dark:bg-emerald-450/3 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Top Recommendation</p>
                      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">
                        {analysis.suggestions[0] || "Great alignment! Your resume matches the job profile well."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Smart Recommendations */}
        <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-orange-500/20 text-white">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Smart Job Recommendations</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Custom recommendations matched against your experience</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <motion.div
                  key={rec.role}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="card-hover group cursor-pointer rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 p-5 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rec.score >= 70 ? 'from-emerald-400 to-green-500' : rec.score >= 40 ? 'from-amber-400 to-orange-500' : 'from-red-400 to-pink-500'}`} />
                  
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800 shadow-sm text-indigo-500 dark:text-indigo-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <span className={`badge ${rec.score >= 70 ? "badge-success" : rec.score >= 40 ? "badge-warning" : "badge-danger"}`}>
                      {rec.score}% match
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                    {rec.role}
                  </h3>
                  <p className="mt-1 text-xs text-slate-450 dark:text-slate-550">
                    Click to search roles
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-350 dark:text-slate-700" />
                <p className="mt-4 text-sm font-bold text-slate-550 dark:text-slate-450">No recommendations found</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-550">Upload your resume to scan matched role openings</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Job Application Tracker */}
        <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-650 shadow-md shadow-indigo-500/20 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Application Tracker</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Drag cards across stages to change application status</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Add Application Form */}
            <form onSubmit={createApplication} className="mb-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <input
                  className="input-modern"
                  placeholder="Company name"
                  value={newApp.company}
                  onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                  required
                />
                <input
                  className="input-modern"
                  placeholder="Role / Position"
                  value={newApp.role}
                  onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                  required
                />
                <input
                  className="input-modern"
                  placeholder="Notes (optional)"
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                />
                <motion.button
                  type="submit"
                  disabled={loading.create}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {loading.create ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Plus className="h-4.5 w-4.5" />
                      Add Job
                    </>
                  )}
                </motion.button>
              </div>

              {analysis && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-450"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ATS Score ({analysis.matchPercentage}%) will be automatically attached to this application
                </motion.p>
              )}
            </form>

            {/* Kanban Board */}
            <KanbanBoard 
              applications={applications} 
              onStatusChange={onStatusChange} 
              onDelete={onDelete} 
            />
          </div>
        </motion.section>

        {/* Analytics & Insights Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Analytics Dashboard */}
          <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-650 shadow-md shadow-violet-500/20 text-white">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Visual logs of your progress</p>
              </div>
            </div>

            {analytics ? (
              <div className="p-6">
                {/* Status Breakdown */}
                <div className="mb-6 border-b border-slate-200/40 dark:border-slate-800/40 pb-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Application Status</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie
                          data={analytics.statusBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={4}
                        >
                          {analytics.statusBreakdown.map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Top Missing Skills</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <BarChart data={analytics.mostCommonMissingSkills?.slice(0, 5)} layout="vertical" margin={{ left: -10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <YAxis dataKey="skill" type="category" width={80} stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 6, 6, 0]} />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-slate-400">
                <div className="spinner border-violet-500 mr-2" />
                <p className="text-sm font-semibold">Loading analytics...</p>
              </div>
            )}
          </motion.section>

          {/* Smart Insights & Follow-ups */}
          <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-855 bg-white/60 dark:bg-slate-900/60 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20 text-white">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Insights & Follow-ups</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Auto-generated reminders and optimization tasks</p>
              </div>
            </div>

            <div className="max-h-[460px] space-y-3 overflow-y-auto p-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className="flex items-start gap-4 rounded-xl border border-indigo-500/10 bg-indigo-500/3 dark:bg-indigo-400/3 p-4 transition-all"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-550 dark:text-indigo-450" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{insight}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400 self-center" />
                </motion.div>
              ))}

              {reminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id || index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (insights.length + index) * 0.08 }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  className="flex items-start gap-4 rounded-xl border border-amber-500/15 bg-amber-500/3 dark:bg-amber-400/3 p-4 transition-all"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-405">Action Required</p>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{reminder.message}</p>
                  </div>
                </motion.div>
              ))}

              {!insights.length && !reminders.length && (
                <div className="py-16 text-center">
                  <Lightbulb className="mx-auto h-12 w-12 text-slate-350 dark:text-slate-700" />
                  <p className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400">Insights and follow-ups will appear here</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-550">Add more job applications to receive AI advice</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </Layout>
  );
};

const StatsCard = ({ icon, label, value, color, progress, description }) => {
  const colorMap = {
    indigo: "from-indigo-500 to-purple-600 shadow-indigo-500/20 text-indigo-500",
    green: "from-green-500 to-emerald-600 shadow-green-500/20 text-emerald-500",
    red: "from-red-500 to-pink-650 shadow-red-500/20 text-pink-500",
    yellow: "from-yellow-500 to-orange-500 shadow-yellow-500/20 text-amber-500"
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 backdrop-blur-md shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-md text-white`}>
          {icon}
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${colorMap[color].split(' shadow-')[0]}`}
            />
          </div>
          {description && (
            <p className="mt-2 text-[10px] font-semibold text-slate-450 dark:text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPage;
