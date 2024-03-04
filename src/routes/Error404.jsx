import { Link, useLocation } from "react-router-dom"


export default function Error404() {
    const location = useLocation();
    const errorCode = location.state?.code || "404";
    const errorMessage = location.state?.message || "Page not found";

    return (
        <>
            <section id="error-section">
                <h1>{errorCode}</h1>
                <p>{errorMessage}</p>
                <Link to="/notes">Return to main page</Link>
            </section>
        </>
    )
}