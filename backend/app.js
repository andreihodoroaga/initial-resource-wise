const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const cors = require('cors'); // Import the cors module
const port = 3000; // You can change the port if needed

app.use(cors({
  origin: 'http://localhost:4200',
}));

// Define the storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // The uploaded files will be stored in the "images" directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = path.basename(file.originalname, extname);
    cb(null, filename + extname); // Use the original filename with a unique suffix to avoid naming conflicts
  },
});

// Initialize multer with the storage options
const upload = multer({ storage });

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Define a route to handle the POST request for image upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).json({ message: 'Image uploaded successfully' });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

app.get('/images/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, 'images', filename);

  // Check if the image file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    } else {
      // Send the image file as a response
      res.sendFile(imagePath);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
