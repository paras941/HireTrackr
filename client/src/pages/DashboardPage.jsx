import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Layout from "../components/Layout";
import KanbanBoard from "../components/KanbanBoard";
import http from "../api/http";

const DashboardPage = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [newApp, setNewApp] = useState({ company: "", role: "", notes: "" });

  const refreshData = async () => {
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
  };

  useEffect(() => {
    refreshData();
  }, []);

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    await http.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    refreshData();
  };

  const runAnalysis = async () => {
    const { data } = await http.post("/resume/analyze", { jobDescription });
    setAnalysis(data);
  };

  const createApplication = async (e) => {
    e.preventDefault();
    await http.post("/applications", { ...newApp, status: "Applied", jobDescription, missingKeywords: analysis?.missingKeywords || [], atsScore: analysis?.matchPercentage || 0 });
    setNewApp({ company: "", role: "", notes: "" });
    refreshData();
  };

  const onStatusChange = async (id, status) => {
    await http.put(`/applications/${id}`, { status, lastResponseDate: new Date() });
    refreshData();
  };

  const insights = useMemo(() => analytics?.smartInsights || [], [analytics]);

  return (
    <Layout>
      <div className="space-y-6">
        <section className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Resume Upload & ATS Optimizer</h2>
          <input type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])} />
          {resume && <p className="mt-2 text-sm text-slate-600">Latest resume: {resume.fileName}</p>}
          <textarea className="mt-3 h-32 w-full rounded border p-2" placeholder="Paste job description..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          <button onClick={runAnalysis} className="mt-3 rounded bg-blue-600 px-4 py-2 text-white">Analyze Match</button>
          {analysis && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded border p-3"><p className="text-sm text-slate-500">Match %</p><p className="text-2xl font-bold">{analysis.matchPercentage}%</p></div>
              <div className="rounded border p-3"><p className="text-sm text-slate-500">Missing Keywords</p><p>{analysis.missingKeywords.slice(0, 8).join(", ") || "None"}</p></div>
              <div className="rounded border p-3"><p className="text-sm text-slate-500">Suggestions</p><p>{analysis.suggestions[0] || "Great alignment so far."}</p></div>
            </div>
          )}
        </section>

        <section className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Smart Job Recommendations</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {recommendations.map((r) => (
              <div key={r.role} className="rounded border p-3">
                <p className="font-semibold">{r.role}</p>
                <p className="text-sm text-slate-600">Match score: {r.score}%</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Job Application Tracker</h2>
          <form onSubmit={createApplication} className="mb-4 grid gap-2 md:grid-cols-4">
            <input className="rounded border p-2" placeholder="Company" value={newApp.company} onChange={(e) => setNewApp({ ...newApp, company: e.target.value })} />
            <input className="rounded border p-2" placeholder="Role" value={newApp.role} onChange={(e) => setNewApp({ ...newApp, role: e.target.value })} />
            <input className="rounded border p-2" placeholder="Notes" value={newApp.notes} onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })} />
            <button className="rounded bg-slate-900 text-white">Add</button>
          </form>
          <KanbanBoard applications={applications} onStatusChange={onStatusChange} />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold">Analytics Dashboard</h2>
            {analytics && (
              <>
                <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded border p-2">Total: {analytics.totalApplications}</div>
                  <div className="rounded border p-2">Interview Rate: {analytics.interviewRate}%</div>
                  <div className="rounded border p-2">Rejection Rate: {analytics.rejectionRate}%</div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={analytics.statusBreakdown} dataKey="value" nameKey="name" outerRadius={70}>
                        {analytics.statusBreakdown.map((_, idx) => <Cell key={idx} fill={["#3b82f6", "#22c55e", "#ef4444"][idx]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-48">
                  <ResponsiveContainer>
                    <BarChart data={analytics.mostCommonMissingSkills}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold">Smart Insights & Follow-ups</h2>
            <div className="space-y-2">
              {insights.map((item) => (
                <p key={item} className="rounded border bg-indigo-50 p-2 text-sm">{item}</p>
              ))}
              {reminders.map((r) => (
                <p key={r.id} className="rounded border bg-amber-50 p-2 text-sm">{r.message}</p>
              ))}
              {!insights.length && !reminders.length && <p className="text-sm text-slate-500">No insights yet.</p>}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DashboardPage;
