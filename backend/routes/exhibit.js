const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Connect to database (you can use a separate DB or same DB file)
const dbPath = path.join(__dirname, '../registrations.db');
const db = new sqlite3.Database(dbPath);

// Create exhibit table
db.run(`CREATE TABLE IF NOT EXISTS exhibits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  art_type TEXT,
  dimensions TEXT,
  price_range TEXT,
  maps_link TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  declaration INTEGER,
  artwork TEXT
)`);

router.post('/submit-exhibit', upload.single('artwork'), (req, res) => {
  const data = req.body;
  const file = req.file;
  const filePath = file ? file.path : '';

  const sql = `INSERT INTO exhibits (
    art_type, dimensions, price_range, maps_link, name, phone, email, declaration, artwork
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.art_type,
    data.dimensions,
    data.price_range,
    data.maps_link,
    data.name,
    data.phone,
    data.email,
    data.declaration === 'on' ? 1 : 0,
    filePath
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to save exhibit data');
    } else {
      res.status(200).json({ id: this.lastID, message: 'Exhibit submission saved!' });
    }
  });
});

module.exports = router;