"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const router = useRouter();
  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center text-4xl">
      <div className="">
        <input type="text" placeholder="Enter Canvas Room name" onChange={(e) => {
          setRoomId(e.target.value)
        }} className="bg-white mt-8 rounded-2xl p-4 text-xl"/>
        <button className="bg-white m-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={() => {
          router.push(`/canvas/${roomId}`)
        }}>Submit</button>
      </div>
    </div>
  );
}
