import * as config from "./config";
import path from "path";
import fs from "fs";
import dotenv from 'dotenv';
import { ObjectId } from "mongodb";
import { UploadedFile } from "express-fileupload";
import { Response } from "express";
import { saveImagesToDB } from "./add_images";

dotenv.config()

export async function getUploadedFileName(userId: ObjectId, file: UploadedFile, res: Response) {
    
    let fileName = file.name;
    let noSpaceFileName = fileName.replace(/\s/g, '');
    let newFileName = 'user' + '_' +  noSpaceFileName;

    file.mv((config.IMAGES_PATH + newFileName), async (err: Error) => {
    
        if(err){
            res.send (err);
        } else {
            let path = newFileName;
            await saveImagesToDB(path, userId);
            res.end(); 
        }
        console.log((config.IMAGES_PATH + newFileName), path.join(config.IMAGES_PATH, "../../../../storage/", ));
        console.log('saved')
        await copyImage(newFileName)
    })
}

async function copyImage(fileName: string) {
    let from = path.join(config.IMAGES_PATH , fileName);
    let dest = path.join(config.IMAGES_PATH, "../../../../storage/", fileName);
    await fs.promises.copyFile(from, dest);
}