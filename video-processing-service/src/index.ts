import express from "express";
// import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = 3000;

app.get("/",(req, res) => {
    res.send("hello to the world of web dev");
});

app.listen(port, () => {
    console.log(
        `Video processsing service listening at http://localhost:${port}`
    );
});