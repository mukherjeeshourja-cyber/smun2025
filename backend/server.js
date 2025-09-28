const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('./supabaseClient'); // Import Supabase client

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Serve frontend static files from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb)=> cb(null, uploadDir),
  filename: (req, file, cb)=> cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Parse JSON and urlencoded bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Delegate registration endpoint
app.post('/register', upload.single('transactionScreenshot'), async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    const { error } = await supabase.from('registrations').insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      experience: data.experience,
      institution: data.institution,
      mealPreference: data.mealPreference,
      committeePreference1: data.committeePreference1,
      alloPreference1: data.alloPreference1,
      committeePreference2: data.committeePreference2,
      alloPreference2: data.alloPreference2,
      photography: data.photography === 'true' || data.photography === true,
      journalism: data.journalism === 'true' || data.journalism === true,
      awards: data.awards,
      doubleName: data.doubleName,
      doublePhone: data.doublePhone,
      doubleEmail: data.doubleEmail,
      doubleMealPreference: data.doubleMealPreference,
      doubleExperience: data.doubleExperience,
      doubleAwards: data.doubleAwards,
      doubleInstitution: data.doubleInstitution,
      transactionScreenshot: file ? file.filename : '',
      transactionId: data.transactionId,
      referenceCode: data.referenceCode,
    }]);

    if (error) throw error;

    res.status(200).json({ message: 'Registration saved!' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to save registration');
  }
});

// Exhibit registration endpoint
app.post('/submit-exhibit', upload.single('artwork'), async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    const { error } = await supabase.from('exhibits').insert([{
      art_type: data.art_type,
      dimensions: data.dimensions,
      price_range: data.price_range,
      maps_link: data.maps_link,
      name: data.name,
      phone: data.phone,
      email: data.email,
      declaration: data.declaration === 'on',
      artwork: file ? file.filename : '',
    }]);

    if (error) throw error;

    res.status(200).json({ message: 'Exhibit submission saved!' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to save exhibit data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
