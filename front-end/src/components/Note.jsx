import { motion } from "framer-motion";
import { Pencil, CircleX, FileCheck, PencilOff } from "lucide-react";
import { useState } from "react";
import noteService from "../services/noteService.js";

const Note = ({ entry, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState(entry);

  const handleUpdate = async () => {
    try {
      await noteService.updateNote(note.id, note);
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  const handleReset = () => {
    setNote(entry);
    setIsUpdating(false);
  }

  return (
    <motion.div 
      className="border p-4 rounded-lg shadow-md bg-white w-[100%]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      
      {!isUpdating ? (
        <div>
        {/* Note Display */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{note.title}</h3>
            <div>
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                <CircleX />
              </button>
              <button
                onClick={() => setIsUpdating(true)}
                className="text-green-500 hover:text-green-700 font-bold">
                <Pencil />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{note.description}</p>
          <p className="text-xs text-gray-400 mt-2">Created at: {note.createdAt}</p>
        </div>
      ) : (
        <div>
        {/* Note Update Form */}
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder={note.title} 
              name="title"
              className="w-[75%] p-2 border rounded mt-2"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
            <div>
              <button
                onClick={handleUpdate}
                className="text-green-500 hover:text-green-700 font-bold"
              >
                <FileCheck />
              </button>
              <button
                onClick={handleReset}
                className="text-red-500 hover:text-red-700 font-bold">
                <PencilOff />
              </button>
            </div>
          </div>
          <textarea
              placeholder={note.description}
              value={note.description}
              name="description"
              onChange={(e) => setNote({ ...note, description: e.target.value })}
             className="w-full p-2 border rounded mt-2 h-32">
          </textarea>
          <p className="text-xs text-gray-400 mt-2">Created at: {note.createdAt}</p>
        </div>
      )
    }
    </motion.div>
  );
};

export default Note;
