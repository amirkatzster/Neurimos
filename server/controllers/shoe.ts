import * as bodyParser from 'body-parser';
import Shoe from '../models/shoe';
import BaseCtrl from './base';
import AWS = require('aws-sdk');

export default class ShoeCtrl extends BaseCtrl {
  model = Shoe;

  updateProcess(body: any) {
      console.log(body);
      AWS.config.loadFromPath('./server/s3_config.json');
      const s3Bucket = new AWS.S3( { params: {Bucket: 'neurimos-dev'} } );

      body.images.forEach((element, index) => {
        if (element.indexOf('data:image') === 0) {
          console.log('start upload to s3');
          const buf = new Buffer(element.replace(/^data:image\/\w+;base64,/, ''), 'base64');
          const path = 'Images/Shoes/' + body.id + '_' + index.toString();
          console.log(path);
          const data: AWS.S3.Types.PutObjectRequest = {
            Key: path,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            Bucket: 'neurimos-dev',
          };
          s3Bucket.putObject(data , function(err, d){
              if (err) {
                console.log(err);
                console.log('Error uploading data: ', d);
              } else {
                console.log('succesfully uploaded the image!');
              }
          });
          console.log('done upload to s3');
          body.images[index] = 'https://s3.eu-central-1.amazonaws.com/neurimos-dev/' + path;
          console.log(body.images);
          }
      });
  }

}
