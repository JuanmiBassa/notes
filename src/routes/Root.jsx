import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";

export default function Root() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);

        const expiration = localStorage.getItem('expiration');
        if (expiration) {
            const expirationDate = new Date(expiration);
            const currentDate = new Date();

            if (currentDate >= expirationDate) {
                localStorage.removeItem('username');
                localStorage.removeItem('token');
                localStorage.removeItem('expiration');
            }
        }
    }, [location]);

    return (
        <>
            <header>
                <div>
                    <Link to="/" id="logo"><FaRegNoteSticky />Notes</Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/notes" id="notes-button">Notes</Link>
                        </li>
                        {token == null ? (
                            <>
                                <li>
                                    <Link to="/signup" id="signUp-button" className="nav-button">Sign-up</Link>
                                </li>
                                <li>
                                    <Link to="/login" id="signIn-button" className="nav-button">Sign-in</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li id="dashboard-container">
                                    <Link to="/dashboard" id="dashboard-button" className="nav-button">Dashboard <FaUserCircle className="user-icon"/></Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    )
}