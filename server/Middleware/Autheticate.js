const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  try {
  let token;

  if (req.cookies.jwtoken) {
  
    token = req.cookies.jwtoken;

      //decodes token id
      const decoded = jwt.verify(token,"Mysecretauthdokensecretkey" );
      req.user = await User.findById(decoded.userId).select("-password");
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