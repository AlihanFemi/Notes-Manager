import noteService from "../services/noteService";

function NoteDeletion({ noteId, onDelete }) {
    const handleDelete = async () => {
        await noteService.deleteNote(noteId);
        onDelete();
    };
};

export default NoteDeletion;