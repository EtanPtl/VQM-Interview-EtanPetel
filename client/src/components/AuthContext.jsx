import { useNavigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    user: null,
    setUser: () => {}
});

const UserContext = ({ children }) => {
    // Create a useState to change state of user as user logs in or logs out, make default null since they start not logged in
    const [user, setUser] = useState({ loggedIn: null });
    const navigate = useNavigate();

    useEffect(() => {
        // use fetch to communicate to backend at address
        fetch("http://localhost:3000/auth/LogIn", {
            credentials: "include",
        })
        .catch(err => {
            // if there is an error, set user state to false for loggedIn
            setUser({loggedIn: false});
            return;
        })
        .then(r => {
            if (!r || !r.ok || r.status >= 400){
                // Didnt work, set user loggedIn status to false
                setUser({loggedIn: false});
                return;
            }
            return r.json();
        })
        .then(data => {
            if(!data) {
                setUser({ loggedIn: false });
                return;
            }
            // Success, log in the user
            console.log(data);
            setUser({...data});
            navigate("/")

        })
    }, []);

    return(
        <AuthContext.Provider value={{user, setUser}}> 
            {children}
        </AuthContext.Provider>
    );
};

export default UserContext;