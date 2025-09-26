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
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Use bodyParser only for JSON (multer handles multipart)
app.use(bodyParser.json());

// Connect to SQLite database (file will be created if not exist)
const dbPath = path.join(__dirname, 'registrations.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, email TEXT, phone TEXT, experience TEXT, institution TEXT,
  mealPreference TEXT, committeePreference1 TEXT, alloPreference1 TEXT,
  committeePreference2 TEXT, alloPreference2 TEXT, photography INTEGER, journalism INTEGER,
  awards TEXT, doubleName TEXT, doublePhone TEXT, doubleEmail TEXT, doubleMealPreference TEXT,
  doubleExperience TEXT, doubleAwards TEXT, doubleInstitution TEXT,
  transactionScreenshot TEXT, transactionId TEXT, referenceCode TEXT
)`);

// POST endpoint to receive form + file upload
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
