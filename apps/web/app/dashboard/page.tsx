"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const router = useRouter();
  return (
    <div className={"h-screen w-screen"}>
      <div className="flex justify-center items-center">
        <input type="text" placeholder="Enter room name" onChange={(e) => {
          setRoomId(e.target.value)
        }} className="p-2 border rounded-lg"/>
        <button className="m-2" onClick={() => {
          router.push(`/room/${roomId}`)
        }}>Submit</button>
      </div>
    </div>
  );
}
