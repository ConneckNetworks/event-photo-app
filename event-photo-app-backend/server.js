const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001; // Use environment port or fallback to 3001

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('File uploaded:', req.file);
  res.send({ message: 'File uploaded successfully', filename: req.file.filename });
});

// ✅ Root route for Render
app.get('/', (req, res) => {
  res.send('Event Photo App Backend is Running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
