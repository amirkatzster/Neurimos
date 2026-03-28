import { S3Client, DeleteObjectCommand, ListObjectsCommand, DeleteObjectsCommand, HeadObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import config = require('config');
import * as fs from 'fs';
import { Jimp } from 'jimp';

export default class StorageService {

    bucketName: string;
    s3Client: S3Client;
    amazonDomain: String = 'https://s3.eu-central-1.amazonaws.com/';

    constructor() {
        dotenv.load({ path: '../../.env' });
        const awsConfig = JSON.parse(fs.readFileSync('./server/s3_config.json', 'utf-8'));
        this.bucketName = config.get('S3.BucketName');
        this.s3Client = new S3Client({
            region: awsConfig.region,
            credentials: {
                accessKeyId: awsConfig.accessKeyId,
                secretAccessKey: awsConfig.secretAccessKey
            }
        });
    }

    deleteImageUrl(imageUrl: String) {
        const len = (this.amazonDomain + this.bucketName + '/').length;
        this.s3Client.send(new DeleteObjectCommand({
            Key: imageUrl.substring(len) as string,
            Bucket: this.bucketName,
        })).catch(err => console.error(err, err.stack));
    }

    async deleteImageFolder(folderPath: string) {
        const listData = await this.s3Client.send(new ListObjectsCommand({
            Bucket: this.bucketName,
            Prefix: folderPath
        }));
        const objects = listData.Contents.map(content => ({ Key: content.Key }));
        const deleteData = await this.s3Client.send(new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: { Objects: objects }
        }));
    }

    addNewImage(imageString: string, path: string, width: number) {
        const buf = Buffer.from(imageString.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        Jimp.read(buf).then(image => {
            this.uploadConvertedImage(image, width, path, this.bucketName, this.s3Client);
        }).catch(err => console.error(err));
        return this.amazonDomain + this.bucketName + '/' + path;
    }

    async tryToConvert(url, callback) {
        const s3Path = url.substring(url.indexOf(this.bucketName) + this.bucketName.length + 1);
        const headParams = { Bucket: this.bucketName, Key: s3Path };
        try {
            const res: any = await this.s3Client.send(new HeadObjectCommand(headParams));
            if (res.code !== 'NotFound') {
                const data: any = await this.s3Client.send(new GetObjectCommand(headParams));
                Jimp.read(data.Body).then(image => {
                    this.uploadConvertedImage(image, 480, s3Path.replace('/XL/', '/L/'), this.bucketName, this.s3Client);
                    this.uploadConvertedImage(image, 255, s3Path.replace('/XL/', '/M/'), this.bucketName, this.s3Client);
                    this.uploadConvertedImage(image, 55, s3Path.replace('/XL/', '/S/'), this.bucketName, this.s3Client);
                    callback();
                }).catch(err => console.error(err));
            }
        } catch (err) {
            return;
        }
    }

    uploadConvertedImage(image: any, width: number, path: string, bucketName: string, s3Client: S3Client) {
        image.resize({ w: width });
        image.getBuffer(image.mime).then(buffer => {
            s3Client.send(new PutObjectCommand({
                Key: path,
                Body: buffer,
                ContentEncoding: 'base64',
                ContentType: image.mime,
                Bucket: bucketName,
            })).catch(e => {
                console.error('Error uploading data: ', path, e);
            });
        }).catch(err => console.error(err));
    }
}
