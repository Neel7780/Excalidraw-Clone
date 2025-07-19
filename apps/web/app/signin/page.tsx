"use client"
import axios from "axios";
import { useRef } from "react"
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function SignIn () {
    const password_ref = useRef<HTMLInputElement>(null);
    const email_ref = useRef<HTMLInputElement>(null);
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
        <div className="h-screen w-screen bg-black flex flex-col justify-center items-center text-4xl">
            <div className="text-white">SIGNIN PAGE</div>
            <input className="bg-white mt-8 rounded-2xl p-4 text-xl" type="text" placeholder="Email" ref={email_ref}/>
            <input className="bg-white mt-8 rounded-2xl p-4 text-xl" type="text" placeholder="Password" ref={password_ref}/>
            <button className="bg-white mt-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={buttonClick}>Submit</button>
        </div>
    )
}