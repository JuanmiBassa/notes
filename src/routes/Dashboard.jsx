import '../styles/session.css'
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
    const [responseOk, setResponseOk] = useState(null)
    const [responseBad, setResponseBad] = useState(null)
    const [username, setName] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        setName(username);
    }, []);

    const actionPassword = async (event) => {
        event.preventDefault();

        setResponseOk(null);
        setResponseBad(null);
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        const dataUser = {
            oldPassword: oldPassword,
            newPassword: newPassword,
        };

        try {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataUser)
            };
            const res = await fetch(`http://localhost:8080/changepassword`, requestOptions);

            if (res.status === 200) {
                const responseData = await res.text();
                setResponseOk('Password changed successfully.');
            } else if (res.status === 401) {
                setResponseBad('Unauthorized.');
            } else {
                setResponseBad('Unexpected error occurred.');
            }

            setInterval(() => {
                setResponseOk(null);
                setResponseBad(null);
            }, 5000);

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    function logOut() {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        navigate('/login');
    }

    return (
        <section className="session-section">

            <form onSubmit={(event) => actionPassword(event)} method='POST' className="session-form">
                <h1 id='dashboard-name'>Hi, {username}!</h1>

                <div>
                    <label htmlFor="oldPassword">Old password</label>
                    <input type="password" name="oldPassword" id="oldPassword" placeholder='Your old password...' required />
                </div>

                <div>
                    <label htmlFor="newPassword">New password</label>
                    <input type="password" name="newPassword" id="newPassword" placeholder='Your new password...' required />
                </div>

                <div id='actionUser-container' className='center-content'>
                    <button type='button' id='logout-button'
                        onClick={() => logOut()}>LOG OUT</button>
                    <button type='submit' className='submit-button'>UPDATE</button>
                </div>

                {responseOk && <p className='response-ok'>{responseOk}</p>}
                {responseBad && <p className='response-bad'>{responseBad}</p>}
        
        
            </form>

        </section>
    )
}