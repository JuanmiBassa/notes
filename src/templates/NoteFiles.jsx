import { useState, useEffect, useRef } from "react"
import { FaPlus } from "react-icons/fa6"
import AddFile from "./AddFile"
import AddAudio from "./AddAudio";
import { MdDeleteForever } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";


const servUri = "http://localhost:8080";

export default function FilesNote({ noteId }) {
    const isMounted = useRef(true)
    const [addingAFile, setAddingAFile] = useState(false)
    const [allFilesData, setAllFilesData] = useState([])
    const [isVoiceNote, setIsVoiceNote] = useState(false)

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
            const token = localStorage.getItem('token');
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
                                <button><FaDownload />Download</button>
                                <button><MdDeleteForever />Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </>
    )
}