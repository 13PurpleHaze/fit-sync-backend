import "dotenv/config";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class YandexS3 {
    create = async (imgName, file) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: imgName,
            Body: file.buffer,
            ContentType: file.mimetype,
        }
        const command = new PutObjectCommand(params);
        await s3.send(command);
    }

    get = async (entities) => {
        for(let entity of entities) {
            const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: entity.img,
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, {expiresIn: 6000});
            entity.img = url;
        }
        return entities;
    }

    find = async (entity) => {
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: entity.img,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, {expiresIn: 6000});
        entity.img = url;
        return entity;
    }

    update = async (oldImgName, newImgName, newImg) => {
        await this.delete({img: oldImgName});
        await this.create(newImgName, newImg);
    }

    delete = async (entity) => {
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: entity.img,
        }
        const command = new DeleteObjectCommand(getObjectParams);
        await s3.send(command);
    }
}

export default YandexS3;