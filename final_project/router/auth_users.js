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
    return res.status(200).json({message: "User successfully logged in"});
} else {
    return res.status(401).json({message: "Invalid username or password"});
}
    });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization['username']
    let customerReview = {[username]: req.query.give_review}

    if (req.query.give_review) {
        let userKey = Object.keys(books[isbn].reviews) 
        let currentUser = userKey.filter(user => user == username)

        if (!(currentUser.length > 0)) {
            Object.assign({books}, {}, {
                isbn: Object.assign(books[isbn], {}, {
                    reviews: customerReview
                })
            })
            return res.status(200).json({
                        message: "Review posted successfully!",
                        customerReview
            })
        } else {
            Object.assign({books}, {}, {
                [isbn]: Object.assign(books[isbn], {}, {
                    reviews: Object.assign(books[isbn].reviews, {}, {
                        [username]: customerReview[username]
                    })
                })
            })
            return res.status(200).json({
                        message: "Review updated successfully!",
                        customerReview
            })
        }
        
    } else {
        return res.status(400).json({message: "Please enter a review message"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization['username']
    let userKey = Object.keys(books[isbn].reviews) 
    let currentUser = userKey.filter(user => user == username)
    if (currentUser.length > 0) {
        delete(books[isbn].reviews[username])
        res.status(200).json({message: "Review deleted successfully"})
    } else {
        return res.status(400).json({message: "Review does not exist"})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
