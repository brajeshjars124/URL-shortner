// const sessionIdToUserMap = new Map();
const jwt = require("jsonwebtoken");
const secret = "Brajesh$123@#$";
/*
function setUser( id, user){
  return sessionIdToUserMap.set(id, user);
}
function getUser(id){
  return  sessionIdToUserMap.get(id);
}
*/

function setUser(user){
  return jwt.sign({
    _id: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
  }, secret);
}
function getUser(token){
  if(!token) return null;
  try {
    return  jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
  
}

module.exports = {setUser, getUser};