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
                    //Store id, username, and JWT in cookie
                    const id = data.id;
                    const username = data.username;
                    const token = data.accessToken; 
                    onLogin({id, username, token});
                })
            } else {
                alert('username or password is incorrect');
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <section id="login" className="relative items-center flex flex-col justify-center py-48">
            <div className="container max-w-md py-20 mx-auto flex flex-col sm:flex-nowrap bg-pink-50 opacity-75 md:border-gray-500 md:border-4 lg:border-gray-500 lg:border-4">
                <h1 className="text-center font-extrabold text-lg">
                    Welcome
                </h1>
                <form onSubmit={handleSubmit} className="lg:w-1/2 md:w-1/2 lg:h-4/5 flex flex-col md:mx-auto w-full md:py-4 text-lg font-bold">
                    <label className="leading-7">
                        Username:
                    </label>
                    <input type="text" placeholder="username" className="border-2 px-1 border-gray-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}>
                        
                    </input>
                    <label className="leading-7 pt-1">
                        Password:
                    </label>
                    <input type="password" placeholder="password" className="border-2 px-1 border-gray-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                    </input>
                    <div className="flex justify-between sm:justify-center w-full pt-4">
                        <button type="submit" value="Login" className="text-center text-blue-50 font-extrabold py-3 bg-gradient-to-r from-fuchsia-400 to-pink-400 hover:bg-gradient-to-r hover:from-pink-400 hover:to-fuchsia-500 hover:text-white rounded text-lg w-1/2">
                            Login
                        </button>
                        <button className="sm:ml-4 text-center text-blue-50 font-extrabold bg-gradient-to-r from-fuchsia-400 to-pink-400 border-0 py-3 hover:bg-gradient-to-r hover:from-pink-400 hover:to-fuchsia-500 hover:text-white rounded text-lg w-1/2" 
                            onClick={e=> navigate('/RegisterPage')}>
                            Register
                        </button>
                    </div>
                </form>             
            </div>
        </section>
    );
}