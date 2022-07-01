const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const sendMessage = async(req,res)=>{
    
    const {content, chatId} = req.body;
    if(!content || !chatId)
    {
        res.json("Invalid data passed");
    }
    try {
        var newmessage = await Message.create({
            content:content,
            chat:chatId,
            sender:req.user._id
        });
        newmessage = await newmessage.populate("sender", "name pic email");
        newmessage = await newmessage.populate("chat");
        newmessage = await User.populate(newmessage,{
            path:"chat.users",
            select:"name pic email phonenumber"
        });
        await Chat.findByIdAndUpdate(chatId,{latestMessage:newmessage});
        res.json(newmessage);
    } catch (error) {
        res.status(401).json(error.Message);
    }
}

const getMessages = async(req,res)=>{
    const chatId = req.params.chatId;
    try {
        const messages = await Message.find({chat:chatId}).populate("sender","name pic email phonenumber").populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).json(error.message);
    }
}
module.exports = {sendMessage, getMessages};