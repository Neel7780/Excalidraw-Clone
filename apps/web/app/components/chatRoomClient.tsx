"use client"
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useRouter } from "next/navigation";

export function ChatRoomClient ({
    messages,
    id
}: {
    messages: {message: string}[];
    id: string
}) {
    const router = useRouter()
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const {socket, loading} = useSocket();
    useEffect(() => {  //unclear - why are we wrapping it inside a useEffect
        if (socket && !loading) {

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChats(c => [...c, {message: parsedData.message}])
                }
            }
        }
    }, [socket, loading, id])

    return <div className="h-screen w-screen bg-black flex flex-col justify-center items-center">
        {chats.map((m, idx) => <div className="bg-white m-2 rounded-2xl text-xl p-4" key={idx}>{m.message}</div>)}

        <input className="bg-white mt-8 rounded-2xl p-4 text-xl" type="text" value={currentMessage} onChange={e => {
            setCurrentMessage(e.target.value);
        }}></input>
        <button className="bg-white m-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage
            }))

            setCurrentMessage("");
        }}>Send message</button>
        <button className="bg-white m-8 rounded-2xl p-4 text-xl cursor-pointer" onClick={() => {
            router.push("/")
        }}>Go back</button>
    </div>
}