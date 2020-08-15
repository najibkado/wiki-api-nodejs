const express = require("express");
const parser = require("body-parser");
const mongoose = require("mongoose");

const port = 3000;
const app = express();
app.use(parser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useUnifiedTopology: true, useNewUrlParser: true} );

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

/*
/Request targeting all articles
/get returns all articles
/post creates a new article
/delete clears all articles
*/


app.route("/articles")

.get(function (req, res) {
    Article.find({}, function (err, articles) {
        if (!err) {
            res.send(articles); 
        } else {
            res.send(err);
        }
    });
})

.post(function (req, res) {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;
    
    const article = new Article({
        title: articleTitle,
        content: articleContent
    })

    article.save( function (err) {
        if (!err) {
            res.send("Successfull!");
        }else{
            res.send(err);
        }
    });
      
})

.delete(function (req, res) {
    Article.deleteMany({}, function (err) {
        if(!err){
            res.send("Successfull!");
        }else{
            res.send(err);
        }
    })
});
/*
/End of request targeting all articles
/get returns all articles
/post creates a new article
/delete clears all articles
*/


///////////////////////////////////////////////////////////////////////


/*
/Start of requests targeting a specific article
/get returns an article by id
/put replace an existing article
/patch updates a field in an article
/delete clears an article by id
*/

app.route("/article/:id")

.get(function (req, res) {
    const articleId =req.params.id;
    Article.findOne({_id: articleId}, function (err, article) {
       
            if (article) {
                res.send(article);
            } else {
                res.send("Article not found!");
            }          
 
    });
})

.put(function (req, res) {
    const articleId =req.params.id;
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    Article.update({_id: articleId}, 
        {title: articleTitle, content: articleContent}, 
        {overwrite:true}, 
        function (err) {
        if (!err) {
            res.send("Successfully Updated")
        }
    });
})

.patch(function (req, res) {
    const articleId =req.params.id;

    Article.update({_id: articleId},
        {$set: req.body},
        function (err) {
            if (!err) {
                res.send("Successfully patched!!");
            }
        });
})

.delete(function (req, res) {
    const articleId =req.params.id;
    Article.deleteOne({_id: articleId}, function (err) {
        if (!err) {
            res.send("Successfully deleted!");
        } else{
            res.send(err);
        }
    })
});

/*
/End of requests targeting a specific article
/get returns an article by id
/put replace an existing article
/patch updates a field in an article
/delete clears an article by id
*/


///////////////////////////////////////////////////////////////////////










app.listen(port, function (req, res) {
    console.log("Server started on " + port );   
});