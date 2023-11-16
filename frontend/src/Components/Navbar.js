import { ArrowRightIcon } from "@heroicons/react/solid";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cookies, useCookies } from "react-cookie";

export default function Navbar({user}) {

    const [cookies, setCookie, removeCookie] = useCookies();
    return (
        <header className="bg-gradient-to-r from-slate-500 to-slate-700 sticky top-0 z-10 w-full flex">
            <div className="container mx-16 flex flex-row py-3 px-2 justify-between">
                <h1 className="text-white font-bold text-xl w-1/2">
                    {user.username}
                </h1>
                <button className="text-white font-bold text-xl"
                    onClick={(e)=> removeCookie('user')}>Sign Out</button>
            </div>
            
        </header>
    );
}