import '../styles/session.css'
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
    const [responseBad, setResponseBad] = useState(null);
    const navigate = useNavigate();

    const actionLogin = async (event) => {
        event.preventDefault();

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
            const res = await fetch(`http://localhost:8080/login`, requestOptions);

            if (res.status === 200) {
                const responseData = await res.json();
                localStorage.setItem('username', username);
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('expiration', responseData.expiration);
                navigate('/');
            } else if (res.status === 401) {
                setResponseBad('Unauthorized.');
            } else {
                setResponseBad('Unexpected error occurred.');
            }

            setInterval(() => {
                setResponseBad(null);
            }, 5000);

        } catch (error) {
            console.error('Error when making request: ', error);
        }
    };

    return (
        <section className="session-section">

            <form onSubmit={(event) => actionLogin(event)} method='POST' className="session-form">
                <h1>Login</h1>

                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder='Your username...' required />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Your password...' required />
                </div>

                <div className='center-content'>
                    <button type='submit' className='submit-button'>LOGIN</button>
                </div>

                <div className='center-content'>
                    <p className='session-text'>You do not have an account?
                        <Link to="/signup">Sign up</Link>
                    </p>
                </div>

                {responseBad && <p className='response-bad'>{responseBad}</p>}
            </form>

        </section>
    )
}