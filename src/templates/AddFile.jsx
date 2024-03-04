import { useState } from "react"
import '../styles/createNote.css'

export default function AddFile({ noteId, setAddingAFile, addNewFileToList }) {
    const [responseOk, setResponseOk] = useState(null)
    const [responseBad, setResponseBad] = useState(null)
    const [file, setFile] = useState(null);

    const changeFile = (event) => {
        setFile(event.target.files[0]);
    };

    const actionAddAFile = async (event) => {
        event.preventDefault();
        setResponseOk(null);
        setResponseBad(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            };
            const res = await fetch(`http://localhost:8080/notes/${noteId}/files`, requestOptions);

            if (res.status === 201) {
                const responseData = await res.json();
                console.log("respo" + responseData.uri);

                const requestOptionsGet = {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                };
                const fileId = responseData.uri.split('/').pop();
                const imageRes = await fetch("http://localhost:8080" + responseData.uri, requestOptionsGet);
                if (imageRes.status === 200) {
                    const imageBlob = await imageRes.blob();
                    const imageUrl = URL.createObjectURL(imageBlob);
                    const newImage = { id: fileId, url: imageUrl, type: imageBlob.type };
                    addNewFileToList(newImage);
                    setResponseOk('Note created successfully.')
                } else {
                    throw new Error('Error fetching image.');
                }
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
            <form onSubmit={async (event) => actionAddAFile(event)} method='POST' className="session-form">
                <h1>Add a new file</h1>
                <div>
                    <input type="file" id="add-file" name="add-file" onChange={changeFile} />
                </div>

                {responseOk && <p className='response-ok'>{responseOk}</p>}
                {responseBad && <p className='response-bad'>{responseBad}</p>}

                <div id="addfile-form-container" className='center-content'>
                    <button type='button' id='addfile-button' onClick={() => setAddingAFile(false)}>CLOSE</button>
                    <button type='submit' className='submit-button'>ADD</button>
                </div>
            </form>
        </>
    )
}