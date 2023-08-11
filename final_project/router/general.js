const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password})
            return res.status(200).json({message: "Registered Successfully!"})
        } else {
            return res.status(402).json({message: `Username ${username} already exists!` })
        }
    }
  return res.status(300).json({message: "Please enter a username and password!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    if (books) {
        res.status(200).send(JSON.stringify({books}))
    } else {
        res.status(404).json({message: "Database not found!"});}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let num = req.params.isbn
    if (books[num]) {
        res.status(200).send(JSON.stringify(books[num]))
    } else {
        res.status(402).json({message: "ISBN does not exist!"})
    }
 });
  
let keyId = Object.keys(books)    

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorParam = req.params.author
    let authorMatch
    keyId.forEach(num => {
        if (books[num].author == authorParam) { 
            return authorMatch = books[num]
            }
        })
    if (authorMatch) {
        return res.status(200).send(JSON.stringify(authorMatch))
    } else {
        return res.status(402).json({message: "No such author found"});
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleParam = req.params.title
    let titleMatch
    keyId.forEach(num => {
        if (books[num].title == titleParam) { 
            return titleMatch = books[num]
            }
        })
    if (titleMatch) {
        return res.status(200).send(JSON.stringify(titleMatch))
    } else {
        return res.status(402).json({message: "No such title found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let num = req.params.isbn
    if (books[num]) {
        res.status(200).send(JSON.stringify(books[num].reviews))
    } else {
        res.status(402).json({message: "ISBN does not exist!"})
    }
});

module.exports.general = public_users;
