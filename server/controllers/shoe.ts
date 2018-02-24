import * as bodyParser from 'body-parser';
import Shoe from '../models/shoe';
import BaseCtrl from './base';
import AWS = require('aws-sdk');
import cache = require('memory-cache'); 
import StorageService from '../services/storageService';

export default class ShoeCtrl extends BaseCtrl {
  model = Shoe;
  storageService;


  constructor() {
    super();
    this.storageService = new StorageService();
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
          this.storageService.deleteImageUrl(image.urlSmall);
          this.storageService.deleteImageUrl(image.urlMedium);
          this.storageService.deleteImageUrl(image.urlLarge);
          this.storageService.deleteImageUrl(image.urlXL);
        });
  }

  

  addImages(shoe) {
    shoe.imagesGroup.forEach((imageGroup, i) => {
      if (imageGroup.images) {
        imageGroup.images.forEach((image, j) => {
          if (image.urlMedium.indexOf('data:image') === 0) {
              console.log('converting image');
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
    const url = this.storageService.addNewImage(image, path, width);
    return url;
  }

  updateProcess(shoe: any) {
      if (shoe.deleteImages) {
        this.deleteImages(shoe);
      }
      this.addImages(shoe);
      shoe.updated = new Date().getTime();
      cache.del('header');
  }

  insertProcess(shoe: any) {
    console.log('insert Process shoe');
     //this.updateProcess(shoe);
  }

}
