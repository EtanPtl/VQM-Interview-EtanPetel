import React, { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import SignUp from "./SignUp";
import Queue from "./Queue";

const Home = () => {
    // get the user from context to route appropriately
    const { user } = useContext(AuthContext);
    if (user === null || user.loggedIn === null){
        console.log(user)
        return (<div>Loading...</div>)
    } else if (user.loggedIn == false) {
        return (<SignUp/>)
    } else {
        return (<Queue/>)
    }
 
}

export default Home;
