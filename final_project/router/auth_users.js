const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let doesUserExist = users.filter(user => {
        return user.username = username
    })
    if (doesUserExist.length > 0) {
        return false
    } else {
        return true
    }
}

const authenticatedUser = (username,password)=>{
    users.forEach(user => {
        if (user.username == username && user.password == password) {
            return true
        }
    })
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || password) {
        return res.status(402).json({message: "Please enter a username and password"})
    } 
    if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 * 60})
    req.session.authorization = {accessToken, username}
    return res.status(200).send("User successfully logged in");
} else {
    return res.status(402).json({message: "Invalid username or password"});
}
    });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
