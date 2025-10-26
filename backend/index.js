// Import required modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Note from "./models/note.js";


// Directory and filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// API routes
let notes = [
    { id: '1', content: 'HTML is easy', important: true },
    { id: '2', content: 'Browser can execute only JavaScript', important: false },
    { id: '3', content: 'GET and POST are the most important methods of HTTP protocol', important: true },
];

// Get all notes
app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    })
});

// Note by id
app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(note);
        } else {
            res.status(404).end();
        }
    })
        .catch(error => next(error))
});

// Create new note
app.post('/api/notes', (req, res, next) => {    const body = req.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    note.save().then(savedNote => {
        res.json(savedNote);
    })
        .catch(error => next(error))
});

// Delete note
app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id).then(() => {
        res.status(204).end();
    })
        .catch(error => next(error))
});

// API update route
app.put('/api/notes/:id', (req, res, next) => {
    const { content, important } = req.body;

    Note.findById(req.params.id).then(note => {
        if (!note) return res.status(404).end();

        note.content = content;
        note.important = important;

        return note.save().then(updatedNote => {
            res.json(updatedNote);
        })
    })
        .catch(error => next(error))
});

// Serve React build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router — serve index.html for non-API GET requests
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        next();
    }
});

// Error handler
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === "CastError") {
        return res.status(400).send({error: "Malformed id"});
    } else if (error.name === "ValidationError") {
        return res.status(400).send({error: error.message});
    }
    next(error);
}
app.use(errorHandler);


// Port
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
