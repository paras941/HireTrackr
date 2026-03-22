const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "you",
  "your",
  "are",
  "our",
  "from",
  "have",
  "will",
  "using",
  "into",
  "able",
  "years",
  "year",
  "work",
  "role",
  "job",
  "experience",
]);

const normalizeToken = (token) => token.toLowerCase().replace(/[^a-z0-9+#.]/g, "");

const extractKeywords = (text = "") => {
  const words = text
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  return [...new Set(words)];
};

const calculateAtsScore = (resumeKeywords = [], jdKeywords = []) => {
  if (!jdKeywords.length) {
    return { score: 0, matched: [], missing: [] };
  }

  const resumeSet = new Set(resumeKeywords.map((k) => k.toLowerCase()));
  const matched = jdKeywords.filter((k) => resumeSet.has(k.toLowerCase()));
  const missing = jdKeywords.filter((k) => !resumeSet.has(k.toLowerCase()));
  const score = Math.round((matched.length / jdKeywords.length) * 100);

  return { score, matched, missing };
};

module.exports = { extractKeywords, calculateAtsScore };
