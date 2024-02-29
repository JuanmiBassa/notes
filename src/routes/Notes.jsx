import '../styles/notes.css'
import { useState, useEffect, useRef } from 'react';
import { FaPlus } from "react-icons/fa6";
import Note from '../templates/Note';


export default function Notes() {
    const isMounted = useRef(true);
    const [listOfNotes, setListOfNotes] = useState();

    useEffect(() => {
        if (isMounted.current) {
            getNotes();
        }
        return () => {
            isMounted.current = false;
        };
    }, []);

    const getNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const res = await fetch(`http://localhost:8080/notes`, requestOptions);

            if (res.status === 200) {
                const responseData = await res.json();
                setListOfNotes(responseData);
                console.log(responseData);
            } else if (res.status === 401) {
                console.log("Error 401");
            } else {
                console.log("error");
            }

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    return (
        <section id="notes-section">
            <div id='addNote-container'>
                <button><FaPlus /> CREATE NOTE</button>
            </div>
            
            {listOfNotes && listOfNotes.map((note, index) => (
                <Note key={index} note={note}/>
            ))}

        </section>
    )
}