const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  try {
  let token = req.cookies.jwtoken

  if (token) {


      //decodes token id
      const decoded = jwt.verify(token,process.env.Secret_key);
      req.user = await User.findById(decoded.userId).select("-password");
      req.token = token
      next();
    }
    
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    res.status(401).json(error.message);
  }
};

module.exports = { protect };