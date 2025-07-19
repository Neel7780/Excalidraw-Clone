"use client"
import { BACKEND_URL } from "@/app/config"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export default function CreateRoomModal() {
    const inputRef = useRef(null)
    const router = useRouter()

    async function slugtoId (slug: string) {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
        return response.data.room.id
    }

    async function submitButtonClick() {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BACKEND_URL}/room`,
          { name: inputRef.current?.value },
          {
            headers: {
              Authorization: token
            },
          }
        );
        const roomId = slugtoId(inputRef.current?.value)
        router.push(`/canvas/${roomId}`)
    }

    return (
            <div>
                <input type="text" className="bg-white mt-8 rounded-2xl p-4 text-xl" ref={inputRef} placeholder="Enter New Room Name" />
                <button className="bg-white m-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={submitButtonClick}>Create Room</button>
            </div>
        
    )
}