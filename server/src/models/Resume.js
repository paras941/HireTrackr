const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    text: { type: String, required: true },
    keywords: { type: [String], default: [] },
    skillsText: { type: String, default: "" },
    experienceText: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
