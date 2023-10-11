import React from "react";
import {Link, useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {

    //setting states for form
    const [username,setUsername] = React.useState('');
    const [password,setPassword] = React.useState('');

    //user object
    const userObj = {
        username: username,
        password: password
    };

    //create navigate variable
    const navigate = useNavigate();

    //pass the user object to the server
    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://localhost:8080/user/login', ({
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        }))
        .then(res => {
            if (res.status === 202) {
                res.json()
                .then(data => {
                    //Store id and JWT in cookie
                    const id = data.id;
                    const token = data.accessToken; 
                    onLogin({id, token});
                })
            } else {
                alert('username or password is incorrect');
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" placeholder="username" value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
                </label>
                <label>
                    Password:
                    <input type="password" placeholder="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <input type="submit" value="Login"/>
            </form>
            <button onClick={e=> navigate('/RegisterPage')}>Register</button>
        </div>

    );
}