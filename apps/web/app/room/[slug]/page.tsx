import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../components/ChatRoom";

async function slugtoId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response.data.room.id;
}

// 1. Update the type: params is now a Promise
interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// 2. Standard async function export
export default async function Page({ params }: PageProps) {
    // 3. Await the params before accessing slug
    const { slug } = await params; 
    
    const roomId = await slugtoId(slug);

    return (
        <div>
            <ChatRoom roomId={roomId} />
        </div>
    );
}