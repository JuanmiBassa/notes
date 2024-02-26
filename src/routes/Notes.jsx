import '../styles/notes.css'
import React, { useState, useEffect, useRef } from 'react';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { IoArrowRedoSharp } from "react-icons/io5";


export default function Notes() {
    const isMounted = useRef(true);

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
                console.log(responseData);
            } else if (res.status === 401) {
                console.log("401");
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
            <div className='note'>
                <div className='note-title'>
                    <p>Title</p>
                </div>
                <div className='note-body'>
                    <p>jfasjuifdujidfsji</p>
                </div>
                <div className='visibility private'></div>
                <div className='note-data'>
                    <div className='note-date'>
                        <p>Last mod:</p>
                        <p>27/08/2025</p>
                        
                    </div>
                    <div className='note-buttons'>
                        <button>
                            <MdEdit className='note-btn button-edit '/>
                        </button>

                        <button>
                            <IoArrowRedoSharp className='note-btn button-share '/>
                        </button>

                        <button>
                            <MdDeleteForever className='note-btn button-delete'/>
                        </button>
                    </div>
                </div>
            </div>

        </section>
    )
}