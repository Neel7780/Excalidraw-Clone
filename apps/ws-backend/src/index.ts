import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port : 8080 })
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"

function checkUser(url:string) {
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const decoded = jwt.verify(token, JWT_SECRET)
    if(typeof decoded == "string" || !decoded ||  !decoded.userId){
        return null;
    }
    return decoded.userId;
}

interface User {
    ws : WebSocket
    userId : string,
    rooms : string[]
}

const users:User[] = []

wss.on("connection", (socket, request) => {
    console.log("User connected!")
    const url = request.url;  // Gating the ws connection!
    if(!url) {
        socket.send("url not found")
        return;
    }
    const userId = checkUser(url)
    users.push({
        userId : userId,
        rooms : [],
        ws : socket
    })

    socket.on("message", async (data) => {
        let parsedData;  
        if(typeof data !== "string"){
            parsedData = JSON.parse(data.toString()) // {type : "join_room", roomId : 1}
        } else {
            parsedData = JSON.parse(data)
        }
        if(parsedData.type === "join_room") {
            const user = users.find(x => x.ws === socket)
            user?.rooms.push(parsedData.roomId)
        }
        if(parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === socket)
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.room)
        }
        if(parsedData.type === "chat") {
            console.log("Received chat message:", parsedData);
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        message : message,
                        roomId : roomId
                    }))
                }
            })
            await prismaClient.chat.create({
                data: {
                    roomId: Number(roomId),
                    message,
                    userId
                }
            });
        } else if (parsedData.type === "shape") {
            console.log("Received shape message:", parsedData);
            const roomId = parsedData.roomId;
            const shape = parsedData.shape;
            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    console.log("Broadcasting shape to user in room:", roomId);
                    user.ws.send(JSON.stringify({
                        type: "shape",
                        shape : shape,
                        roomId : roomId
                    }))
                }
            })
            await prismaClient.chat.create({
                data: {
                    roomId: Number(roomId),
                    message: JSON.stringify({ shape }), // Store shape as a JSON string in the message field
                    userId
                }
            });
        }
    })
})