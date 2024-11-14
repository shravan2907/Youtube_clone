import express from "express";
import { Express, Request, Response} from "express";
import{
    uploadProcessedVideo,
    downloadRawVideo,
    setupDirectories,
    deleteProcessedVideo,
    deleteRawVideo,  
    convertVideo
} from "./video-store"
import { isVideoNew,setVideo } from "./firestore";



setupDirectories();

//const app = express();
const app: Express = express()
app.use(express.json());


app.post('/process-video', async (req: Request, res: Response) => {

    // Get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try {
      const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
      data = JSON.parse(message);
      if (!data.name) {
        throw new Error('Invalid message payload received.');
      }
    } catch (error) {
      console.error(error);
      res.status(400).send('Bad Request: missing filename.');
      return;
    }
  
  const inputFileName = data.name; // In format of <UID>-<DATE>.<EXTENSION>
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split('.')[0];

  if (!isVideoNew(videoId)) {
    res.status(400).send('Bad Request: video already processing or processed.');
    return; 
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split('-')[0],
      status: 'processing'
    });
  }
    // Download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);
  
    // Process the video into 360p
    try { 
      await convertVideo(inputFileName, outputFileName)
    } catch (err) {
      await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
      ]);
      res.status(500).send('Processing failed');
      return;
    }
    
    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);
    
    await setVideo(videoId, {
      status:'processed',
      filename: outputFileName
    });

    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
  
     res.status(200).send('Processing finished successfully');
     return;
  });


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Video processsing service listening at http://localhost:${port}`
    );
});
