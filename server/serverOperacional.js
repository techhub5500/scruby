const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://tececonsultoria:91152959Microsoft%3F@feedback.tifxid9.mongodb.net/scruby?retryWrites=true&w=majority&appName=Feedback';
mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const fileSystemRoutes = require('./routes/fileSystem');
app.use('/api/filesystem', fileSystemRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Scruby Server API is running on port ' + PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
