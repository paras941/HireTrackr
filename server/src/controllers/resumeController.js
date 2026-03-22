const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const { extractSections } = require("../utils/resumeUtils");
const { extractKeywords, calculateAtsScore } = require("../utils/keywordUtils");

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const parsed = await pdfParse(req.file.buffer);
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
      },
      { new: true, upsert: true }
    );

    return res.json(resume);
  } catch (error) {
    return next(error);
  }
};

const analyzeJobDescription = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;
    const resume = await Resume.findOne({ user: req.userId });
    if (!resume) {
      return res.status(400).json({ message: "Upload resume before analysis" });
    }

    const jdKeywords = extractKeywords(jobDescription || "");
    const { score, matched, missing } = calculateAtsScore(resume.keywords, jdKeywords);

    const suggestions = missing.slice(0, 10).map((skill) => `Include evidence of ${skill} in projects or experience.`);

    return res.json({
      matchPercentage: score,
      matchedKeywords: matched,
      missingKeywords: missing,
      suggestions,
      resumeKeywords: resume.keywords,
      jdKeywords,
    });
  } catch (error) {
    return next(error);
  }
};

const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    return res.json(resume);
  } catch (error) {
    return next(error);
  }
};

module.exports = { uploadResume, analyzeJobDescription, getResume };
