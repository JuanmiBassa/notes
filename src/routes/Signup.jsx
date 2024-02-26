import '../styles/session.css'
import { useState } from 'react'
import { Link } from "react-router-dom"

export default function Signup() {
    const [responseOk, setResponseOk] = useState(null);
    const [responseBad, setResponseBad] = useState(null);

    const actionRegister = async (event) => {
        event.preventDefault();

        setResponseOk(null);
        setResponseBad(null);
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const dataUser = {
            username: username,
            password: password,
        };

        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataUser)
            };
            const res = await fetch(`http://localhost:8080/signup`, requestOptions);

            if (res.status === 200) {
                setResponseOk('User registration successful.');
            } else if (res.status === 401) {
                setResponseBad('Unauthorized.');
            } else if (res.status === 409) {
                setResponseBad('User with the given username already exists.');
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

    return (
        <section className="session-section">

            <form onSubmit={(event) => actionRegister(event)} method='POST' className="session-form">
                <h1>Register</h1>

                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder='Your username...' required />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Your password...' required />
                </div>

                <div className='center-content'>
                    <button type='submit' className='submit-button'>REGISTER</button>
                </div>

                <div className='center-content'>
                    <p className='session-text'>Do you already have an account?
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>

                {responseOk && <p className='response-ok'>{responseOk}</p>}
                {responseBad && <p className='response-bad'>{responseBad}</p>}
            </form>

        </section>
    )
}