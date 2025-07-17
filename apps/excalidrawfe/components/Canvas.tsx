"use client"

import { drawInit } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas({roomId, socket} : {roomId : string, socket : WebSocket}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
        
    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current
            drawInit(canvas, roomId, socket)
        }
    }, [canvasRef])

    return <div>
        <canvas ref={canvasRef} width={2000} height={2000}></canvas>
    </div>
}