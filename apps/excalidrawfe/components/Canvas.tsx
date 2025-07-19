"use client"

import { drawInit } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Circle, Icons, Line, Pencil, Rect, Text } from "./IconButton'";

export type Tool = "circle" | "rect" | "pencil" | "line" | "text";

export default function Canvas({roomId, socket} : {roomId : string, socket : WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");
    const [textInput, setTextInput] = useState<{x: number, y: number, visible: boolean}>({x: 0, y: 0, visible: false});
    const [textValue, setTextValue] = useState('');

    useEffect(()=> {
        // @ts-ignore
        window.selectedTool = selectedTool
    },[selectedTool])

    const handlePlaceText = (x: number, y: number) => {
        setTextInput({ x, y, visible: true });
    };

    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current
            // @ts-ignore
            drawInit(canvas, roomId, socket, handlePlaceText)
        }
    }, [canvasRef, roomId, socket])

    const handleTextSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && textValue.trim() !== '') {
            const shape = {
                type: "text",
                startX: textInput.x,
                startY: textInput.y,
                text: textValue
            };

            const messageToSend = JSON.stringify({
                type: "shape",
                shape,
                roomId
            });
            console.log("Sending shape message:", messageToSend);
            socket.send(messageToSend);

            setTextValue('');
            setTextInput({ ...textInput, visible: false });
        }
    };

    return <div className="block overflow-hidden h-screen w-screen">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        {selectedTool === "text" && textInput.visible && (
            <input
                type="text"
                style={{ position: 'absolute', top: textInput.y, left: textInput.x, zIndex: 100}}
                className="text-white"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={handleTextSubmit}
                onBlur={() => {
                    setTextValue('');
                    setTextInput({ ...textInput, visible: false });
                }}
                autoFocus
            />
        )}
    </div>
}

function Topbar ({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
        <div className="fixed top-10 left-10 flex justify-between">
            <div className="flex gap-4">
                <Icons icon = {<Pencil />} selected={selectedTool==="pencil"} onClick={() => {setSelectedTool("pencil")}} />
                <Icons icon = {<Rect />} selected={selectedTool==="rect"} onClick={() => {setSelectedTool("rect")}} />
                <Icons icon = {<Circle />} selected={selectedTool==="circle"} onClick={() => {setSelectedTool("circle")}} />
                <Icons icon = {<Line />} selected={selectedTool==="line"} onClick={() => {setSelectedTool("line")}} />
                <Icons icon = {<Text />} selected={selectedTool==="text"} onClick={() => {setSelectedTool("text")}} />
            </div>
        </div>
    )
}