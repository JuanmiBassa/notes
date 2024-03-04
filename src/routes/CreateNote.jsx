import { useState, useEffect, useRef } from "react"
import '../styles/createNote.css'
import { useNavigate, Link } from "react-router-dom"

export default function CreateNote() {
    const isMounted = useRef(true)
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const [newNoteData, setNewNoteData] = useState(
        {
            title: "",
            body: "",
            isVoiceNote: false,
            isPublic: false
        }
    )
    const [responseOk, setResponseOk] = useState(null)
    const [responseBad, setResponseBad] = useState(null)

    useEffect(() => {
        if (isMounted.current) {
            if (token == null) navigate("/login");
        }
        return () => {
            isMounted.current = false;
        };
    }, []);

    const newTitle = (event) => {
        setNewNoteData(prevState => ({
            ...prevState,
            title: event.target.value
        }));
    };

    const newBody = (event) => {
        setNewNoteData(prevState => ({
            ...prevState,
            body: event.target.value
        }))
    }

    const changeVoiceNote = (event) => {
        setNewNoteData(prevState => ({
            ...prevState,
            isVoiceNote: event.target.value === 'true'
        }))
    };

    const changeVisibility = (event) => {
        setNewNoteData(prevState => ({
            ...prevState,
            isPublic: event.target.value === 'true'
        }))
    };

    const actionCreateNote = async (event) => {
        event.preventDefault();

        setResponseOk(null);
        setResponseBad(null);

        try {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newNoteData)
            };
            const res = await fetch(`http://localhost:8080/notes`, requestOptions);

            if (res.status === 201) {
                const responseData = await res.json();
                setResponseOk('Note created successfully.')
                navigate("/notes")
            } else if (res.status === 401) {
                setResponseBad('Unauthorized.');
            } else {
                setResponseBad('Unexpected error occurred.');
            }

            setTimeout(() => {
                setResponseBad(null);
                setResponseOk(null);
            }, 5000);

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    return (
        <>
            <section className="session-section">

                <form onSubmit={async (event) => actionCreateNote(event)} method='POST' className="session-form">
                    <h1>Create a new Note</h1>

                    <div>
                        <label htmlFor="note-title">Title</label>
                        <input type="text" name="note-title" id="note-title" placeholder='Note title...' required
                            onChange={newTitle} />
                    </div>

                    <div>
                        <label htmlFor="newNote-body">Body</label>
                        <textarea name="newNote-body" id="newNote-body" rows="5" required onChange={newBody}></textarea>
                    </div>

                    <div>
                        <label>Voice note</label>
                        <div className="style-radio-container">
                            <div className="label-radio">
                                <label htmlFor="voiceNoteF">No</label>
                                <input type="radio" name="voiceNote" id="voiceNoteF" value="false"
                                    onChange={changeVoiceNote} defaultChecked={!newNoteData.isVoiceNote} />
                            </div>
                            <div className="label-radio">
                                <label htmlFor="voiceNoteT">Yes</label>
                                <input type="radio" name="voiceNote" id="voiceNoteT" value="true"
                                    onChange={changeVoiceNote} defaultChecked={newNoteData.isVoiceNote} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Visibility</label>
                        <div className="style-radio-container">
                            <div className="label-radio">
                                <label htmlFor="publicF">Public</label>
                                <input type="radio" name="visibility" id="publicF" value="true"
                                    onChange={changeVisibility} defaultChecked={newNoteData.isPublic} />
                            </div>
                            <div className="label-radio">
                                <label htmlFor="publicT">Private</label>
                                <input type="radio" name="visibility" id="publicT" value="false"
                                    onChange={changeVisibility} defaultChecked={!newNoteData.isPublic} />
                            </div>
                        </div>
                    </div>

                    <div id="createNote-form-buttons" className='center-content'>
                        <Link to="/notes">BACK</Link>
                        <button type='submit' className='submit-button'>CREATE</button>
                    </div>

                    {responseOk && <p className='response-ok'>{responseOk}</p>}
                    {responseBad && <p className='response-bad'>{responseBad}</p>}
                </form>

            </section>
        </>
    )
}