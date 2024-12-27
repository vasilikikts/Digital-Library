const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const bodyParser=require('body-parser');
const app = express();


const db = new sqlite3.Database('./books.sqlite');

// Middleware


app.use(express.static("frontend"));
app.use(express.json());

// Initialize database
db.serialize(() => {
  db.run(CREATE TABLE IF NOT EXISTS books  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author VARCHAR(25) NOT NULL,
    title VARCHAR(40) NOT NULL,
    genre VARCHAR(20) NOT NULL,
    price REAL NOT NULL
  ));
});

// Add a new book
app.post('/books', (req, res) => {
  const { author, title, genre, price } = req.body;
  console.log('Received data:', req.body);
  if (!author  !title  !genre || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO books (author, title, genre, price) VALUES (?, ?, ?, ?)';
  //const params = [author, title, genre, price];

  db.run(sql,[author, title, genre, price] , function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error inserting book', error: err.message });
    }
    console.log('book added successfull',{id:this.lastID,author,title,genre,price});
    res.json({ message: 'Book added successfully', bookId: this.lastID });
  });
});

// Search books by keyword
app.get('/books/:keyword', (req, res) => {
  const keyword = req.params.keyword;

  const sql = 'SELECT * FROM books WHERE title LIKE ?';
  const params = [%${keyword}%];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Start server
app.listen(3000, () => {
  console.log(Server running at http://localhost:3000);
});