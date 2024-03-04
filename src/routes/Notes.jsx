import '../styles/notes.css'
import { useState, useEffect, useRef } from 'react'
import { FaPlus } from "react-icons/fa6"
import Note from '../templates/Note'
import { useNavigate } from "react-router-dom"

export default function Notes() {
    const isMounted = useRef(true)
    const navigate = useNavigate()
    const [listOfNotes, setListOfNotes] = useState()
    const [notesFiltered, setNotesFiltered] = useState()
    const token = localStorage.getItem('token');
    const [searchOn, setSearchOn] = useState("all")
    const [searchBy, setSearchBy] = useState("titleAndBody")
    const [searchText, setSearchText] = useState("")
    const [orderBy, setOrderBy] = useState("ModfAsc")

    useEffect(() => {
        if (isMounted.current) {
            if (token != null) getNotes()
        }
        return () => {
            isMounted.current = false;
        };
    }, []);

    const getNotes = async () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const res = await fetch(`http://localhost:8080/notes`, requestOptions);

            if (res.status === 200) {
                const responseData = await res.json();
                setListOfNotes(responseData);
                setNotesFiltered(responseData)
            } else if (res.status === 401) {
                console.log("Error 401");
            } else {
                console.log("error");
            }

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    const deleteNoteAndUpdateList = (noteId) => {
        setNotesFiltered(notesFiltered.filter(note => note.id !== noteId));
    };

    const changeSearchOn = (event) => {
        setSearchOn(event.target.value);
        filterNotes([event.target.value, searchBy, searchText, orderBy]);
    }

    const changeSearchBy = (event) => {
        setSearchBy(event.target.value);
        filterNotes([searchOn, event.target.value, searchText, orderBy]);
    }

    const changeText = (event) => {
        setSearchText(event.target.value.toLowerCase());
        filterNotes([searchOn, searchBy, event.target.value.toLowerCase(), orderBy]);
    }

    const changeSortOrder = (event) => {
        setOrderBy(event.target.value);
        filterNotes([searchOn, searchBy, searchText, orderBy]);
    }

    const filterNotes = ([searchOn, searchBy, searchText, orderBy]) => {
        let filteredNotes = listOfNotes;

        if (searchOn !== 'all') {
            if (searchOn === 'text') {
                filteredNotes = filteredNotes.filter(note => !note.isVoiceNote);
            } else if (searchOn === 'audio') {
                filteredNotes = filteredNotes.filter(note => note.isVoiceNote);
            }
        }

        if (searchText.length > 0) {
            if (searchBy === 'titleAndBody') {
                filteredNotes = filteredNotes.filter(note => note.title.toLowerCase().includes(searchText) || note.body.toLowerCase().includes(searchText));
            } else if (searchBy === 'title') {
                filteredNotes = filteredNotes.filter(note => note.title.toLowerCase().includes(searchText));
            } else if (searchBy === 'body') {
                filteredNotes = filteredNotes.filter(note => note.body.toLowerCase().includes(searchText));
            }
        }

        if (orderBy === 'ModfAsc') {
            filteredNotes.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
        } else if (orderBy === 'ModfDesc') {
            filteredNotes.sort((a, b) => new Date(a.modifiedAt) - new Date(b.modifiedAt));
        } else if (orderBy === 'CreatAsc') {
            filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (orderBy === 'CreatDesc') {
            filteredNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (orderBy === 'alphABC') {
            filteredNotes.sort((a, b) => b.title.localeCompare(a.title));
        } else if (orderBy === 'alphZYX') {
            filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
        }

        setNotesFiltered(filteredNotes);
    }

    return (
        <section id="notes-section">
            <div id='filter-add-notes'>
                <div id='filter-container'>
                    <div>
                        <label htmlFor="search-on">Search on</label>
                        <select name="search-on" id="search-on" defaultValue="all" onChange={changeSearchOn}>
                            <option value="all">All notes</option>
                            <option value="text">Text notes</option>
                            <option value="audio">Audio notes</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="search-by">Search by</label>
                        <select name="search-by" id="search-by" defaultValue="titleAndBody" onChange={changeSearchBy}>
                            <option value="titleAndBody">Title and Body</option>
                            <option value="title">Title</option>
                            <option value="body">Body</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filter-text">Text to search</label>
                        <input type="text" id='filter-text' name='filter-text' placeholder='Text...' onChange={changeText} />
                    </div>
                    <div>
                        <label htmlFor="search-by">Sort by</label>
                        <select name="search-by" id="search-by" defaultValue="ModfAsc" onChange={changeSortOrder}>
                            <option value="ModfAsc">Modification Asc</option>
                            <option value="ModfDesc">Modification Desc</option>
                            <option value="CreatAsc">Creation Asc</option>
                            <option value="CreatDesc">Creation Desc</option>
                            <option value="alphABC">Alphabetical a,b,c...</option>
                            <option value="alphZYX">Alphabetical z,y,x...</option>
                        </select>
                    </div>
                </div>

                <div id='addNote-container'>
                    <button onClick={() => navigate("/createNote")}><FaPlus /> CREATE NOTE</button>
                </div>
            </div>

            <div id='notes-container'>
                {notesFiltered && notesFiltered.map((note, index) => (
                    <Note key={index} note={note} onDeleteNote={deleteNoteAndUpdateList} />
                ))}
            </div>
        </section>
    )
}