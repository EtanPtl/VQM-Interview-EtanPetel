import React from 'react';
import { io } from "socket.io-client";
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
const socket = io('ws://localhost:3000');

const Queue = () => {
    const { user } = useContext(AuthContext);
    socket.on('message', (data) => {
        console.log(data);
        const h2 = document.querySelector('h2');
        h2.textContent = data;
    })

    const HandleClick = (e) => {
        e.preventDefault();
        socket.emit('message', user.username)
        fetch("http://localhost:3000/queue", {
            method: "POST",
            credentials: 'include'
        });
         
    };
    

    return (
    <div className='relative flex h-[100vh] flex-col items-center justify-center'>
       
        <button onClick={HandleClick} className=' position: absolute font-bold justify-center text-white text-5xl bg-black rounded-3xl px-4 py-2 cursor-pointer'> 
            Join The Queue
        </button>
        <h2 className='mb-5'> 
        </h2>
    </div>
    )
}

export default Queue
