const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js")

const accessChat = async (req, res) => {
  const { userId, pic } = req.body;

  if (!userId) {
    return res.status(400)
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } }
    ]
  }).populate("users", "-password").populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email phonenumber"
  });

  if (isChat.length > 0)
    res.json(isChat[0]);

  else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
      pic: pic
    };
    
    try {
      const createdChat = await Chat.create(chatData);
      const fullchat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
      res.status(200).json(fullchat);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    var chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } }
    }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 }).lean();

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email phonenumber"
    })

    for (let i = 0; i < chats.length; i++) {
      chats[i].notificationcount = 0;
      
      if(chats[i].latestMessage) {
        let content = chats[i].latestMessage.content
        var bytes  = CryptoJS.AES.decrypt(content, 'mysecretkey');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        chats[i].latestMessage.content = originalText;
      }
      else continue
    }
    res.json(chats);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const createGroup = async (req, res) => {
  const { userIds, groupname } = req.body;
  if (!userIds || !groupname) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const users = JSON.parse(userIds)
  if (userIds.length < 2) {
    res.status(400).json("For group creation there must be atleast 3 users");
    return;
  }

  try {

    var groupChat = {
      chatName: groupname,
      isGroupChat: true,
      users: [req.user._id, ...users],
      groupAdmin: req.user._id
    }

    const createdgroupchat = await Chat.create(groupChat);
    var fullgroupchat = await Chat.findOne({ _id: createdgroupchat._id }).populate("users", "-password").populate("groupAdmin");
    fullgroupchat = await User.populate(fullgroupchat, {
      path: "latestMessage.sender",
      select: "name pic email phonenumber"
    })
    res.status(201).json(fullgroupchat);
  } catch (error) {
    res.json(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).json("Chat Not Found");
  } else {
    res.json(removed);
  }
}

const leaveGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  console.log("chatId", chatId,"userId", userId);

  const leaved = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!leaved) {
    res.status(404).json("some error occured");
  } else {
    res.json(leaved);
  }
}
const addToGroup = async (req, res) => {
  try {
    const { chatId, users } = req.body;
    const addusers = JSON.parse(users);
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: [...addusers] } },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.json(chat);
  } catch (error) {
    res.status(404).json(error.message);

  }
}
module.exports = { accessChat, fetchChats, createGroup, renameGroup, removeFromGroup, addToGroup, leaveGroup };