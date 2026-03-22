const express = require("express");
const auth = require("../middleware/auth");
const { recommendations, analytics } = require("../controllers/insightsController");

const router = express.Router();

router.get("/recommendations", auth, recommendations);
router.get("/analytics", auth, analytics);

module.exports = router;
