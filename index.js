require("dotenv").config();

const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require("./connect");
// const { restrictToLoggedinUserOnly, checkAuth } =  require('./middlewares/auth');
const { checkForAuthentication, restrictTo, checkAuth } =  require('./middlewares/auth');

const URL = require('./models/url');

const UrlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();
const PORT = process.env.PORT;

connectToMongoDB(process.env.MONGO_URL)
  .then(()=> console.log("MongoDB Connected!"))
  .catch((err)=> console.log("Database Connection Error", err));

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);

/*
app.get('/test', async(req, res)=>{
  const allUrls = await URL.find();
  res.render('home', {
    urls: allUrls,
    });
})
*/

// app.use('/url', restrictToLoggedinUserOnly, UrlRoute);
app.use('/url', restrictTo(["NORMAL"]), UrlRoute);
app.use('/user', userRoute);
// app.use('/', checkAuth, staticRoute);
app.use('/',  staticRoute);

app.get('/url/:shortId', async(req, res)=>{
  const shortId =  req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
      visitHistory: {timestamp: Date.now()
      }}
    }
  );
  res.redirect(entry.redirectURL)
})

app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`));