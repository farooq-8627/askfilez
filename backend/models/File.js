const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  size: Number,
  mimetype: String,
  username: String,
  uploadDate: { type: Date, default: Date.now }
});
FileSchema.index({
  originalName: 'text',
  username: 1 // Index for username filtering
});

module.exports = mongoose.model('File', FileSchema);