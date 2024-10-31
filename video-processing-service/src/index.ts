import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());


app.post("/process-video",(req, res) => {
    // Get path of the input video file from the request body
    const inputVideoPath = req.body.inputVideoPath;
    const outputVideoPath = req.body.outputVideoPath;

    if(!inputVideoPath || !outputVideoPath) {
        res.status(400).send("Bad request: Missing File Path.");
            console.log(inputVideoPath);
            console.log(outputVideoPath);
    }
    ffmpeg(inputVideoPath)
    .outputOptions('-vf', 'scale=-1:360').on('end',function(){
        console.log('Processing finished succesfully');
        res.status(200).send('Processing Finished Successfully');
    })
    .on('error',function(err: any){
        console.log('An error occured: ' + err.message);
        res.status(500).send('An error occured: ' + err.message);
    })
    .save(outputVideoPath);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Video processsing service listening at http://localhost:${port}`
    );
});