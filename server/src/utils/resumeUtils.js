const { extractKeywords } = require("./keywordUtils");

const SECTION_PATTERNS = {
  skills: /(skills|technical skills|core skills)\s*[:\-]?\s*([\s\S]{0,800})/i,
  experience: /(experience|work history|employment)\s*[:\-]?\s*([\s\S]{0,1200})/i,
};

const extractSections = (text = "") => {
  const skillsMatch = text.match(SECTION_PATTERNS.skills);
  const expMatch = text.match(SECTION_PATTERNS.experience);

  const skillsText = skillsMatch?.[2] || "";
  const experienceText = expMatch?.[2] || "";
  const keywords = extractKeywords(text);

  return {
    skillsText,
    experienceText,
    keywords,
  };
};

module.exports = { extractSections };
