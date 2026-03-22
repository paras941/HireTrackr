const express = require("express");
const auth = require("../middleware/auth");
const {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  reminders,
} = require("../controllers/applicationController");

const router = express.Router();

router.get("/", auth, listApplications);
router.post("/", auth, createApplication);
router.put("/:id", auth, updateApplication);
router.delete("/:id", auth, deleteApplication);
router.get("/reminders/list", auth, reminders);

module.exports = router;
