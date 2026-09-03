const JWT = require("jsonwebtoken");

const secretKey = "@Divya123";

function createTokenForUser(user){
  const payload = {
    fullName : user.fullName,
    _id : user._id,
    email : user.email,
    role : user.role,
    profileImageURL : user.profileImageURL
  }
  const token = JWT.sign(payload,secretKey);
  return token;
}

function validateToken(token){
  return JWT.verify(token,secretKey);
}

module.exports = {
  createTokenForUser,
  validateToken,
};