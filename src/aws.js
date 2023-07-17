import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';

const accessKeyId = process.env.YANDEX_USER_KEY;
const secretAccessKey = process.env.YANDEX_USER_SECRET_KEY;
const region = process.env.YANDEX_REGION;

const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region,
    endpoint: 'https://storage.yandexcloud.net',
})

export default s3;

