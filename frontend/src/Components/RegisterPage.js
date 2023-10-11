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
                <label>
                    Email:
                    <input type="email" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </label>
                <input type="submit" value="Submit"/>
            </form>
            <button onClick={e=> navigate('/')}>Back</button>
        </div>
    );
}