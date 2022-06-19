const jwt = require("jsonwebtoken");

const generateauthtoken = (userId)=>{

        return jwt.sign({userId},"Mysecretauthdokensecretkey",{
            expiresIn:"30d",
        });
}

module.exports = {generateauthtoken};