"use strict"

const express = require("express"),
      http = require("http"),
      path = require("path"),
      fs = require("fs"),
      dictionaire = require("./public/assets/scripts/dictionaire"),
      bodyParser = require("body-parser"),
      // SECURITY
      helmet = require("helmet"),
      helmet_csp = require("helmet-csp"),
      fontArr = require("./public/assets/fonts/fontAllow"),
      // VIEW ENGINE
      pug = require("pug"),
      // PORT & ROUTER
      port = process.env.PORT || 3000,
      app = express();


// App Setup
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


// SECURITY middleware (Helmet, Helmet-csp)
app.use(helmet({dnsPrefetchControl: {allow: true}}));
app.use(helmet_csp({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        sandbox: ['allow-forms', 'allow-scripts']
        }
}));
app.use(function(req, res, next) {
    res.set({
    "Access-Control-Allow-Origin" : "'self'",
    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, content-type, Accept"
    });
    app.disable('x-powered-by');
    next();
});

app.get("/", function(req, res) {

    res.render("index", {matches: 0});
});


app.get("/public/assets/fonts/*", function(req, res) {
    if (fontArr.indexOf(req.url.replace(/^public\/assets\/fonts\//, "") > -1)) {
          fs.createReadStream(path.join(__dirname, req.url)).pipe(res);
    } else {
          res.status(204).send();
    }
});


app.post("/wordLookup", function(req, res) {
    
    const matches = dictionaire.getWords(req.body.wordUpload);
    res.render("index", {matches, nr: matches.length, word: req.body.wordUpload});
});


//Server Setup
const server = http.createServer(app);
server.listen(port, () => console.log("Listening on port: " + port));