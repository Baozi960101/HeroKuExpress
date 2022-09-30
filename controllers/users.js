const usersModel = require("../models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../models/index");
const User = db.Users
const Comments = db.Comments

const usersController = {
  indexPage: (req, res) => {
    Comments.findAll({
      include:User
    }).then((comments)=>{
      res.render("./users/index",{
        comments:comments
      });
    })
  },
  loginPage: (req, res) => {
    res.render("./users/login");
  },
  logout: (req, res) => {
    req.session.username = false;
    res.redirect("/");
  },
  register: (req, res) => {
    res.render("./users/register");
  },
  handleRegister: (req, res, next) => {
    const { username, password, nickname } = req.body;
    if (!username || !password || !nickname) {
      req.flash("registerError", "請填完整");
      return next();
    }
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        req.flash("registerError", "註冊失敗");
        return next();
      }
    User.create({
        username, password:hash, nickname
      }).then((users)=>{
        req.session.username = username;
        req.session.userId = users.id;
        res.redirect("/");
        return
      }).catch(()=>{
        req.flash("registerError", "註冊失敗");
        return next();
      })
    });
  },

  handleLogin: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash("registerError", "請輸入內容");
      next();
      return;
    }
    User.findOne({
      where: {
        username
      }
    }).then((users)=>{
      bcrypt.compare(password, users.password, function (err, passResult) {
        if (err || !passResult) {
          req.flash("registerError", "登入失敗");
          return next();
        }
        req.session.username = username;
        req.session.userId = users.id;
        res.redirect("/");
        return
      });
    }).catch((err)=>{
      req.flash("registerError", "登入失敗");
      return next();
    })
  },
};

module.exports = usersController;
