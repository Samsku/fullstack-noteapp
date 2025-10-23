import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';


// Get the current file and directory paths in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create paths relative to the project root
const rootDir = path.resolve(process.cwd());

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? new RegExp(`^https?://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}(:\\d+)?$`)
        : 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// CSP Middleware: allow connections to localhost:3001
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' http://localhost:3001"
    );
    next();
});


// API Routes
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true,
        date: new Date().toISOString()
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false,
        date: new Date().toISOString()
    }
];

// Get all notes
app.get('/api/notes', (req, res) => {
    try {
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new note
app.post('/api/notes', (req, res) => {
    try {
        const body = req.body;

        if (!body.content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const note = {
            content: body.content,
            important: body.important || false,
            id: generateId(),
            date: new Date().toISOString()
        };

        notes = notes.concat(note);
        res.status(201).json(note);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to generate ID
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
};

// Serve static files from the Vite build
if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(rootDir, 'dist');
    console.log('Serving static files from:', staticPath);

    app.use(express.static(staticPath, {
        setHeaders: (res, path) => {
            // Set proper MIME type for JavaScript files
            if (path.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            }
        }
    }));

    // Handle SPA routing - return index.html for any other routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(staticPath, 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log('Root directory:', rootDir);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

export default app;