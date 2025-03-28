import API from './api.js'; 

const createNote = async (noteData) => {
    const response = await API.post('/notes', noteData);
    return response.data;
}

const updateNote = async (id, updatedNoteData) => {
    const response = await API.put(`/notes/${id}`, updatedNoteData);
    return response.data;
}

const deleteNote = async (id) => { 
   const response = await API.delete(`/notes/${id}`);
   return response.status;
}

const noteService = {
   createNote,
   updateNote,
   deleteNote
};

export default noteService;