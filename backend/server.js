const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Parse JSON bodies (for API clients)
app.use(bodyParser.json());
// Parse URL-encoded bodies (for HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// Connect to SQLite database file
const dbPath = path.join(__dirname, 'registrations.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Create registrations table if doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, email TEXT, phone TEXT, experience TEXT, institution TEXT,
  mealPreference TEXT, committeePreference1 TEXT, alloPreference1 TEXT,
  committeePreference2 TEXT, alloPreference2 TEXT, photography INTEGER, journalism INTEGER,
  awards TEXT, doubleName TEXT, doublePhone TEXT, doubleEmail TEXT, doubleMealPreference TEXT,
  doubleExperience TEXT, doubleAwards TEXT, doubleInstitution TEXT,
  transactionScreenshot TEXT, transactionId TEXT, referenceCode TEXT
)`);

// Create exhibits table if doesn't exist
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

// POST endpoint for delegate registration, with file upload
app.post('/register', upload.single('transactionScreenshot'), (req, res) => {
  const data = req.body;
  const file = req.file;
  const screenshotPath = file ? file.path : '';

  const sql = `INSERT INTO registrations (
    name, email, phone, experience, institution, mealPreference,
    committeePreference1, alloPreference1, committeePreference2, alloPreference2,
    photography, journalism, awards, doubleName, doublePhone,
    doubleEmail, doubleMealPreference, doubleExperience, doubleAwards,
    doubleInstitution, transactionScreenshot, transactionId, referenceCode
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.name, data.email, data.phone, data.experience, data.institution, data.mealPreference,
    data.committeePreference1, data.alloPreference1, data.committeePreference2, data.alloPreference2,
    data.photography === 'true' || data.photography === true ? 1 : 0,
    data.journalism === 'true' || data.journalism === true ? 1 : 0,
    data.awards, data.doubleName, data.doublePhone, data.doubleEmail, data.doubleMealPreference,
    data.doubleExperience, data.doubleAwards, data.doubleInstitution,
    screenshotPath, data.transactionId, data.referenceCode
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to save registration');
    } else {
      res.status(200).json({ id: this.lastID, message: 'Registration saved with file!' });
    }
  });
});

// POST endpoint for exhibit submissions, with file upload
app.post('/submit-exhibit', upload.single('artwork'), (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});