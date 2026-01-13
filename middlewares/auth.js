const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next){
  // console.log(req);
  // const authorizationHeaderValue = req.headers["authorization"];
  const tokenCookie = req.cookies.token;
  req.user = null;

  // if(!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer"))
  if(!tokenCookie)
    return next();

  // const token = authorizationHeaderValue.split("Bearer ")[1];
  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  return next();
}

//ADMIN  , NORMAL
function restrictTo(roles){
  return function (req, res, next){
    if (!req.user)  return res.redirect("/login");

    if(!roles.includes(req.user.role))  res.end("Unauthorized");

    return next();
  }
}

async function restrictToLoggedinUserOnly(req, res, next){
  console.log(req.header);
  // const userUid = req.cookies.uid;
  const userUid = req.headers["authorization"];
  // console.log(req.header);

  if(!userUid) return res.redirect('/login');
  const token = userUid.split("Bearer ")[1];  //"Bearer 24u123llsd30dh = ['', '24u123llsd30dh']"
  const user = getUser(token);

  if(!user) return res.redirect('./login');

  req.user = user;
  next();
}

async function checkAuth(req, res, next){
  
  // const userUid = req.cookies.uid;
  const userUid = req.headers["authorization"];
  const token = userUid.split("Bearer ")[1];
  // const user = getUser(userUid);
  const user = getUser(token);

  req.user = user;
  next();
}
module.exports = {
  checkForAuthentication,
  restrictTo,
  restrictToLoggedinUserOnly,
  checkAuth,
};