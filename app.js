// modules
require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const Links = require("./models/Links");

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


// database
const dbURI = process.env.MONGO_DB;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);

app.get('/', requireAuth, (req, res) =>{
  Links.find()
        .then((result) =>
          res.render("index", { title: "home-page", urls: result })
        )
        .catch((err) => console.log(err));
});

app.get('/add', requireAuth, (req, res) =>{
  res.render("add", { title: "add" });
});

app.post('/add', requireAuth, (req, res) =>{
  const link = new Links(req.body);
  link
    .save()
    .then((result) => {
      setTimeout(() => {
        res.redirect("/");
      }, 2000);
      if (result.name === req.body.name) {
        console.log("saved!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(authRoutes);

//404 page
app.use((req, res) => {
  res.status(404).send("404 nothing is here");
});