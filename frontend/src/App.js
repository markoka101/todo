import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { CookiesProvide, CookiesProvider, useCookies } from "react-cookie";

//import pages
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";

export default function App() {

    const [cookies, setCookie] = useCookies(["user"]);

    function handleLogin(user) {
        setCookie('user', user, { path: '/'});
    }

    return (
        <CookiesProvider>
            <div>
                {cookies.user ? (
                    <Home user = {cookies.user} />
                ) : (
                    <LoginPage onLogin={handleLogin} />
                )}
            </div>
        </CookiesProvider>
    )
}