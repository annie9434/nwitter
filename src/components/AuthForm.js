import React, { useState }  from "react";
import {authService} from "fbase"
import { createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onSubmit = async(event) => {
        event.preventDefault();
        let data;
        try{
            if(newAccount){
                // create account
                data = await createUserWithEmailAndPassword(
                    authService,
                    email,
                    password
                  );
            } else{
                //log in
                data = await signInWithEmailAndPassword(
                    authService,
                    email,
                    password
                  );
            }
            console.log(data);
        }catch(error){
            setError(error.message);
        }
    }

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if (name === "password"){
            setPassword(value);
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input className="authInput" name ="email" type="text" placeholder="Email" required value={email} onChange={onChange}/>
                <input className="authInput" name ="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input className="authInput authSubmit" type="submit" value={newAccount ? "Create Account" : "Log In"}/>
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">{newAccount ? "Sign in" : "Create Account"}</span>
        </>
    )
}

export default AuthForm;