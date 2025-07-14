import express from "express";
const app = express();
import { JWT_SECRET } from "@repo/backend-common/config"

app.get("/", (req, res) => {
    const fenf = JWT_SECRET
    res.json({
        "message" : "Welcome!"
    })
})

app.listen(4000, () => {
    console.log("Server running on PORT 4000")
})