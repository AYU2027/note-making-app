const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Note = require('./models/Note'); // Ensure this path is correct for your setup

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (like CSS)
app.use(express.static('public'));

// MongoDB connection (updated to remove deprecated options)
mongoose.connect('mongodb://127.0.0.1:27017/notes_app')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Home Route
app.get('/', (req, res) => {
  res.send('Note Making App - MongoDB Connected!');
});

// Route to show form
app.get('/new-note', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// POST Route to Save a New Note
app.post('/add-note', async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log('Received note:', title, content);  // Log to debug
    const newNote = new Note({ title, content });
    await newNote.save();
    res.send('✅ Note saved successfully!');
  } catch (err) {
    console.error('Error saving note:', err);  // Log error to the console
    res.send('❌ Error saving note: ' + err.message);
  }
});

// Route to display all notes
app.get('/all-notes', async (req, res) => {
  try {
    const notes = await Note.find();
    let notesHtml = `
      <html>
      <head>
        <link rel="stylesheet" href="/styles.css">
        <title>All Notes</title>
      </head>
      <body>
        <h1>All Notes</h1>
        <ul>
    `;
    notes.forEach(note => {
      notesHtml += `
        <li>
          <strong>${note.title}</strong><br>
          <p>${note.content}</p>
          <small>Created on: ${note.createdAt.toLocaleString()}</small><br>
          <form action="/delete-note/${note._id}" method="POST" style="margin-top:10px;">
            <button type="submit">🗑️ Delete</button>
          </form>
        </li>
        <hr>
      `;
    });
    notesHtml += `</ul></body></html>`;
    res.send(notesHtml);
  } catch (err) {
    res.send('❌ Error fetching notes: ' + err.message);
  }
});

// Route to handle note deletion
app.post('/delete-note/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/all-notes');
  } catch (err) {
    res.send('❌ Error deleting note: ' + err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
