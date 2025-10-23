import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import Footer from './components/Footer';
import noteService from './services/notes';

const Notification = ({ message, isError = true }) => {
    if (!message) return null;
    return <div className={isError ? 'error' : 'success'}>{message}</div>;
};

const App = () => {
    const [notes, setNotes] = useState(null);
    const [newNote, setNewNote] = useState("a new note");
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes);
            })
            .catch(error => {
                console.error('Failed to fetch notes:', error);
                setErrorMessage('Failed to load notes. Please try again later.');
            });
    }, [])

    const addNote = (e) => {
        e.preventDefault();
        if (!newNote.trim()) {
            setErrorMessage('Note content cannot be empty');
            return;
        }

        const noteObject = {
            content: newNote.trim(),
            important: Math.random() < 0.5,
        };

        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
                setNewNote('');
                setErrorMessage('Note created successfully!');
                setTimeout(() => setErrorMessage(null), 3000);
            })
            .catch(error => {
                console.error('Error creating note:', error);
                setErrorMessage('Failed to create note. Please try again.');
            });
    }

    const handleNoteChange = (e) => {
        setNewNote(e.target.value);
        // Clear any error when user starts typing
        if (errorMessage) setErrorMessage(null);
    }

    const notesToShow = showAll ? notes : notes.filter(note => note.important);

    const toggleImportanceOf = (id) => {
        const note = notes.find(note => note.id === id);
        if (!note) {
            setErrorMessage('Note not found');
            return;
        }
        
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => (note.id === id ? returnedNote : note)));
                setErrorMessage(`Note marked as ${returnedNote.important ? 'important' : 'not important'}`);
                setTimeout(() => setErrorMessage(null), 3000);
            })
            .catch(error => {
                console.error('Error updating note:', error);
                setErrorMessage('Failed to update note. Please try again.');
            });
    }

    if (!notes) {
        return <div>Loading notes...</div>;
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification 
                message={errorMessage} 
                isError={!errorMessage || !errorMessage.includes('success')} 
            />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    Show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map((note) => (
                    <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
                ))}
            </ul>
            <form onSubmit={addNote}>
                <input type="text" value={newNote} onChange={handleNoteChange} />
                <button type="submit">Save</button>
            </form>
            <Footer />
        </div>
    )
}

export default App