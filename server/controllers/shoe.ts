import * as bodyParser from 'body-parser';
import Shoe from '../models/shoe';
import BaseCtrl from './base';
import AWS = require('aws-sdk');
import config = require('config');

export default class ShoeCtrl extends BaseCtrl {
  model = Shoe;

  updateProcess(body: any) {
      console.log(body);
      AWS.config.loadFromPath('./server/s3_config.json');
      const bucketName = config.get('S3.BucketName');
      console.log(bucketName);
      const s3Bucket = new AWS.S3( { params: {Bucket: bucketName} } );
      if (body.deleteImages) {
        body.deleteImages.forEach((element, index) => {
          console.log('deleting images');
          const len = ('https://s3.eu-central-1.amazonaws.com/' + bucketName + '/').length;
          const data: AWS.S3.Types.DeleteObjectRequest = {
              Key: element.substring(len),
              Bucket: bucketName,
            };
            console.log(data.Key);
          s3Bucket.deleteObject(data, function(err, res) {
            console.log('deleting images2');
              if (err) {
                console.log(err, err.stack);
              } else {
                console.log(res);
              }
          });
          console.log('deleting images3');
        }
      }


      body.images.forEach((element, index) => {
        if (element.indexOf('data:image') === 0) {
          const buf = new Buffer(element.replace(/^data:image\/\w+;base64,/, ''), 'base64');
          const rand = Math.floor((Math.random() * 100) + 1);
          const path = 'Images/Shoes/' + body.id + '_' + index.toString() + '_' + rand;
          console.log(path);
          const data: AWS.S3.Types.PutObjectRequest = {
            Key: path,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            Bucket: bucketName,
          };
          s3Bucket.putObject(data , function(err, d){
              if (err) {
                console.log(err);
                console.log('Error uploading data: ', d);
              } else {
                console.log('succesfully uploaded the image!');
              }
          });
          body.images[index] = 'https://s3.eu-central-1.amazonaws.com/' + bucketName + '/' + path;
          }
      });
  }

}
