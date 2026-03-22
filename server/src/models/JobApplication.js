const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected"],
      default: "Applied",
    },
    notes: { type: String, default: "" },
    appliedDate: { type: Date, default: Date.now },
    lastResponseDate: { type: Date },
    jobDescription: { type: String, default: "" },
    missingKeywords: { type: [String], default: [] },
    atsScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
