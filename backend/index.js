// Import required modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

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
app.get('/api/notes', (req, res) => res.json(notes));

// Note by id
app.get('/api/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    note ? res.json(note) : res.status(404).end();
});

// Create new note
app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) return res.status(400).json({ error: 'content missing' });
    const id = String(notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) + 1 : 1);
    const note = { content: body.content, important: body.important || false, id };
    notes = notes.concat(note);
    res.json(note);
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(n => n.id !== req.params.id);
    res.status(204).end();
});

// API update route
app.put('/api/notes/:id', (req, res) => {
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Note not found' });
    notes[index] = { ...notes[index], content: req.body.content, important: req.body.important };
    res.json(notes[index]);
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

// Port
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
