import * as bodyParser from 'body-parser';
import Shoe from '../models/shoe';
import BaseCtrl from './base';
import AWS = require('aws-sdk');
import cache = require('memory-cache');
import StorageService from '../services/storageService';

export default class ShoeCtrl extends BaseCtrl {
  model = Shoe;


  constructor() {
    super();
  }

  friendlyGet = (req, res) => {
    this.model.findOne({ id: req.params.id }, (err, obj) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
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
    }, 'id company name price finalPrice imagesGroup.images.urlMedium imagesGroup.color imagesGroup.sizes inserted stock',
    sortQuery,
    (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  };

  deleteImages(shoe) {
     const storageService = new StorageService();
     shoe.deleteImages.forEach((image: any, index) => {
          storageService.deleteImageUrl(image.urlSmall);
          storageService.deleteImageUrl(image.urlMedium);
          storageService.deleteImageUrl(image.urlLarge);
          storageService.deleteImageUrl(image.urlXL);
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
    const storageService = new StorageService();
    const rand = Math.floor((Math.random() * 100) + 1);
    const path = 'Images/Shoes/' + shoe.id + '/' + size + '/' + shoe.name + '_' + shoe.company + '_' + rand + '_' + index;
    const url = storageService.addNewImage(image, path, width);
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
    this.updateProcess(shoe);
  }

  deleteProcess(req, res) {
    this.model.findOne({ _id: req.params.id }, (err, obj) => {
      console.log(obj);
      const storageService = new StorageService();
      const filePath = 'Images/Shoes/' + obj.id + '/';  // This is the friendlyId
      console.log(obj);
      storageService.deleteImageFolder(filePath);
      this.model.findOneAndRemove({ _id: req.params.id }, (err2) => {
        if (err2) { return console.error(err2); }
        res.status(200).json({});
      });
    });
    return false;
  }

  genimg = (req, res) => {
    const storageService = new StorageService();
    this.model.find({}, (err, shoes) => {
      if (err) { return console.error(err); }
      shoes.forEach(shoe => {
          if (shoe.imagesGroup) {
            shoe.imagesGroup.forEach(ig => {
                if (ig.images) {
                  ig.images.forEach(image => {
                      this.gen(shoe, image, storageService);
                  });
                }
            });
          }
      });
    });
  }

  gen(shoe, image, storageService) {
    const xlUrl = image.urlXL;
    if (!xlUrl.endsWith('.png')) {
        const xlUrlWithPng = xlUrl + '.png';
        storageService.tryToConvert(xlUrlWithPng, () => {
           storageService.deleteImageUrl(image.urlXL);
           storageService.deleteImageUrl(image.urlLarge);
           storageService.deleteImageUrl(image.urlMedium);
           storageService.deleteImageUrl(image.urlSmall);
           image.urlXL = xlUrlWithPng;
           image.urlLarge = xlUrlWithPng.replace('/XL/', '/L/');
           image.urlMedium = xlUrlWithPng.replace('/XL/', '/M/');
           image.urlSmall = xlUrlWithPng.replace('/XL/', '/S/');
           this.model.findOneAndUpdate({ _id: shoe._id }, shoe, (err) => {
              if (err) { return console.error(err); }
              console.log('shoe updated');
              console.log(shoe);
          });
        });
    }
  }


}
