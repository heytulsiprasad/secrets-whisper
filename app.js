//jshint esversion:6

require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = {
    email: String,
    password: String
};


const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

// TODO: add users through registrations
app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
            const newUser = new User({
                email: req.body.username,
                password: hash
            });

            newUser.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("secrets");
                }
            });
    });

});

// TODO: add users through login:
app.post("/login", function (req, res) {
    username = req.body.username;
    password = req.body.password;

    User.findOne({email: username}, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                // Load hash from your password DB.
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    // res == true
                    if (result === true) {
                        res.render("secrets");
                    }
                });
                }
            }
        });
    });

app.listen(3000, function() {
    console.log("Server started at port 3000.");
});