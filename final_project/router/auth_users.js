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
    let validated = users.filter(user => {
        return (user.username === username && user.password === password)
    })
    if (validated.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
        return res.status(401).json({message: "Please enter a username and password"})
    } 
    if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 * 60})
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
} else {
    return res.status(401).json({message: "Invalid username or password"});
}
    });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization['username']
    let customerReview = {
        "username": username,
        "review": req.query.givereview
    }
    if (customerReview) {
        if (!books[isbn].review.username) {
            books[isbn].review.push(customerReview)
            return res.status(200).json({message: "Review posted successfully!"})
        } else {
            books[isbn].review.
        }
    } else {
        return res.status(400).json({message: "Please enter a review message"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
