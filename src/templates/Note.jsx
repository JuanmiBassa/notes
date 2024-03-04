import { MdDeleteForever, MdEdit } from "react-icons/md";
import { IoArrowRedoSharp } from "react-icons/io5";
import { useState } from "react"
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom"

export default function Note({ note, onDeleteNote }) {
    const [modalResponseOK, setModalResponseOK] = useState(null)
    const [modalResponseBAD, setModalResponseBAD] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)

    function processDate(date) {
        const fecha = new Date(date);

        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();

        function pad(num) {
            return num < 10 ? '0' + num : num;
        }

        return `${pad(dia)}/${pad(mes)}/${año}`;
    }

    const generateRandomHSL = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 35%, 60%)`;
    };

    const actionDeleteNote = async (noteId) => {
        setModalDelete(false);

        try {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            };
            const res = await fetch(`http://localhost:8080/notes/${noteId}`, requestOptions);

            if (res.status === 204) {
                setModalResponseOK('Note deleted successfully.');
                onDeleteNote(noteId);
            } else if (res.status === 401) {
                setModalResponseBAD('Unauthorized.');
            } else if (res.status === 404) {
                setModalResponseBAD('Note not found.');
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
            <div className='note'>
                <div className='note-title'>
                    <p>{note.title}</p>
                </div>
                <div className='note-body' style={{ backgroundColor: generateRandomHSL() }}>
                    <p>{note.body}</p>
                </div>

                {note.isPublic && <div className='visibility public'></div>}
                {!note.isPublic && <div className='visibility private'></div>}

                <div className='note-data'>
                    <div className='note-date'>
                        <p>Last mod:</p>
                        <p>{processDate(note.modifiedAt)}</p>

                    </div>
                    <div className='note-buttons'>
                        <Link to={`/notes/${note.id}`}><MdEdit className='note-btn button-edit ' /></Link>

                        <button><IoArrowRedoSharp className='note-btn button-share ' /></button>

                        <button onClick={async () => setModalDelete(true)}><MdDeleteForever className='note-btn button-delete' /></button>
                    </div>
                </div>
            </div>

            {modalDelete &&
                <div className="modal-delete">
                    <div className="modal-delete-container">
                        <h3>Are you sure about deleting the note permanently?</h3>
                        <div>
                            <button className="button-back-container"
                                onClick={async () => setModalDelete(false)}><FaLongArrowAltLeft />BACK</button>
                            <button className="button-delete-container"
                                onClick={async () => actionDeleteNote(note.id)}><MdDeleteForever />DELETE</button>
                        </div>
                    </div>
                </div>
            }

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
        </>

    )
}