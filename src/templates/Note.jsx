import { MdDeleteForever, MdEdit } from "react-icons/md";
import { IoArrowRedoSharp } from "react-icons/io5";

export default function Note({ note }) {
    const title = note.title || "Default Title";

    return (
        <div className='note'>
                <div className='note-title'>
                    <p>{title}</p>
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
    )
}