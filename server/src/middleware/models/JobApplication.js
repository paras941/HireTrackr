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

// Indexes to speed up common queries
jobApplicationSchema.index({ user: 1, createdAt: -1 });
jobApplicationSchema.index({ user: 1, status: 1, appliedDate: 1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
