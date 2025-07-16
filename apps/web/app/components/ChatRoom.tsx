import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChatRoomClient } from "./chatRoomClient";

async function getChats(roomId:string) {
    const messages = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    return messages.data.messages
}

export async function ChatRoom ({roomId} : {
    roomId : string
}) {
    const messages = await getChats(roomId);
    // got my messages and enable me to start chatting, rendering happens on client side
    return <ChatRoomClient id={roomId} messages={messages} />
}