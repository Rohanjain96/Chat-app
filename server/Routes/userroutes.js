const express = require("express");
const router = express.Router();
const url = "https://mern-chatify-app.herokuapp.com/"

const { login, getAllUser, register, checkcookie, removecookie } = require("../controllers/userController.js");
const { protect } = require("../Middleware/Autheticate.js");

router.post("/register", register);

router.post("/login", login);

router.get("/allusers", protect, getAllUser);

router.get("/checkcookie", checkcookie);

router.get("/removecookie", removecookie);

module.exports = router;