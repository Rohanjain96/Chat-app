const express = require("express");
const { accessChat, fetchChats, createGroup, renameGroup, removeFromGroup, addToGroup, leaveGroup } = require("../controllers/chatcontroller");
const { protect } = require("../Middleware/Autheticate");
const router = express.Router();

router.post("/",protect, accessChat);

router.get("/fetchchats",protect, fetchChats);

router.post("/creategroup",protect, createGroup);

router.patch("/renamegroup", renameGroup );

router.patch( "/removeFromGroup", removeFromGroup);

router.patch( "/leaveGroup", leaveGroup);

router.patch( "/addToGroup", addToGroup);

module.exports = router;