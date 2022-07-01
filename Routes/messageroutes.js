const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const { protect } = require("../Middleware/Autheticate");
const router = express.Router();

router.get("/:chatId", getMessages);
router.post("/sendmessage",protect, sendMessage);


module.exports = router;
