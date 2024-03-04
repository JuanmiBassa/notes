import { useParams, Link } from 'react-router-dom'
import '../styles/dataNote.css'
import EditNote from '../templates/EditNote.jsx';
import NoteFiles from '../templates/NoteFiles.jsx';

export default function DataNote() {
    const { noteId } = useParams()

    return (
        <>
            <EditNote noteId={noteId} />
            <NoteFiles noteId={noteId} />
        </>
    )
}