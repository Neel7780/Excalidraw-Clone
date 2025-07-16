"use client"
import axios from "axios";
import { useRef } from "react"
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function SignIn () {
    const password_ref = useRef(null);
    const email_ref = useRef(null);
    const router = useRouter();
    async function buttonClick() {
      const response = await axios.post(`${BACKEND_URL}/signin`, {
        password : password_ref.current?.value,
        email : email_ref.current?.value
      })  
      localStorage.setItem("token", response.data.token)
      router.push("/")
    }
    return (
        <div>
            SIGNIN PAGE
            <input type="text" placeholder="password" ref={password_ref}/>
            <input type="text" placeholder="email" ref={email_ref}/>
            <button onClick={buttonClick}>Submit</button>
        </div>
    )
}