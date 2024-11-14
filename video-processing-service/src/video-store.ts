import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


const storage = new Storage();

const rawVideoBucketName = "sv-raw-proj-vidoes";
const processedVideoBucketName = "sv-processed-proj-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


export function setupDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
    .outputOptions('-vf', 'scale=-1:360').on('end',function(){
        console.log('Processing finished succesfully');
        //res.status(200).send('Processing Finished Successfully');
        resolve();
    })
    .on('error',function(err: any){
        console.log('An error occured: ' + err.message);
        //res.status(500).send('An error occured: ' + err.message);
        reject(err);
    })
    .save(`${localProcessedVideoPath}/${processedVideoName}`);
});
}

export async function downloadRawVideo(fileName: string){
    await storage.bucket(rawVideoBucketName)
    .file(fileName).download({
        destination: `${localRawVideoPath}/${fileName}`
    });

   console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}

export async function uploadProcessedVideo(fileName:string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await storage.bucket(processedVideoBucketName)
    .upload(`${localProcessedVideoPath}/${fileName}`, {destination: fileName,});

    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`);

    await bucket.file(fileName).makePublic();
    
    
}

export function deleteRawVideo(fileName: string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}


export function deleteProcessedVideo(fileName: string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

function deleteFile(path: string): Promise<void>{
    return new Promise((resolve,reject) => {
        if(fs.existsSync(path)) {
            fs.unlink(path, (err) =>{
                if (err){
                    console.error(`Failed to delete file at ${path}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${path}`);
                    resolve();
                } 
            });
        } else {
            console.log(`File not found at ${path}, skipping delete.`);
            resolve();
        }
    });
}

function ensureDirectoryExistence(dirPath: string){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive: true});
        console.log(`Directory created at ${dirPath}`);
    }
}
