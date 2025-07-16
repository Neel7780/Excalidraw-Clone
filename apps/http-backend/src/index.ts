import express from "express";
const app = express();
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateUserSchema, RoomSchema, SigninSchema } from "@repo/common/types"
import { middleware } from "./middleware";
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cors from "cors"
app.use(cors())

app.use(express.json())

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.json({
            message : "Invalid Inputs"
        })
        console.log(parsedData.error)
        return;
    }
    const hashedPwd = await bcrypt.hash(parsedData.data.password, 5)
    //add to db-call
    try {
        const user = await prismaClient.user.create({
            data : {
                email : parsedData.data?.email,
                name : parsedData.data?.username,
                password : hashedPwd
            }
        })
        res.json({
            userId: user.id
        })
    } catch {
        res.status(401).json({
            message : "Error signing up"
        })
    }
    
})

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success) {
        res.json({
            message : "Invalid Inputs"
        })
        return;
    } 
    // Search guy in db with username and check password using bcrypt module
    const user = await prismaClient.user.findFirst({
        where : {
            email : parsedData.data?.email
        }
    })
    if(!user) {
        res.json({
            message : "Cant find user with this email"
        })
        return;
    }
    const checkPwd = bcrypt.compare(parsedData.data.password, user.password)
    if(!checkPwd) {
        res.json({
            message : "Incorrect Password!"
        })
        return;
    }
    // Return jwt token
    const token = jwt.sign({
        userId : user.id
    }, JWT_SECRET)
    res.json({
        token
    })
})

app.post("/room", middleware, async (req, res) => {
    const parsedData = RoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
        message: "Incorrect Inputs",
        });
        return;
    }
    //@ts-ignore
    const userId = req.userId
    try {
        const room = await prismaClient.room.create({
            data : {
                slug : parsedData.data?.name,
                adminId : userId
            }
        })
        res.json({
            roomId : room.id
        })
    } catch {
        res.status(411).json({
            message : "Try using different name"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(4000, () => {
    console.log("Server running on PORT 4000")
})