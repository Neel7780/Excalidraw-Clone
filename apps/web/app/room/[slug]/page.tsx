import axios from "axios"
import { BACKEND_URL } from "../../config"
import { ChatRoom } from "../../components/ChatRoom"

async function slugtoId (slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return response.data.room.id
}

export default async function Page({ params }: { params: { slug: string } }) {
    const roomId = await slugtoId((await params).slug);
    return (
        <div>
            <ChatRoom roomId={roomId} />
        </div>
    );
}