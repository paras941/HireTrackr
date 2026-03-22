const Resume = require("../models/Resume");
const JobApplication = require("../models/JobApplication");

const ROLE_KEYWORDS = [
  { role: "Frontend Developer", keywords: ["react", "typescript", "css", "frontend", "redux"] },
  { role: "Backend Developer", keywords: ["node", "express", "api", "mongodb", "sql"] },
  { role: "Full Stack Developer", keywords: ["react", "node", "api", "database", "javascript"] },
  { role: "Data Analyst", keywords: ["python", "sql", "excel", "tableau", "analytics"] },
];

const recommendations = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    if (!resume) {
      return res.status(400).json({ message: "Upload resume for recommendations" });
    }

    const resumeSet = new Set(resume.keywords.map((k) => k.toLowerCase()));
    const roles = ROLE_KEYWORDS.map((entry) => {
      const matched = entry.keywords.filter((k) => resumeSet.has(k));
      const score = Math.round((matched.length / entry.keywords.length) * 100);
      return { role: entry.role, score, matchedSkills: matched };
    }).sort((a, b) => b.score - a.score);

    return res.json(roles);
  } catch (error) {
    return next(error);
  }
};

const analytics = async (req, res, next) => {
  try {
    const apps = await JobApplication.find({ user: req.userId });
    const total = apps.length;
    const interviews = apps.filter((a) => a.status === "Interview").length;
    const rejected = apps.filter((a) => a.status === "Rejected").length;
    const interviewRate = total ? Math.round((interviews / total) * 100) : 0;
    const rejectionRate = total ? Math.round((rejected / total) * 100) : 0;

    const missingCounter = {};
    apps.forEach((a) => {
      (a.missingKeywords || []).forEach((kw) => {
        missingCounter[kw] = (missingCounter[kw] || 0) + 1;
      });
    });

    const mostCommonMissingSkills = Object.entries(missingCounter)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const rolePerformance = {};
    apps.forEach((a) => {
      if (!rolePerformance[a.role]) {
        rolePerformance[a.role] = { role: a.role, total: 0, interviews: 0 };
      }
      rolePerformance[a.role].total += 1;
      if (a.status === "Interview") {
        rolePerformance[a.role].interviews += 1;
      }
    });

    const roleStats = Object.values(rolePerformance).map((r) => ({
      ...r,
      interviewRate: r.total ? Math.round((r.interviews / r.total) * 100) : 0,
    }));

    const bestRole = roleStats.sort((a, b) => b.interviewRate - a.interviewRate)[0];
    const topMissingSkill = mostCommonMissingSkills[0];
    const smartInsights = [
      bestRole
        ? `You get more interviews in ${bestRole.role} roles (${bestRole.interviewRate}% interview rate).`
        : "Add applications to unlock role-based interview insights.",
      topMissingSkill
        ? `You are missing ${topMissingSkill.skill} in many applications.`
        : "No recurring missing skills found yet.",
    ];

    return res.json({
      totalApplications: total,
      interviewRate,
      rejectionRate,
      mostCommonMissingSkills,
      statusBreakdown: [
        { name: "Applied", value: apps.filter((a) => a.status === "Applied").length },
        { name: "Interview", value: interviews },
        { name: "Rejected", value: rejected },
      ],
      roleStats,
      smartInsights,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { recommendations, analytics };
