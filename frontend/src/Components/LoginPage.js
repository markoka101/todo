import React from "react";
import {useNavigate } from "react-router-dom";

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
        <section id="login" className="relative items-center justify-center py-48">
            <div className="container max-w-md py-20 mx-auto flex sm:flex-nowrap bg-white opacity-70 border-gray-400 border-4">
                <form onSubmit={handleSubmit} className="lg:w-1/3 md:w-1/2 lg:h-4/5 flex flex-col md:mx-auto w-full md:py-4">
                    <label className="">
                        Username:
                        <input className="bg-white opacity-50 border-black border-1" type="text" placeholder="username" value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                    </label>
                    <label>
                        Password:
                        <input type="password" placeholder="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <div>
                        <input type="submit" value="Login"/>
                        <button onClick={e=> navigate('/RegisterPage')}>Register</button>
                    </div>
                </form>             
            </div>
        </section>
    );
}