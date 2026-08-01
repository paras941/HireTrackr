const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const {
  uploadResume,
  analyzeJobDescription,
  getResume,
} = require("../controllers/resumeController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      const err = new Error("Only PDF uploads are supported");
      err.status = 400;
      cb(err);
    }
  },
});

router.get("/", auth, getResume);
router.post("/upload", auth, upload.single("resume"), uploadResume);
router.post("/analyze", auth, analyzeJobDescription);

module.exports = router;
