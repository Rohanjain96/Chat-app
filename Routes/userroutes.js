const express = require("express");
const router = express.Router();

const { login, getAllUser, register,checkcookie, removecookie } = require("../controllers/userController.js");
const { protect } = require("../Middleware/Autheticate.js");

router.post("/register", register);

router.post("/login", login);

router.get("/allusers", protect, getAllUser);

// router.post("/user", getUser);

router.get("/checkcookie", checkcookie);

router.delete("/removecookie", protect, removecookie);

module.exports = router;