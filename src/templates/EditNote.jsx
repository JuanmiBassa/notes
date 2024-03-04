import { useEffect, useRef, useState } from 'react'
import '../styles/dataNote.css'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function EditNote({ noteId }) {
    const isMounted = useRef(true)
    const [dataNote, setDataNote] = useState(null)
    const [newDataNote, setNewDataNote] = useState({
        title: null,
        body: null,
        isVoiceNote: null,
        isPublic: null
    })
    const [editMode, setEditMode] = useState(false)
    const [modalResponseOK, setModalResponseOK] = useState(null)
    const [modalResponseBAD, setModalResponseBAD] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isMounted.current) {
            getDataNote();
        }
        return () => {
            isMounted.current = false;
        };
    }, []);

    const getDataNote = async () => {
        try {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const res = await fetch(`http://localhost:8080/notes/${noteId}`, requestOptions);

            if (res.status === 200) {
                const responseData = await res.json();
                console.log("Data: " + responseData);
                setDataNote(responseData);
                setNewDataNote({
                    title: responseData.title,
                    body: responseData.body,
                    isVoiceNote: responseData.isVoiceNote,
                    isPublic: responseData.isPublic
                });
            } else if (res.status === 401) {
                navigate("/error", { state: { code: "401", message: "Unauthorized." } });
            } else if (res.status === 404) {
                navigate("/error", { state: { code: "404", message: "Note not found." } });
            } else {
                console.log('Unexpected error occurred.');
            }

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    function formatDate(isoDate) {
        return format(new Date(isoDate), 'yyyy-MM-dd HH:mm:ss');
    }

    const newTitle = (event) => {
        setNewDataNote(prevState => ({
            ...prevState,
            title: event.target.value
        }));
    };

    const newBody = (event) => {
        setNewDataNote(prevState => ({
            ...prevState,
            body: event.target.value
        }))
    }

    const changeVoiceNote = (event) => {
        setNewDataNote(prevState => ({
            ...prevState,
            isVoiceNote: event.target.value === 'true'
        }))
    };

    const changeVisibility = (event) => {
        setNewDataNote(prevState => ({
            ...prevState,
            isPublic: event.target.value === 'true'
        }))
    };

    const putDataNote = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDataNote)
            };
            const res = await fetch(`http://localhost:8080/notes/${noteId}`, requestOptions);

            if (res.status === 200) {
                const responseData = await res.json();
                setDataNote(responseData);
                setEditMode(false);
                setModalResponseOK("Note updated successfully.");
            } else if (res.status === 401) {
                setModalResponseBAD("Unauthorized.");
            } else if (res.status === 404) {
                setModalResponseBAD("Note not found.");
            } else {
                setModalResponseBAD('Unexpected error occurred.');
            }

            setTimeout(() => {
                setModalResponseOK(null);
                setModalResponseBAD(null);
            }, 3000);

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    return (
        <>
            {dataNote &&
                <section className='dataNote-section'>
                    <div id='dataNote-buttons'>
                        <h1>NOTE DATA</h1>
                        <button onClick={() => setEditMode(true)}><MdEdit />Edit note</button>
                    </div>

                    <form id='dataNote-container' onSubmit={async (event) => putDataNote(event)} method='PUT'>
                        <div>
                            <label htmlFor="noteId">ID</label>
                            <p>{dataNote.id}</p>
                        </div>

                        <div>
                            <label htmlFor="note-title">Title</label>
                            {editMode
                                ?
                                <input type="text" name="note-title" id="note-title" defaultValue={dataNote.title} required
                                    onChange={newTitle} />
                                :
                                <p>{dataNote.title}</p>
                            }
                        </div>

                        <div>
                            <label htmlFor="note-body">Body</label>
                            {editMode
                                ?
                                <textarea name="newNote-body" id="newNote-body" rows="5" required
                                    onChange={newBody} defaultValue={dataNote.body}></textarea>
                                :
                                <p>{dataNote.body}</p>
                            }
                        </div>

                        <div>
                            <label htmlFor="noteCreatedDate">Creation date</label>
                            <p>{formatDate(dataNote.createdAt)}</p>
                        </div>

                        <div>
                            <label htmlFor="noteModifiedDate">Modification date</label>
                            <p>{formatDate(dataNote.modifiedAt)}</p>
                        </div>

                        <div>
                            <label htmlFor="noteModifiedDate">Voice note</label>
                            {editMode
                                ?
                                <>
                                    <div>
                                        <label htmlFor="isVoiceNote">Yes</label>
                                        <input type="radio" name="voiceNote" id="isVoiceNote" value="true"
                                            onChange={changeVoiceNote} defaultChecked={dataNote.isVoiceNote} />
                                    </div>
                                    <div>
                                        <label htmlFor="notIsVoiceNote">No</label>
                                        <input type="radio" name="voiceNote" id="notIsVoiceNote" value="false"
                                            onChange={changeVoiceNote} defaultChecked={!dataNote.isVoiceNote} />
                                    </div>
                                </>
                                :
                                <>
                                    {dataNote.isVoiceNote && <p>Yes</p>}
                                    {!dataNote.isVoiceNote && <p>No</p>}
                                </>
                            }
                        </div>

                        <div>
                            <label htmlFor="noteModifiedDate">Visibility</label>

                            {editMode
                                ?
                                <>
                                    <div>
                                        <label htmlFor="isPublic">Public</label>
                                        <input type="radio" name="visibility" id="isPublic" value="true"
                                            onChange={changeVisibility} defaultChecked={dataNote.isPublic} />
                                    </div>
                                    <div>
                                        <label htmlFor="isPrivate">Private</label>
                                        <input type="radio" name="visibility" id="isPrivate" value="false"
                                            onChange={changeVisibility} defaultChecked={!dataNote.isPublic} />
                                    </div>
                                </>
                                :
                                <>
                                    {dataNote.isPublic && <p>Public</p>}
                                    {!dataNote.isPublic && <p>Private</p>}
                                </>
                            }
                        </div>

                        <div>
                            {editMode &&
                                <div>
                                    <button onClick={() => setEditMode(false)}><FaLongArrowAltLeft />CANCEL</button>
                                    <button type='submit'><MdEdit />SAVE CHANGES</button>
                                </div>
                            }
                        </div>
                    </form>

                    {modalResponseOK != null &&
                        <div className='modal-response modal-ok'>
                            <p>{modalResponseOK}</p>
                        </div>
                    }

                    {modalResponseBAD != null &&
                        <div className='modal-response modal-bad'>
                            <p>{modalResponseBAD}</p>
                        </div>
                    }
                </section>
            }
        </>
    )
}