import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port : 8080 })

wss.on("connection", (socket) => {
    console.log("User connected!")
    socket.on("message", (e) => {
        socket.send("pong")
    })
})