"use client"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState, useEffect, useRef } from "react";
import CreateRoomModal from "@/components/CreateRoomModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function slugtoId (slug: string) {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
        return response.data.room.id
    }

  useEffect(() => {
    async function fetchRooms() {
      const response = await axios.get(`${BACKEND_URL}/room`);
      setRooms(response.data.rooms);
    }
    fetchRooms();
  }, []);

  async function enterRoomSubmit () {
    const slug = inputRef.current?.value;
    if (!slug) {
      return;
    }
    const roomId = await slugtoId(slug);
    router.push(`/canvas/${roomId}`);
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center text-4xl gap-3">
      <div>
        <input ref={inputRef} type="text" placeholder="Enter Canvas Room name" className="bg-white mt-8 rounded-2xl p-4 text-xl"/>
        <button className="bg-white m-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={enterRoomSubmit}>Submit</button>
      </div>
      <div className="mt-12 text-white">
        <div>Available Rooms:</div>
        <ul>
          {rooms.map((room: any) => (
            <div key={room.id} className="text-white text-2xl m-3 flex items-center">{room.id} ) {room.slug}</div>
          ))}
        </ul>
      </div>
      <div>
        <button
          className="bg-white m-8 rounded-2xl p-4 text-xl cursor-pointer"
          onClick={() => setShowModal((p) => !p)}
        >
          Create new room
        </button>
      </div>
      <div>
        {showModal && <CreateRoomModal />}
      </div>
    </div>
  );
}
