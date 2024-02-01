const express = require("express");
const { protect } = require("../middleware/authenticationMiddleware");
const { sendMessage, allMessage } = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(protect, sendMessage);

// route for fetching all messags of a chat
router.route("/:chatId").get(protect, allMessage);

module.exports = router;
