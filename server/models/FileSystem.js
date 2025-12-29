const mongoose = require('mongoose');

const FileSystemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default-user'
  },
  fileSystem: {
    type: Object,
    required: true,
    default: {
      name: 'Root',
      type: 'folder',
      children: []
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('FileSystem', FileSystemSchema);
