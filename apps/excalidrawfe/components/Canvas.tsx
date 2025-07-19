"use client"

import { drawInit } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Circle, Icons, Pencil, Rect } from "./IconButton'";

export type Tool = "circle" | "rect" | "pencil";

export default function Canvas({roomId, socket} : {roomId : string, socket : WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(()=>{
        // @ts-ignore
        window.selectedTool = selectedTool  //storing it in a global variable is not a good practice, improve it!!
    },[selectedTool])

    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current
            drawInit(canvas, roomId, socket)
        }
    }, [canvasRef])

    return <div className="block overflow-hidden h-screen w-screen">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
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
            </div>
        </div>
    )
}