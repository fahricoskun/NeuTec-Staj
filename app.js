const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const methodOverride = require("method-override");
require("dotenv").config();

const ejs = require("ejs");

// Routes
const pageRoute = require("./routes/pageRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const User = require("./models/User");

const app = express();

//connect DB
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.mskswzm.mongodb.net/?retryWrites=true&w=majority&appName=pcat-app-db`
//   )
mongoose.connect("mongodb://localhost/neu-stok")
  .then(() => {
    console.log("DB CONNECTED!");
  })
  .catch((err) => {
    console.log(err);
  });

//Template Engine
app.set("view engine", "ejs");

//Global Variable

global.userIN = null;

//Middlewares
app.use(express.static("public"));
//! urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false, //herhangi bir değişiklik olmasa da session'u kaydet (force)
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/neu-stok" }),
  })
);
app.use(flash());
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use(async(req, res, next) => {
  if(req.session.userID) {
    try {
      const user = await User.findById(req.session.userID);
      res.locals.user = user; // kullanıcıyı EJS şablonlarına aktar
    } catch (err) {
      return next(err); // hata oluşursa next ile devam et 
    }
  } else {
    res.locals.user = null; // oturum açılmadıysa null yap
  }
  next();
});

//Routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/products", productRoute);

app.use("/", pageRoute);
app.use("/login", pageRoute)
app.use("/register", pageRoute)
app.use("/users", userRoute)

//Sunucuda başlatma
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});
