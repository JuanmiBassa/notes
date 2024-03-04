import { useState, useEffect, useRef } from "react"
import { FaPlus } from "react-icons/fa6"
import AddFile from "./AddFile"
import AddAudio from "./AddAudio";
import { MdDeleteForever } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";


const servUri = "http://localhost:8080";
const token = localStorage.getItem('token');

export default function FilesNote({ noteId }) {
    const isMounted = useRef(true)
    const [addingAFile, setAddingAFile] = useState(false)
    const [allFilesData, setAllFilesData] = useState([])
    const [isVoiceNote, setIsVoiceNote] = useState(false)
    const [modalResponseOK, setModalResponseOK] = useState(null)
    const [modalResponseBAD, setModalResponseBAD] = useState(null)

    useEffect(() => {
        if (isMounted.current) {
            getFilesNote();
        }
        return () => {
            isMounted.current = false;
        };
    }, []);

    const getFilesNote = async () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const res = await fetch(`${servUri}/notes/${noteId}/files`, requestOptions);

            if (res.status === 200) {
                const responseData = await res.json();
                console.log("Files URIs: ", responseData);

                const imagePromises = responseData.map(async (file) => {
                    const fileId = file.uri.split('/').pop();
                    const imageRes = await fetch(servUri + file.uri, requestOptions);
                    if (imageRes.status === 200) {
                        const imageBlob = await imageRes.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);
                        return { id: fileId, url: imageUrl, type: imageBlob.type };
                    } else {
                        throw new Error('Error fetching image.');
                    }
                });

                const images = await Promise.all(imagePromises);
                setAllFilesData(images);
                console.log(images);
            } else if (res.status === 401) {
                console.log("Unauthorized.")
            } else if (res.status === 404) {
                console.log("Note not found.")
            } else {
                console.log('Unexpected error occurred.');
            }

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    const addNewFileToList = (newFileData) => {
        setAllFilesData(prevFiles => [...prevFiles, newFileData]);
        setAddingAFile(false);
    };

    const actionDeleteFile = async (fileId) => {
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            };
            const res = await fetch(`http://localhost:8080/notes/${noteId}/files/${fileId}`, requestOptions);

            if (res.status === 204) {
                setModalResponseOK("File deleted successfully.");
                removeFileFromList(fileId);
            } else if (res.status === 401) {
                setModalResponseBAD("Unauthorized.");
            } else if (res.status === 404) {
                setModalResponseBAD("File not found.");
            } else {
                setModalResponseBAD("Unexpected error occurred.");
            }

            setTimeout(() => {
                setModalResponseOK(null);
                setModalResponseBAD(null);
            }, 3000);

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    const removeFileFromList = (fileId) => {
        setAllFilesData(prevFiles => prevFiles.filter(file => file.id !== fileId));
    };

    const downloadFile = async (fileId) => {
        const uri = `/notes/${noteId}/files/${fileId}`;
        try {
            const res = await fetch(`http://localhost:8080/notes/${noteId}/files/${fileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (res.status === 200) {
                const blob = await res.blob();

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = uri.substring(uri.lastIndexOf('/') + 1);
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                setModalResponseOK("Successful operation.");
            } else if (res.status === 401) {
                setModalResponseBAD("Unauthorized.");
            } else if (res.status === 404) {
                setModalResponseBAD("Note or file not found.");
            }

            setTimeout(() => {
                setModalResponseOK(null);
                setModalResponseBAD(null);
            }, 3000);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <>
            <section className='dataNote-section'>
                <div id='dataNote-buttons'>
                    <h1>NOTE FILES</h1>
                    <button onClick={() => setAddingAFile(true)}><FaPlus />Add file</button>
                </div>

                {addingAFile &&
                    <>
                        <div>
                            <button onClick={() => setIsVoiceNote(false)}>FILE</button>
                            <button onClick={() => setIsVoiceNote(true)}>VOICE NOTE</button>
                        </div>

                        {isVoiceNote ?
                            <AddAudio noteId={noteId} setAddingAFile={setAddingAFile} addNewFileToList={addNewFileToList} />
                            :
                            <AddFile noteId={noteId} setAddingAFile={setAddingAFile} addNewFileToList={addNewFileToList} />
                        }
                    </>
                }

                <div id="files-container">
                    {allFilesData.map(fileData => (
                        <div key={fileData.id}>
                            {fileData.type.startsWith('image') ? (
                                <div className="file file-img">
                                    <div style={{ backgroundImage: `url(${fileData.url})` }}></div>
                                </div>
                            ) : (
                                <div className="file file-audio">
                                    <audio controls className="audio-player">
                                        <source src={fileData.url} type="audio/wav" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
                            <div className="options-file">
                                <button onClick={async () => downloadFile(fileData.id)}><FaDownload />Download</button>
                                <button onClick={async () => actionDeleteFile(fileData.id)}><MdDeleteForever />Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

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
        </>
    )
}