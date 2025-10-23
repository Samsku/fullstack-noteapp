import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve React build
app.use(express.static(path.join(__dirname, "dist")));

// In-memory notes database
let notes = [
    { id: '1', content: 'HTML is easy', important: true },
    { id: '2', content: 'Browser can execute only JavaScript', important: false },
    { id: '3', content: 'GET and POST are the most important methods of HTTP protocol', important: true },
];

// API routes
app.get('/api/notes', (req, res) => res.json(notes));

app.get('/api/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    note ? res.json(note) : res.status(404).end();
});

app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) return res.status(400).json({ error: 'content missing' });

    const id = String(notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) + 1 : 1);
    const note = { content: body.content, important: body.important || false, id };
    notes = notes.concat(note);
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(n => n.id !== req.params.id);
    res.status(204).end();
});

app.put('/api/notes/:id', (req, res) => {
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Note not found' });

    notes[index] = { ...notes[index], content: req.body.content, important: req.body.important };
    res.json(notes[index]);
});

// Fallback for React Router — serve index.html for all frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
