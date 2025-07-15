import express from "express";
const app = express();
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateUserSchema, RoomSchema, SigninSchema } from "@repo/common/types"
import { middleware } from "./middleware";

app.get("/", (req, res) => {
    res.json({
        "message" : "Welcome!"
    })
})

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success) {
        res.json({
            message : "Invalid Inputs"
        })
        return;
    }
    //add to db-call

})

app.post("/signin", (req, res) => {
    const data = SigninSchema.safeParse(req.body)
    if(!data.success) {
        res.json({
            message : "Invalid Inputs"
        })
        return;
    }
    // Search guy in db with username and check password using bcrypt module
    // Return jwt token
})

app.post("/room", middleware, (req, res) => {
    const data = RoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
        message: "Incorrect Inputs",
        });
        return;
    }
    res.json({
        roomId: 123,
    });
})

app.listen(4000, () => {
    console.log("Server running on PORT 4000")
})