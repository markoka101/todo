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
        <section id="Register" className="relative flex flex-col justify-center py-8">
            <div className="container max-w-md py-20 mx-auto flex flex-col sm:flex-nowrap bg-pink-50 opacity-75 border-gray-500 border-4">
                <h1 className="text-center font-extrabold text-lg">
                    Register
                </h1>
                <form onSubmit={handleSubmit} className="lg:w-1/2 md:w-1/2 lg:h-4/5 flex flex-col md:mx-auto w-full md:py-4 text-lg font-bold">
                    <label>
                        Username:        
                    </label>
                    <input type="text" placeholder="username" className="border-2 px-1 border-gray-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                    <label>
                        Password:
                    </label>
                        <input type="password" placeholder="password" className="border-2 px-1 border-gray-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    <label>
                        Email:
                    </label>
                    <input type="email" placeholder="email" className="border-2 px-1 border-gray-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />

                    <div className="flex justify-between sm:justify-center w-full pt-3">
                        <button onClick={e=> navigate('/')} className="text-center text-blue-900 font-extrabold py-3 bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-lg w-1/2">
                            Back
                        </button>
                        <button type="submit" value="Register" className="sm:ml-4 text-center text-blue-900 font-extrabold py-3 bg-pink-300 hover:bg-gradient-to-r from-pink-400 to-fuchsia-500 hover:text-white rounded text-lg w-1/2">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}