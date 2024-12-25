import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

export default function NavBar() {
    // State to track the login status
    const [loginCheck, setLoginCheck] = useState(false);

    // Function to check if the user is logged in using auth.loggedIn() method
    const checkLogin = () => {
    if (auth.loggedIn()) {
        setLoginCheck(true);  // Set loginCheck to true if user is logged in
    }
    };

    // useEffect hook to run checkLogin() on component mount and when loginCheck state changes
    useEffect(() => {
    checkLogin();  // Call checkLogin() function to update loginCheck state
    }, [loginCheck]);  // Dependency array ensures useEffect runs when loginCheck changes

    return (
        <>
        <nav>
            <Link to="/">
                <img className="logo" src="/img/PixelOracle.png" alt="PixelOracle"></img>
            </Link>
            {
                // Conditional rendering based on loginCheck state
                !loginCheck ? (
                // Render login button if user is not logged in
                <Link to='/Login'>
                <button className="btn" id="loginButton" type='button'>LOGIN</button>
                </Link>
                ) : (
                // Render logout button if user is logged in
                <button className="btn" id="logoutButton" type='button' onClick={() => {
                    auth.logout();  // Call logout() method from auth utility on button click
                }}>LOGOUT</button>
                )
            }
        </nav>
        </>
    )
}
