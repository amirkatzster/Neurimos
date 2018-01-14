import * as bodyParser from 'body-parser';
import Shoe from '../models/shoe';
import BaseCtrl from './base';
import AWS = require('aws-sdk');
import config = require('config');
import Jimp = require('jimp');
import cache = require('memory-cache'); 

export default class ShoeCtrl extends BaseCtrl {
  model = Shoe;

  bucketName: string;
  s3Bucket: AWS.S3;
  amazonDomain: String = 'https://s3.eu-central-1.amazonaws.com/';

  constructor() {
    super();
    AWS.config.loadFromPath('./server/s3_config.json');
    this.bucketName = config.get('S3.BucketName');
    this.s3Bucket = new AWS.S3( { params: {Bucket: this.bucketName} } );
  }

  search = (req, res) => {
    const sortQuery: any = {
      skip: 0, // Starting Row
      limit: 100, // Ending Row
    }
    if (req.query.sort) {
      if (req.query.sort === 'priceLow') {
        sortQuery.sort = { price: 1}
      }
      if (req.query.sort === 'priceHigh') {
        sortQuery.sort = { price: -1}
      }
      if (req.query.sort === 'new') {
        sortQuery.sort = { inserted: -1}
      }
    }

    this.model.find({
      searchWords: { $all: req.body },
      active: true
      // return only those fields
    }, 'company name price finalPrice imagesGroup.images.urlMedium imagesGroup.color imagesGroup.sizes inserted stock', 
    sortQuery,
    (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  };

  deleteImages(shoe) {
     shoe.deleteImages.forEach((image: any, index) => {
            this.deleteImageUrl(image.urlSmall);
            this.deleteImageUrl(image.urlMedium);
            this.deleteImageUrl(image.urlLarge);
            this.deleteImageUrl(image.urlXL);
        });
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

  addImages(shoe) {
    shoe.imagesGroup.forEach((imageGroup, i) => {
      if (imageGroup.images) {
        imageGroup.images.forEach((image, j) => {
          if (image.urlMedium.indexOf('data:image') === 0) {
              const number = i * 2 + j * 3;
              const imageStream = image.urlMedium;
              image.urlSmall = this.addImage(imageStream, shoe, 'S', 55, number);
              image.urlMedium = this.addImage(imageStream, shoe, 'M', 255, number);
              image.urlLarge = this.addImage(imageStream, shoe, 'L', 480, number);
              image.urlXL = this.addImage(imageStream, shoe, 'XL', 1920, number);
            }
      })}});
  }

  addImage(image, shoe, size: string, width: number, index: number) {
      const rand = Math.floor((Math.random() * 100) + 1);
      const path = 'Images/Shoes/' + shoe.id + '/' + size + '/' + shoe.name + '_' + shoe.company + '_' + rand + '_' + index;
      this.addNewImage(image, path, width);
      return this.amazonDomain + this.bucketName + '/' + path;
  }

  addNewImage(imageString: string, path: string, width: number) {
    const buf = new Buffer(imageString.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    Jimp.read(buf, (err, image) => {
        image.resize(width, Jimp.AUTO)
             .getBuffer(image.getMIME(), (error, buffer) => {
                console.log('BUFFER: ' + buffer);
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
  }

  updateProcess(shoe: any) {
      console.log(shoe);
      if (shoe.deleteImages) {
        this.deleteImages(shoe);
      }
      this.addImages(shoe);
      shoe.updated = new Date().getTime();
      cache.del('header');
  }

}
