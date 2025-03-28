import { useState } from 'react';
import noteService from '../services/noteService';

function NoteUpdate ({note, closeForm}) {
    const [title, setTitle] = useState(note.title);
    const [description, setDescription] = useState(note.description);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await noteService.updateNote(note.id, { title, description });
        closeForm();
    };
};

export default NoteUpdate;