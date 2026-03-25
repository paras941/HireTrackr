import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts";
import {
  Upload, FileText, Sparkles, Target, TrendingUp,
  Briefcase, Plus, Clock, AlertCircle, CheckCircle2, XCircle,
  BarChart3, Lightbulb, ChevronRight, Zap, RefreshCw
} from "lucide-react";
import Layout from "../components/Layout";
import KanbanBoard from "../components/KanbanBoard";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
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
      setApplications(appRes.data || []);
      setAnalytics(analyticsRes.data);
      setReminders(reminderRes.data?.reminders || []);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const uploadResume = async (file) => {
    setLoading((l) => ({ ...l, upload: true }));
    try {
      const formData = new FormData();
      formData.append("resume", file);
      await http.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  const insights = useMemo(() => analytics?.smartInsights || [], [analytics]);

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score) => {
    if (score >= 70) return "from-green-500 to-emerald-500";
    if (score >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const COLORS = ['#6366f1', '#22c55e', '#ef4444'];

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
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="mt-1 text-slate-500">
              Track your job applications and optimize your resume
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 disabled:opacity-50"
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
          />
          <StatsCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Interview Rate"
            value={`${analytics?.interviewRate || 0}%`}
            color="green"
          />
          <StatsCard
            icon={<XCircle className="h-5 w-5" />}
            label="Rejection Rate"
            value={`${analytics?.rejectionRate || 0}%`}
            color="red"
          />
          <StatsCard
            icon={<Clock className="h-5 w-5" />}
            label="Pending Follow-ups"
            value={reminders.length}
            color="yellow"
          />
        </motion.div>

        {/* Resume Upload & ATS Section */}
        <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Resume ATS Optimizer</h2>
                <p className="text-indigo-100">Optimize your resume for Applicant Tracking Systems</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upload Section */}
              <div>
                <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])}
                    disabled={loading.upload}
                  />
                  {loading.upload ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      <p className="font-semibold text-slate-700">Drop your resume here</p>
                      <p className="mt-1 text-sm text-slate-500">PDF format, max 5MB</p>
                    </>
                  )}
                </label>

                {resume && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-3 rounded-xl bg-green-50 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-700">Resume uploaded</p>
                      <p className="text-sm text-green-600">{resume.fileName}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Paste Job Description
                </label>
                <textarea
                  className="input-modern h-40 resize-none"
                  placeholder="Paste the job description here to analyze how well your resume matches..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={runAnalysis}
                  disabled={loading.analyze || !resume}
                  className="btn-primary mt-4 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading.analyze ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
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
                  className="mt-6 overflow-hidden"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Match Score */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                      <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500">ATS Match Score</p>
                        <p className={`mt-2 text-5xl font-bold ${getScoreColor(analysis.matchPercentage)}`}>
                          {analysis.matchPercentage}%
                        </p>
                        <div className="progress-bar mt-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.matchPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`progress-bar-fill bg-gradient-to-r ${getScoreGradient(analysis.matchPercentage)}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-6">
                      <p className="text-sm font-medium text-slate-500">Missing Keywords</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.missingKeywords.slice(0, 6).map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-red-600 shadow-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                        {analysis.missingKeywords.length > 6 && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                            +{analysis.missingKeywords.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                      <p className="text-sm font-medium text-slate-500">Top Suggestion</p>
                      <p className="mt-3 text-slate-700">
                        {analysis.suggestions[0] || "Great alignment! Your resume matches well."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Smart Recommendations */}
        <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/30">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Smart Job Recommendations</h2>
                <p className="text-sm text-slate-500">Based on your resume skills</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <motion.div
                  key={rec.role}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover group cursor-pointer rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className={`badge ${rec.score >= 70 ? "badge-success" : rec.score >= 40 ? "badge-warning" : "badge-danger"}`}>
                      {rec.score}% match
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                    {rec.role}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Click to explore opportunities
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-slate-500">
                <FileText className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-3">Upload your resume to get personalized recommendations</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Job Application Tracker */}
        <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Job Application Tracker</h2>
                <p className="text-sm text-slate-500">Drag and drop to update status</p>
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
                />
                <input
                  className="input-modern"
                  placeholder="Role / Position"
                  value={newApp.role}
                  onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {loading.create ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add Job
                    </>
                  )}
                </motion.button>
              </div>

              {analysis && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-2 text-sm text-slate-500"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ATS Score ({analysis.matchPercentage}%) will be saved with this application
                </motion.p>
              )}
            </form>

            {/* Kanban Board */}
            <KanbanBoard applications={applications} onStatusChange={onStatusChange} />
          </div>
        </motion.section>

        {/* Analytics & Insights Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Analytics Dashboard */}
          <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Analytics Dashboard</h2>
                <p className="text-sm text-slate-500">Your application statistics</p>
              </div>
            </div>

            {analytics ? (
              <div className="p-6">
                {/* Status Breakdown */}
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">Application Status</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.statusBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                        >
                          {analytics.statusBreakdown.map((_, idx) => (
                            <Cell key={idx} fill={COLORS[idx]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">Top Missing Skills</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.mostCommonMissingSkills?.slice(0, 5)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis dataKey="skill" type="category" width={80} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                          }}
                        />
                        <Bar dataKey="count" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#d946ef" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-slate-400">
                <p>Loading analytics...</p>
              </div>
            )}
          </motion.section>

          {/* Smart Insights */}
          <motion.section variants={itemVariants} className="glass-card overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Smart Insights & Follow-ups</h2>
                <p className="text-sm text-slate-500">AI-powered recommendations</p>
              </div>
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto p-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4"
                >
                  <div className="flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{insight}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400" />
                </motion.div>
              ))}

              {reminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (insights.length + index) * 0.1 }}
                  className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4"
                >
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">Follow-up Needed</p>
                    <p className="text-sm text-slate-600">{reminder.message}</p>
                  </div>
                </motion.div>
              ))}

              {!insights.length && !reminders.length && (
                <div className="py-12 text-center">
                  <Lightbulb className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-4 text-slate-500">
                    Add more applications to get personalized insights
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </Layout>
  );
};

const StatsCard = ({ icon, label, value, color }) => {
  const colorMap = {
    indigo: "from-indigo-500 to-purple-600 shadow-indigo-500/30",
    green: "from-green-500 to-emerald-600 shadow-green-500/30",
    red: "from-red-500 to-pink-600 shadow-red-500/30",
    yellow: "from-yellow-500 to-orange-500 shadow-yellow-500/30"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card card-hover rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg text-white`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
