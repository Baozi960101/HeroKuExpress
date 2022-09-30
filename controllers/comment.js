const db = require("../models/index")
const Comments = db.Comments

const commentController = {
  add:(req,res,next)=>{
    const id = req.session.userId;
    const content = req.body.content;
    if (content === "") {
      req.flash("registerError", "請填完整");
      return next()
    }
    Comments.create({
      content,
      UserId:id
    })
    .then(()=>{
      res.redirect("/");
      return
    })
    .catch(()=>{
      req.flash("registerError", "失敗");
      return next()
    })
  },
  delete:(req,res)=>{
    const id = req.params.id;
    const userId = req.session.userId
    Comments.findOne({
      where: {
        id,
        UserId:userId
      }
    }).then((comment)=>{
      return comment.destroy()
    }).then(()=>{
      res.redirect("/")
      return
    }).catch(()=>{
      res.redirect("/")
      return
    })
  },
  get:(req,res)=>{
    const id = req.params.id;
    Comments.findOne({
      where: {
        id
      }
    }).then((comments)=>{
      res.render("./users/update",{
        result:comments
      })
    })
  },
  update:(req,res)=>{
    const id = req.params.id;
    Comments.findOne({
      where: {
        id,
      }
    }).then((comments)=>{
      comments.update({
        content:req.body.content
      })
    }).then(()=>{
      res.redirect("/")
      return
    }).catch(()=>{
      res.redirect("/")
      return
    })
  }
};

module.exports = commentController;
