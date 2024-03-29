import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { Cookies, CookiesProvider, useCookies } from "react-cookie";

//import pages
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage"
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";

export default function App() {

    const [cookies, setCookie] = useCookies(["user"]);

    function handleLogin(user) {
        setCookie('user', user, { path: '/'}, {expires: 3600});
    }

    return (
        <main className="bg-gradient-to-r from-fuchsia-300 from-20% via-purple-300 via-40% to-violet-300 to-85% min-h-screen max-h-screen max-w-screen overflow-y-auto overflow-x-hidden scrollbar">
            <CookiesProvider>
                {cookies.user ? (
                    <>
                    <Navbar user = {cookies.user}/>
                    <Home user = {cookies.user} />
                    </>
                ) : (
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LoginPage onLogin={handleLogin}/>}  />
                            <Route path="/RegisterPage" element={<RegisterPage />}/>
                        </Routes>
                    </BrowserRouter>
                )}
            </CookiesProvider>
        </main>
    )
}