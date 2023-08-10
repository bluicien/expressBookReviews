const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorParam = req.params.author
    let authorMatch
    let isbn = Object.keys(books)    
    isbn.forEach(num => {
        if (books[num].author == authorParam) { 
            return authorMatch = books[num]
            }
        })
    if (authorMatch) {
        return res.status(200).send(authorMatch)
    } else {
        return res.status(402).json({message: "No such author found"});
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
