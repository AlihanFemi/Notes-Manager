import { useState } from "react";

function NoteCreation({ onSubmit }) {
    const [note, setNote] = useState({ title: "", description: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmition = (e) => {
        e.preventDefault();
        onSubmit(note);
        setNote({ title: "", description: "" });
    };
};

export default NoteCreation;