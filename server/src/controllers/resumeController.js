const { PDFParse } = require("pdf-parse");
const Resume = require("../middleware/models/Resume");
const { extractSections } = require("../utils/resumeUtils");
const { extractKeywords, calculateAtsScore } = require("../utils/keywordUtils");
const {
  isGeminiConfigured,
  analyzeAndOptimizeResume,
  estimateCompaniesFromResume,
} = require("../utils/geminiService");

const keywordAnalysis = (resume, jobDescription) => {
  const jdKeywords = extractKeywords(jobDescription || "");
  const { score, matched, missing } = calculateAtsScore(resume.keywords, jdKeywords);
  const suggestions = missing
    .slice(0, 10)
    .map((skill) => `Include evidence of ${skill} in projects or experience.`);

  return {
    matchPercentage: score,
    matchedKeywords: matched,
    missingKeywords: missing,
    suggestions,
    resumeKeywords: resume.keywords,
    jdKeywords,
    aiPowered: false,
  };
};

const uploadResume = async (req, res, next) => {
  let parser;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    parser = new PDFParse({ data: req.file.buffer });
    const parsed = await parser.getText();
    const text = parsed.text || "";
    const sections = extractSections(text);

    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      {
        user: req.userId,
        fileName: req.file.originalname,
        text,
        keywords: sections.keywords,
        skillsText: sections.skillsText,
        experienceText: sections.experienceText,
        optimizedText: "",
        lastAnalysis: undefined,
      },
      { new: true, upsert: true }
    );

    return res.json(resume);
  } catch (error) {
    return next(error);
  } finally {
    if (parser) {
      await parser.destroy().catch((err) => console.error("Error destroying PDFParse:", err));
    }
  }
};

const analyzeJobDescription = async (req, res, next) => {
  try {
    const { jobDescription, targetRole } = req.body;
    const resume = await Resume.findOne({ user: req.userId }).lean();
    if (!resume) {
      return res.status(400).json({ message: "Upload resume before analysis" });
    }

    if (!jobDescription?.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

    if (!isGeminiConfigured()) {
      return res.json(keywordAnalysis(resume, jobDescription));
    }

    const aiResult = await analyzeAndOptimizeResume({
      resumeText: resume.text,
      jobDescription,
      targetRole: targetRole || "",
    });

    const companiesEstimate = aiResult.companiesEstimate || {
      totalCount: 0,
      breakdown: [],
      summary: "",
    };

    await Resume.findOneAndUpdate(
      { user: req.userId },
      {
        optimizedText: aiResult.optimizedResume || "",
        lastAnalysis: {
          matchScore: aiResult.matchScore,
          improvedMatchScore: aiResult.improvedMatchScore,
          targetRole: targetRole || "",
          companiesEstimate,
          analyzedAt: new Date(),
        },
      }
    );

    return res.json({
      matchPercentage: aiResult.matchScore,
      improvedMatchPercentage: aiResult.improvedMatchScore,
      matchedKeywords: [],
      missingKeywords: aiResult.missingKeywords || [],
      suggestions: aiResult.suggestions || [],
      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      optimizedResume: aiResult.optimizedResume || "",
      companiesEstimate,
      roleFit: aiResult.roleFit || "",
      aiPowered: true,
    });
  } catch (error) {
    if (error.message?.includes("GEMINI") || error.status === 429) {
      return res.status(503).json({
        message: "AI analysis unavailable. Check GEMINI_API_KEY or try again later.",
      });
    }
    return next(error);
  }
};

const getCompanyEstimate = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.userId }).lean();
    if (!resume) {
      return res.status(400).json({ message: "Upload resume first" });
    }

    if (resume.lastAnalysis?.companiesEstimate) {
      return res.json({
        ...resume.lastAnalysis.companiesEstimate,
        fromCache: true,
        aiPowered: true,
      });
    }

    if (!isGeminiConfigured()) {
      const roleCount = Math.max(5, Math.min(50, (resume.keywords?.length || 0) * 3));
      return res.json({
        totalCount: roleCount,
        breakdown: [
          { category: "Tech Companies", count: Math.round(roleCount * 0.6), examples: [] },
          { category: "Startups", count: Math.round(roleCount * 0.4), examples: [] },
        ],
        topRoles: [],
        summary: "Upload a job description and run AI analysis for accurate company matching.",
        aiPowered: false,
      });
    }

    const estimate = await estimateCompaniesFromResume({ resumeText: resume.text });
    return res.json({ ...estimate, aiPowered: true });
  } catch (error) {
    return next(error);
  }
};

const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.userId }).lean();
    return res.json(resume);
  } catch (error) {
    return next(error);
  }
};

module.exports = { uploadResume, analyzeJobDescription, getResume, getCompanyEstimate };
