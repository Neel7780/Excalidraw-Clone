import { ReactNode } from "react";

export function Icons({ icon, onClick, selected }: { icon: ReactNode, onClick: () => void, selected : boolean }) {
    return <div className={`rounded-full ${selected ? "text-red-600" : "text-black"} p-2 size-8 bg-white hover:bg-gray-500`} onClick={onClick}>
        {icon}
    </div>
}

export function Pencil () {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
        </svg>
    )
}

export function Rect () {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#FFF" stroke="#000" strokeWidth="2" d="M4 4h16v16H4z"></path></svg>
    )
}

export function Circle () {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#FFF" stroke="#000" strokeWidth="2"></circle></svg>
    )
}

export function Line () {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2" />
        </svg>
    )
}

export function Text () {
    return (
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6.2V5h11v1.2M8 5v14m-3 0h6m2-6.8V11h8v1.2M17 11v8m-1.5 0h3"/>
        </svg>
    )
}