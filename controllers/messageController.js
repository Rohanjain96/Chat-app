const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js")
const sendMessage = async(req,res)=>{
    
    const {content, chatId} = req.body;
    if(!content || !chatId)
    {
        res.json("Invalid data passed");
    }
    const encryptedmessagecontent = CryptoJS.AES.encrypt(content,"mysecretkey").toString();
    try {
        var newmessage = await Message.create({
            content:encryptedmessagecontent,
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
        var bytes  = CryptoJS.AES.decrypt(newmessage.content, 'mysecretkey');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        console.log("newmessage:",newmessage);
        let message = await Message.findById({_id:newmessage._id}).populate("chat").populate("sender", "name pic email")
        message = {...message,content:originalText}
        console.log("message:",message);
        res.json(message);
    } catch (error) {
        res.status(401).json(error.Message);
    }
}

const getMessages = async(req,res)=>{
    const chatId = req.params.chatId;
    try {
        let messages = await Message.find({chat:chatId}).populate("sender","name pic email phonenumber").populate("chat").lean();
        messages = messages.map(message=>{
            var bytes  = CryptoJS.AES.decrypt(message.content, 'mysecretkey');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return({...message,content:originalText})
        })
        res.json(messages);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {sendMessage, getMessages};
