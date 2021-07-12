import { useState } from 'react';
import router from 'next/router';


export default function Form() {

    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const usr = event.target[0].value;
        const pwd = event.target[1].value;
        if (usr !== 'john' || pwd !== '123456') {
            setError("Wrong username or password!");
        } else {
            router.push('/dash');
        }
    }

    return (
        <div className="form-style">
            <form onSubmit={handleSubmit} className="form">
                <h1>error system</h1>
                {error && <h2 style={{ color: "red" }}>{error}</h2>}
                <div className="username-field">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        pattern="^[a-zA-Z\-]+$"
                        onInvalid={(event) => {
                            if (event.target.validity.patternMismatch) {
                                event.target.setCustomValidity("Username must be written with letters");
                            } else {
                                event.target.setCustomValidity("Insert username!");
                            }
                        }}
                        onInput={(event) => event.target.setCustomValidity("")}
                        onChange={() => setError('')}
                        required />
                </div>
                <div className="password-field">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        minLength="6"
                        onInvalid={(event) => {
                            if (event.target.validity.tooShort) {
                                event.target.setCustomValidity("Password must be 6 characters or more!");
                            } else {
                                event.target.setCustomValidity("Insert password!")
                            }
                        }}
                        onInput={(event) => event.target.setCustomValidity("")}
                        onChange={() => setError('')}
                        required />
                </div>
                <div className="button-field">
                    <input id="button" type="submit" value="LOGIN" />
                    <a href="#">or create new account</a>
                </div>
            </form>
        </div>
    );
}