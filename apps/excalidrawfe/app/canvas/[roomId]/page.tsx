"use client"

import { drawInit } from "@/draw";  // All drawing logic goes here
import { useEffect, useRef } from "react"

export default function canvas () {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current
            drawInit(canvas)
        }
    }, [canvasRef])

    return <div>
        <canvas ref={canvasRef} width={2000} height={2000}></canvas>
    </div>
}