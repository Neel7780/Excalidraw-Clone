import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port : 8080 })
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"

wss.on("connection", (socket, request) => {
    console.log("User connected!")
    const url = request.url;  // Gating the ws connection!
    if(!url) {
        socket.send("url not found")
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const decoded = jwt.verify(token, JWT_SECRET)

    if(typeof decoded == "string"){
        socket.close();
        return;
    }

    if(!decoded ||  !decoded.userId) {
        socket.close();
        return;
    }

    socket.on("message", (e) => {
        socket.send("pong")
    })
})