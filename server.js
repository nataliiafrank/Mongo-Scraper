const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const cheerio = require("cheerio");
const request = require("request");
const exphbs = require("express-handlebars");
// Require all models
const db = require("./models");

const PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Use handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/8080");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


//Routs
app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            //console.log('articles', dbArticle);
            // If we were able to successfully find Articles, send them back to the client
            res.render("index", {
                articles: dbArticle
            });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.get("/scrape", function (req, res) {
    request("https://www.vogue.com/", function (error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        const $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        const results = {};

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("div.feed-card--container").each(function (i, element) {

            const img = $(element).children(".feed-card--image").children("a").children("picture").children("img").attr("srcset");
            // Save the text of the element in a "title" variable
            const title = $(element).children(".feed-card--info").children("h2").children().text();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            const link = $(element).children(".feed-card--info").children("h2").children().attr("href");

            
            // Save these results in an object that we'll push into the results array we defined earlie
            results.title = title;
            results.link = link;
            results.img = img;


            // Log the results once you've looped through each of the elements found with cheerio
            //console.log(results);
            //   res.send(results)
            //   res.render("index", {articles: results})

            // Create a new Article using the `result` object built from scraping
            db.Article.create(results)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        res.send(results);
    });
});


app.post("/saved/:id", function(req, res){
    const id = req.params.id;

    db.Article.findOne({_id: id}).then(function(article){
        console.log(article);

        // Add the articles attributes to the saved article table
        db.SavedArticle.create({
            title: article.title,
            link: article.link,
            img: article.img
        }).then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);

            res.json(err);
        });
    });
   
    res.send("Saved an article");
})


app.get("/saved", function(req, res){
    db.SavedArticle.find({})
        .then(function (dbSaved) {
            //console.log('articles', dbArticle);
            // If we were able to successfully find Articles, send them back to the client
            res.render("saved-articles", {
                articles: dbSaved
            });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
})

app.get("/delete/:id", function(req, res){
    db.SavedArticle.remove({
        _id: req.params.id
    }).then(function (result) {
        // View the added result in the console
        ress.send(result)
        console.log(result);
    })
    .catch(function (err) {
        console.log(err);
        res.json(err);
    });
})

app.get("/delete-all", function(req, res){
    db.Article.remove({}).then(function (result) {
        // View the added result in the console
        res.send(result)
        console.log(result);
    })
    .catch(function (err) {
        console.log(err);
        res.json(err);
    });
})


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});