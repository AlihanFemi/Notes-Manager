import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Search, Album } from "lucide-react"; 
import { useAuth } from '../context/AuthContext.jsx';
import NoteCreation from '../components/Note-Creation.jsx';
import SearchFilter from '../components/Note-Search.jsx';
import Note from '../components/Note.jsx';
import noteService from '../services/noteService.js';
import PaginationFooter from "../components/Footer-Pagination.jsx";

function HomePage() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(false);
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 9;
    const { user } = useAuth();

    const createNote = async (note) => {
        try {
            const response = await noteService.createNote(note);
            setNotes((prevNotes) => [...prevNotes, response]);
            getAllNotes(currentPage);
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            await noteService.deleteNote(noteId);
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const getAllNotes = async (page = currentPage) => {
        try {
            setIsLoading(true);
            const response = await noteService.getAllNotes(page, pageSize);
            
            // Match API response properties exactly
            setTotalPages(response.pageCount);
            setCurrentPage(response.page);
            setNotes(response.notes || []);
        } catch (e) {
            console.error("Error fetching notes:", e);
            setCurrentPage(1);
            setTotalPages(0);
            setNotes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        const validatedPage = Math.max(1, Math.min(newPage, totalPages));
        if (validatedPage !== currentPage) {
            setCurrentPage(validatedPage);
        }
    };

    const handleFilter = async (filters) => {
        try {
            setIsLoading(true);
            const { query, fromDate, toDate } = filters;
            const data = await noteService.searchNotes(query, fromDate, toDate,1, pageSize);
            // Use same API response structure
            setNotes(data.notes || []);
            setTotalPages(data.PageCount);
            setCurrentPage(data.page);
        } catch (error) {
            console.error("Error filtering notes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            // Use IIFE to capture current page value
            (async () => {
                const pageToFetch = currentPage;
                await getAllNotes(pageToFetch);
            })();
        }
    }, [user, currentPage]);

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Control Buttons */}
            <div className="flex justify-center p-2">
                <div className="inline-flex bg-gray-100 py-2 px-4 shadow-md rounded-lg gap-2">
                    <button
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
                        onClick={() => setOpen(true)}
                    >
                        <Plus size={18} />
                    </button>
                    <button
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                        onClick={() => setSearch(true)}
                    >
                        <Search size={18} />
                    </button>
                    <button
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                        onClick={() => {
                            setCurrentPage(1);
                            getAllNotes(1);
                        }}
                    >
                        <Album size={18} />
                    </button>
                </div>
                
                {/* Modals */}
                <NoteCreation 
                    open={open} 
                    setOpen={setOpen} 
                    onSubmit={createNote}
                />
                <SearchFilter 
                    onFilter={handleFilter} 
                    open={search} 
                    setOpen={setSearch}
                />
            </div>

            {/* Notes Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            Loading notes...
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-fit">
                        <AnimatePresence>
                            {notes.length === 0 ? (
                                <div className="col-span-full h-full flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        No notes found
                                    </div>
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <Note
                                        entry={note}
                                        key={note.id}
                                        onDelete={() => deleteNote(note.id)}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-auto border-t">
                <PaginationFooter
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={handlePageChange}
                />
            </div>
        </div>
    );
}

export default HomePage;