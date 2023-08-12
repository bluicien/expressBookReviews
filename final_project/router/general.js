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
    const getBooks = async () => {
        try {
            res.status(200).json(books)
            } catch (error) {
                console.log(error);
            }
    }
    getBooks()
});

        //=============== Alt code ===========//
        // if (books) {
        //     resolve(res.status(200).send(JSON.stringify({books})))
        // } else {
        //     reject(res.status(404).json({message: "Database not found!"}))
        // }

// =====================NON ASYNC CODE ==================
    // if (books) {
    //     res.status(200).send(JSON.stringify({books}))
    // } else {
    //     res.status(404).json({message: "Database not found!"});}


// Get book details based on ISBN 
//Using ASYNC function
public_users.get('/isbn/:isbn',function (req, res) {
    const isbnPromise = new Promise((resolve, reject) => {
            let num = (req.params.isbn)
            if (books[num]) {
                resolve(res.status(200).json(books[num]))
            } else {
                res.status(402).json({message: "ISBN does not exist!"})
            }
    })
    isbnPromise.then(() => console.log("Match found"))
});

// ===============NON ASYNC CODE ================
// if (books[num]) {
//     res.status(200).send(JSON.stringify(books[num]))
// } else {
//     res.status(402).json({message: "ISBN does not exist!"})
// }

let keyId = Object.keys(books)    

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorPromise = new Promise((resolve, reject) => {
        const authorParam = req.params.author
        let authorMatch
        keyId.forEach(num => {
            if (books[num].author == authorParam) { 
                return authorMatch = books[num]
                }
            })
        if (authorMatch) {
            resolve( res.status(200).json(authorMatch))
        } else {
            return res.status(402).json({message: "No such author found"});
        }
    })
    authorPromise.then(() => console.log("Match found"))
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titlePromise = new Promise((resolve, rejeect) => {
        const titleParam = req.params.title
        let titleMatch
        keyId.forEach(num => {
            if (books[num].title == titleParam) { 
                return titleMatch = books[num]
                }
            })
        if (titleMatch) {
            resolve (res.status(200).json(titleMatch))
        } else {
            return res.status(402).json({message: "No such title found"});
        }
    })
    titlePromise.then(() => console.log("Match found"))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let num = req.params.isbn
    if (books[num]) {
        res.status(200).json(books[num].reviews)
    } else {
        res.status(402).json({message: "ISBN does not exist!"})
    }
});

module.exports.general = public_users;
