import axios from "axios"
import { BACKEND_URL } from "@/app/config";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "text";
    startX: number;
    startY: number;
    text : string
} | {
    type: "pencil";
    points: { x: number, y: number }[];
}

export async function drawInit (canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, handlePlaceText: (x: number, y: number) => void) {
    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId)

    if(!ctx) { return; }

    socket.onmessage = (event) => {
        console.log("Received WebSocket message:", event.data);
        const message = JSON.parse(event.data);

        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message)
            if (parsedShape.shape) {
                existingShapes.push(parsedShape.shape)
                console.log("Added chat shape:", parsedShape.shape);
                clearCanvas(existingShapes, canvas, ctx);
            }
        } else if (message.type === "shape") { 
            if (message.shape) {
                existingShapes.push(message.shape);
                console.log("Added shape:", message.shape);
                clearCanvas(existingShapes, canvas, ctx);
            }
        }
    }

    clearCanvas(existingShapes, canvas, ctx)
    
    let drawing = false;
    let startX = 0;
    let startY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let currentPencilStroke: { x: number, y: number }[] = [];


    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        startX = mouseX;
        startY = mouseY;
        
        // @ts-ignore
        if (window.selectedTool === 'pencil') {
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            currentPencilStroke = [{ x: mouseX, y: mouseY }];
        }
    })

    canvas.addEventListener("mouseup", (e) => {
        drawing = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        // @ts-ignore
        const selectedTool = window.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const absWidth = Math.abs(width);
            const absHeight = Math.abs(height);
            const radius = Math.max(absWidth, absHeight) / 2;
            const centerX = startX + (width < 0 ? -radius : radius);
            const centerY = startY + (height < 0 ? -radius : radius);
            shape = {
                type: "circle",
                radius: radius,
                centerX: centerX,
                centerY: centerY,
            }
        } else if (selectedTool === "line") {
            shape = {
                type: "line",
                startX,
                startY,
                endX: e.clientX,
                endY: e.clientY
            }
        } else if (selectedTool === "text") {
            handlePlaceText(e.clientX, e.clientY);
            return;
        } else if (selectedTool === "pencil") {
            if (currentPencilStroke.length > 0) {
                shape = {
                    type: "pencil",
                    points: currentPencilStroke
                }
            }
        }

        if (!shape) {
            return;
        }

        existingShapes.push(shape);

        if (selectedTool === 'pencil') {
            clearCanvas(existingShapes, canvas, ctx);
        }

        socket.send(JSON.stringify({
            type: "shape",
            shape,
            roomId
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if(!drawing) return;

        // @ts-ignore
        const selectedTool = window.selectedTool;

        if (selectedTool === 'pencil') {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            ctx.beginPath();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.moveTo(lastMouseX, lastMouseY);
            ctx.lineTo(mouseX, mouseY);
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.stroke();

            lastMouseX = mouseX;
            lastMouseY = mouseY;
            currentPencilStroke.push({ x: mouseX, y: mouseY });
        } else {
            const width = e.clientX - startX
            const height = e.clientY - startY
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            if (selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);   
            } else if (selectedTool === "circle") {
                const absWidth = Math.abs(width);
                const absHeight = Math.abs(height);
                const radius = Math.max(absWidth, absHeight) / 2;
                const centerX = startX + (width < 0 ? -radius : radius);
                const centerY = startY + (height < 0 ? -radius : radius);
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();                
            } else if (selectedTool === "line") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
            } else if (selectedTool === "text") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
            }
        }
    })
    
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    console.log("Clearing and redrawing canvas. Shapes to draw:", existingShapes);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape) => {
        if (!shape) return;
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } 
        else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();                
        } else if (shape.type === "line") {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
        } else if (shape.type === "text") {
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.fillText(shape.text, shape.startX, shape.startY);
        } else if (shape.type === "pencil") {
            if (shape.points && shape.points.length > 1) {
                ctx.beginPath();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.lineJoin = ctx.lineCap = 'round';
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
                ctx.stroke();
            }
        }
    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        try {
            const messageData = JSON.parse(x.message)
            return messageData.shape;
        } catch (e) {
            return null;
        }
    }).filter(Boolean);

    return shapes;
}