const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const usersController = require("./controllers/users");
const commentController = require("./controllers/comment");
const session = require("express-session");
const flash = require("connect-flash");
const PORT = process.env.PORT || 5001;


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.userId = req.session.userId;
  res.locals.registerError = req.flash("registerError");
  next();
});

function toBack(req, res) {
  res.redirect("back");
}

app.get("/", usersController.indexPage);
app.post("/", commentController.add, toBack); 

app.get("/register", usersController.register);
app.post("/register", usersController.handleRegister, toBack);

app.get("/login", usersController.loginPage);
app.post("/login", usersController.handleLogin, toBack);

app.get("/logout", usersController.logout);

app.get("/delete_comment/:id", commentController.delete);

app.get("/update_comment/:id", commentController.get);
app.post("/update_comment/:id", commentController.update);

// app.post("/login", (req, res) => {
//   if (req.body.password === "abc") {
//     req.session.isLogin = true;
//     res.redirect("/");
//   } else {
//     req.session.isLogin = false;
//     req.flash("loginError", "error");
//     res.redirect("/login");
//   }
// });

app.listen(PORT, () => {
});
