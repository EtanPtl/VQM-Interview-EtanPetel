"use client";
import React from "react";
import { useState, useContext } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupFormDemo() {

  const [error, setError] = useState(null); 
  const { setUser }  = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Get data from form 
    const formData = new FormData(e.target);
    const vals = Object.fromEntries(formData);

    // On submit we will fetch to send info to backend to sign up
    fetch("http://localhost:3000/auth/SignUp", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "Application/json"},
        body: JSON.stringify(vals)
    })
    .catch(err => {
        return;
    })
    .then(res => {
        if (!res || !res.ok || res.status >= 400) {
            return;
        }
        return res.json();
    })
    .then(data => {
        if (!data) return;
        setUser({...data});
        if (data.status) {
            setError(data.status);
        } else if (data.loggedIn){
            navigate("/Queue")
        }
        
    })
    console.log("Form submitted");
  };


  return (
    <div
      className=" mt-30 shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to QueueApp
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
       Sign Up
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
    
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">UserName</Label>
          <Input id="username" placeholder="Username" type="text" name="username"/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" name="password" />
        </LabelInputContainer>
       

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>

       
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span
        className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span
        className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
