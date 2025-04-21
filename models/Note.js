const mongoose = require('mongoose');

// Define the Note schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Note model from the schema
const Note = mongoose.model('Note', noteSchema);

// Export the Note model
module.exports = Note;
