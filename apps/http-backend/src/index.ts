import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.json({
        "message" : "Welcome!"
    })
})

app.listen(4000)