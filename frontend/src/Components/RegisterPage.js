import React from "react";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    //setting states for form
    const [username,setUsername] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [email,setEmail] = React.useState('');
    
    //user object
    const userObj = {
        username: username,
        password: password,
        email: email
    };

    const navigate =  useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://localhost:8080/user/signup', ({
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        }))
        .then(res => {
            if (res.status === 201) {
                alert('Redirecting You back to login screen');
                navigate('/');
            } else {
                alert('Something went wrong');
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <section id="Register" className="relative items-center flex flex-col justify-center py-48 h-screen">
            <div className="container py-16 px-10 flex flex-col w-5/6 sm:w-96 md:w-96 lg:w-96 bg-pink-50 opacity-75 border-gray-500 border-4 items-center justify-center">
                <h1 className="text-center font-extrabold text-lg">
                    Register
                </h1>
                <form onSubmit={handleSubmit} className="lg:w-5/6 md:w-5/6 sm:w-5/6 h-4/5 flex flex-col w-full text-lg font-bold">
                    <label>
                        Username:        
                    </label>
                    <input type="text" placeholder="username" className="border-2 px-1 border-gray-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                    <label className="pt-2">
                        Password:
                    </label>
                        <input type="password" placeholder="password" className="border-2 px-1 border-gray-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    <label className="pt-2">
                        Email:
                    </label>
                    <input type="email" placeholder="email" className="border-2 px-1 border-gray-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />

                    <div className="flex flex-row justify-between w-full pt-8">
                        <button onClick={e=> navigate('/')} className="text-center text-blue-50 font-extrabold py-3 bg-gradient-to-r from-fuchsia-400 to-pink-400 hover:bg-gradient-to-r hover:from-pink-400 hover:to-fuchsia-500 hover:text-white rounded text-lg w-1/2 mr-1 sm:mr-2 md:mr-2 lg:mr-4">
                            Back
                        </button>
                        <button type="submit" value="Register" className="sm:ml-4 text-center text-blue-50 font-extrabold py-3 bg-gradient-to-r from-fuchsia-400 to-pink-400 hover:bg-gradient-to-r hover:from-pink-400 hover:to-fuchsia-500 hover:text-white rounded text-lg w-1/2">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}