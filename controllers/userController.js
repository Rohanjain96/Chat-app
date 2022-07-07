const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateauthtoken } = require("../config/generateAuthtoken.js");
const login = async (req, res) => {
    try {
        const { phonenumber, password } = req.body;
        const user = await User.findOne({ phonenumber });
        if (user) {
            userPassword = user.password;
        }
        else {
            throw new Error("Invalid Credentials");
        }
        const match = await bcrypt.compare(password, userPassword)
        if (user && match) {
            const token = generateauthtoken(user._id);
            res.cookie("jwtoken", token, {
                expires: new Date(Date
                    .now() + 2592000000), httpOnly: false
            });
            // globaltoken = token;
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phonenumber: phonenumber,
                pic: user.pic,
                token: token,
            });
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(403).json(error.message);
    }

}

const getAllUser = async (req, res) => {
    let keyword;
    // const {user} = req.body
    if (!req.query.search) {
        keyword = {};
    }
    if (isNaN(req.query.search)) {
        keyword = { name: { $regex: "^" + req.query.search, $options: "i" } }
    }
    else
        keyword = { phonenumber: req.query.search }

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
    res.json(users)
}

const register = async (req, res) => {
    try {
        const { name, email, password, phonenumber, picture } = req.body;
        let user
        if (!name || !email || !password || !phonenumber) {
            res.status(400);
            throw new Error("Please Enter all the Feilds");
        }
        const userExists = await User.findOne({ phonenumber });
        if (userExists) {
            res.status(409);
            throw new Error("User already exists");
        }

        if(picture!=="")  
        user = await User.create({ name, email, password, phonenumber, pic: picture });
        else
        user = await User.create({ name, email, password, phonenumber });

        const token = generateauthtoken(user._id);
        res.cookie("jwtoken", token, {
            expires: new Date(Date
                .now() + 2592000000), httpOnly: false
        });
        // globaltoken = token;

        if (user) {
            res.json(
                {
                    _id: user._id,
                    name: user.name,
                    phonenumber: user.phonenumber,
                    email: user.email,
                    isadmin: user.isadmin,
                    pic: user.picture,
                    token:token
                }
            )
        }
        else
            throw new Error("user not created");
    } catch (error) {
        res.json(error.message)
    }

}

// const getUser = async (req, res) => {
//     const {token} = req.body
//     globaltoken = token
//     if(token)
//     {
//         const decoded = jwt.verify(token, process.env.Secret_key);
//         const data = await User.findById(decoded.userId).select("-password");
//         res.json(data);
//     }

//     else return
// }

const checkcookie = async (req, res) => {
    let token = req.cookies.jwtoken;
    console.log(token);
    if (token !== undefined){
    const decoded = jwt.verify(token, process.env.Secret_key);
    data = await User.findById(decoded.userId).select("-password");
    res.json(data);
    }
}
const removecookie = async (req, res) => {
    res.clearCookie('jwtoken', { credentials: "same-origin" })
    res.status(200).json("cookie cleared")
}


module.exports = { login, getAllUser,register,checkcookie,removecookie}