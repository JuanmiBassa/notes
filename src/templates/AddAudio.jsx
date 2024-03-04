import { useState, useRef } from "react";
import '../styles/createNote.css';

export default function AddAudio({ noteId, setAddingAFile, addNewFileToList }) {
    const [responseOk, setResponseOk] = useState(null);
    const [responseBad, setResponseBad] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                const chunks = [];
                mediaRecorder.ondataavailable = event => {
                    chunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/wav' });
                    const url = URL.createObjectURL(blob);
                    setAudioUrl(url);
                };

                mediaRecorder.start();
                setRecording(true);
            })
            .catch(error => console.error('Error accessing microphone: ', error));
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const submitAudio = async (event) => {
        event.preventDefault();

        if (!audioUrl) {
            setResponseBad('Please record a voice note.');
            return;
        }

        const formData = new FormData();
        const audioBlob = await fetch(audioUrl).then(res => res.blob());
        formData.append("file", audioBlob, "audio.wav");

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
                const fileId = responseData.uri.split('/').pop();
                const newFileData = { id: fileId, url: audioUrl, type: audioBlob.type };
                addNewFileToList(newFileData);
                setResponseOk('Note created successfully.');
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
            <form onSubmit={submitAudio} className="session-form">
            <div>
                {!recording ? (
                    <button type="button" onClick={startRecording}>Start Recording</button>
                ) : (
                    <button type="button" onClick={stopRecording}>Stop Recording</button>
                )}
            </div>
            <audio controls src={audioUrl}></audio>

                <div id="addfile-form-container" className='center-content'>
                    <button type='button' id='addfile-button' onClick={() => setAddingAFile(false)}>Close</button>
                    <button type='submit' className='submit-button'>Add</button>
                </div>
                {responseOk && <p className='response-ok'>{responseOk}</p>}
                {responseBad && <p className='response-bad'>{responseBad}</p>}
            </form>
        </>
    );
}
