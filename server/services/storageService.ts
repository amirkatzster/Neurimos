// Load the AWS SDK for Node.js
import AWS = require('aws-sdk');
import * as dotenv from 'dotenv';
import config = require('config');
import Jimp = require('jimp');

// Set the region


export default class StorageService  {

    bucketName: string;
    s3Bucket: AWS.S3;
    amazonDomain: String = 'https://s3.eu-central-1.amazonaws.com/';

    constructor () {
        AWS.config.loadFromPath('./server/s3_config.json');
        dotenv.load({ path: '../../.env' });
        this.bucketName = config.get('S3.BucketName');
        this.s3Bucket = new AWS.S3( { params: {Bucket: this.bucketName} } );
    }

    deleteImageUrl(imageUrl: String) {
        const len = (this.amazonDomain + this.bucketName + '/').length;
            const data: AWS.S3.Types.DeleteObjectRequest = {
                Key: imageUrl.substring(len),
                Bucket: this.bucketName,
              };
            this.s3Bucket.deleteObject(data, function(err, res) {
                if (err) {
                  console.log(err, err.stack);
                } else {
                  console.log(res);
                }
            });
    }

    deleteImageFolder(folderPath: string) {
        const params = {
            Bucket: this.bucketName,
            Prefix: folderPath // 'folder/'
        };
        const s3 = this.s3Bucket;
        s3.listObjects(params, function(err, data) {
            const params2: any = {Bucket: this.bucketName};
            params2.Delete = {Objects: []};
            data.Contents.forEach(function(content) {
                params2.Delete.Objects.push({Key: content.Key});
            });
            console.log(params2);
            s3.deleteObjects(params2, function(err2, data2) {
                if (err) {
                    console.log(err, err.stack);
                  } else {
                    console.log(data2);
                  }
            });
        });
    }

    

    addNewImage(imageString: string, path: string, width: number) {
        const buf = new Buffer(imageString.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        Jimp.read(buf, (err, image) => {
            image.resize(width, Jimp.AUTO)
                 .getBuffer(image.getMIME(), (error, buffer) => {
                      const data: AWS.S3.Types.PutObjectRequest = {
                      Key: path,
                      Body: buffer,
                      ContentEncoding: 'base64',
                      ContentType: image.getMIME(),
                      Bucket: this.bucketName,
                    };
                    this.s3Bucket.putObject(data , function(e, d){
                      if (e) {
                        console.log(e);
                        console.log('Error uploading data: ', d);
                      } else {
                        console.log('succesfully uploaded the image!');
                      }
                  });
              });
        });
        return this.amazonDomain + this.bucketName + '/' + path;
    }

}