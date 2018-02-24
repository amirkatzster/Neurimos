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