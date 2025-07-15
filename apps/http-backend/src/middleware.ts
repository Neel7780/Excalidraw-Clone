import { JWT_SECRET } from "@repo/backend-common/config";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export function middleware(req:Request, res:Response, next:NextFunction) {
    const token = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(token, JWT_SECRET);
    if(decoded){
        // pass what was used for signing jwt token username/ userId
        next();
    } else {
        res.status(403).json({
            message : "Unauthorized"
        })
    }
}