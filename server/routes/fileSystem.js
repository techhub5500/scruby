const express = require('express');
const router = express.Router();
const FileSystem = require('../models/FileSystem');

// Get file system for a user
router.get('/:userId', async (req, res) => {
  try {
    let fileSystem = await FileSystem.findOne({ userId: req.params.userId });
    
    if (!fileSystem) {
      // Create default file system if not exists
      fileSystem = new FileSystem({
        userId: req.params.userId,
        fileSystem: {
          name: 'Root',
          type: 'folder',
          children: []
        }
      });
      await fileSystem.save();
    }
    
    res.json(fileSystem.fileSystem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save file system for a user
router.post('/:userId', async (req, res) => {
  try {
    let fileSystem = await FileSystem.findOne({ userId: req.params.userId });
    
    if (!fileSystem) {
      fileSystem = new FileSystem({
        userId: req.params.userId,
        fileSystem: req.body
      });
    } else {
      fileSystem.fileSystem = req.body;
    }
    
    await fileSystem.save();
    res.json({ message: 'File system saved successfully', fileSystem: fileSystem.fileSystem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
