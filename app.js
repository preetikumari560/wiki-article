const express= require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/wikiDb',{useNewUrlParser:true});
mongoose.set('strictQuery', true);
// require('dotenv').config()  
const ejs = require('ejs')

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

mongoose.set('strictQuery', false)
const articleSchema = new mongoose.Schema(
    {  
    title:{
        type:String,
        required:[true,"please check your db title is not written"]},
        content:String,
    
    }
    
    );
    
    const Article = mongoose.model("articles",articleSchema) //here person is a collection which will convert into its plural form
    
    const newArticle = new Article(
        {  
            title:"RESTful",
            content:"restfull API",
        }
    );
  
    newArticle.save();

//chained route handler using express ,which targeting specific route i.e "/articles":

app.route("/articles")
.get((req, res) => {
  Article.find()
    .then( (foundArticle)=> {
      console.log(foundArticle);
      res.send( foundArticle);
    })
    .catch(err => {
      console.error(err);
      res.send("Error: " + err.message);
    });
})
.post((req,res)=>{

  const createArticle = new Article({
    title:req.body.title,
    content:req.body.content
  })

  createArticle
  .save()
  .then(() => {
    res.send("successfully added");
  })
  .catch((err) => {
    res.send(err);
  });
})
.delete((req,res)=>{
  Article.deleteMany() .then(() => {
    res.send("successfully deleted");
  })
  .catch((err) => {
    res.send(err);
  });
})

app.route("/articles/:articleTitle")
.get((req,res)=>{
  Article.findOne({title:req.params.articleTitle})
  .then((foundArticle)=>{
      res.send(foundArticle)
  })
  .catch((err)=>{
    res.send(err)
  })
})
.patch((req,res)=>{
  Article.updateOne({title:req.params.articleTitle}, {title:req.body.title,
   content:req.body.content})
  .then((foundItem)=>{
  res.send(foundItem)
  })
  .catch((err)=>{
    res.send(err)
  })
})

.delete((req,res)=>{
Article.deleteOne({title:req.params.articleTitle})
  .then(()=>{
res.send("deleted successfully")
  })
  .catch((err)=>{
    res.send(err)
  })
})

app.listen(3000,()=>{
    console.log("port is running on 3000")
})