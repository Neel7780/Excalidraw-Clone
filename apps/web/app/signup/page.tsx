"use client"
import axios from "axios";
import { useRef } from "react"
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const username_ref = useRef(null);
    const password_ref = useRef(null);
    const email_ref = useRef(null);
    const router = useRouter();

    async function buttonClick() {
        const response = await axios.post(`${BACKEND_URL}/signup`, {
            username: username_ref.current?.value,
            password: password_ref.current?.value,
            email: email_ref.current?.value
        });
        router.push("/signin");
    }

    return (
        <div className="h-screen w-screen bg-black flex flex-col justify-center items-center text-4xl">
            <div className="text-white">SIGNUP PAGE</div>
            <input className="bg-white mt-8 rounded-2xl p-4 text-xl" type="text" placeholder="username" ref={username_ref} />
            <input className="bg-white mt-8 rounded-2xl p-4 text-xl" type="text" placeholder="password" ref={password_ref} />
            <input className="bg-white mt-8 rounded-2xl p-4 text-xl" type="text" placeholder="email" ref={email_ref} />
            <button className="bg-white mt-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={buttonClick}>Submit</button>
        </div>
    );
}