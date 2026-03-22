const express = require("express");
const { body } = require("express-validator");
const { register, login, me, updateProfile } = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);
router.post("/login", login);
router.get("/me", auth, me);
router.put("/profile", auth, updateProfile);

module.exports = router;
