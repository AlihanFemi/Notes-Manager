import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Search, Trash, Album } from "lucide-react"; 
import { useAuth } from '../context/AuthContext.jsx';
import NoteCreation from '../components/Note-Creation.jsx';
import SearchFilter from '../components/Note-Search.jsx';
import Note from '../components/Note.jsx';
import noteService from '../services/noteService.js';
import PaginationFooter from "../components/Footer-Pagination.jsx";

function HomePage () {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(false);
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(currentPage); 
    const pageCount = 10;
    const  {user}  = useAuth();

    const createNote = async (note) => {
        try {
            const response = await noteService.createNote(note);
            console.log("Note created successfully:", response);
            setNotes((prevNotes) => [...prevNotes, response]);
        } catch (error) {
            console.error("Error creating note:", error);
        } 
    }

    const deleteNote = async (noteId) => {
        try {
            await noteService.deleteNote(noteId);
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
            console.log("Note deleted successfully");
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    }

    const getAllNotes = async () => {
        try{
            const response = await noteService.getAllNotes(currentPage, pageCount);
            setNotes(response.notes);
        }
        catch(e){
            console.error("Error fetching notes:", e);
        }
    }

    const handleFilter = async (filters) => {
        const { query, fromDate, toDate } = filters;
        const data = await noteService.searchNotes(query, fromDate, toDate,1, pageCount);
        setNotes(data.notes);
    }

    useEffect(() => {
        getAllNotes();
    }, [user, currentPage]);

    return (
    <div>
        <div>
          {/* Secondary Bar - Centered Buttons */}
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 py-2 px-4 shadow-md rounded-lg">
                <button className="mx-1 p-2 bg-green-500 hover:bg-green-600 text-white rounded-full">
                    <Plus size={18} onClick={() => setOpen(true)}/>
                </button>
                <button className="mx-1 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                    <Search size={18} onClick={() => setSearch(true)}/>
                </button>
                <button className="mx-1 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                    <Album size={18} onClick={getAllNotes}/>
                </button>
                </div>
            </div>
            <NoteCreation open={open} setOpen={setOpen} onSubmit={createNote}/>
            <SearchFilter onFilter={handleFilter} open={search} setOpen={setSearch}/>

            {/* Main Content - Notes List */}
            <div className="p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <AnimatePresence>
                    {notes.map((note) => (
                        <Note 
                        entry={note}
                        key={note.id}
                        onDelete={() => deleteNote(note.id)}
                        />
                    ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
        <PaginationFooter  currentPage={currentPage} totalPages={totalPages}/>

    </div>
    )
}

export default HomePage