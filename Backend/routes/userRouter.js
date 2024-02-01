const express = require("express");
const {
  registerUser,
  authUser,
  allusers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authenticationMiddleware");

const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(authUser);
router.get("/users", protect, allusers);

module.exports = router;
