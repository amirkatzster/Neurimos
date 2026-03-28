import Shoe from '../models/shoe';
import BaseCtrl from './base';
import cache = require('memory-cache');
import StorageService from '../services/storageService';

export default class ShoeCtrl extends BaseCtrl {
  model = Shoe;

  constructor() {
    super();
  }

  friendlyGet = async (req, res) => {
    try {
      const obj = await this.model.findOne({ id: req.params.id });
      res.json(obj);
    } catch (err) { console.error(err); }
  }

  search = async (req, res) => {
    const sortQuery: any = {
      skip: 0,
      limit: 500,
      sort: { inserted: -1 }
    };
    if (req.query.sort) {
      if (req.query.sort === 'priceLow') { sortQuery.sort = { price: 1 }; }
      if (req.query.sort === 'priceHigh') { sortQuery.sort = { price: -1 }; }
      if (req.query.sort === 'new') { sortQuery.sort = { inserted: -1 }; }
    }
    try {
      const docs = await this.model.find(
        { searchWords: { $all: req.body }, active: true },
        'id company name price finalPrice companyPrice imagesGroup.images.urlMedium imagesGroup.color imagesGroup.sizes inserted stock',
        sortQuery
      );
      res.json(docs);
    } catch (err) { console.error(err); }
  };

  deleteImages(shoe) {
    const storageService = new StorageService();
    shoe.deleteImages.forEach((image: any) => {
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
            const number = i * 2 + j * 3;
            const imageStream = image.urlMedium;
            image.urlSmall  = this.addImage(imageStream, shoe, 'S', 55, number);
            image.urlMedium = this.addImage(imageStream, shoe, 'M', 255, number);
            image.urlLarge  = this.addImage(imageStream, shoe, 'L', 480, number);
            image.urlXL     = this.addImage(imageStream, shoe, 'XL', 1920, number);
          }
        });
      }
    });
  }

  addImage(image, shoe, size: string, width: number, index: number) {
    const storageService = new StorageService();
    const rand = Math.floor((Math.random() * 100) + 1);
    const path = 'Images/Shoes/' + shoe.id + '/' + size + '/' + shoe.name + '_' + shoe.company + '_' + rand + '_' + index;
    return storageService.addNewImage(image, path, width);
  }

  updateProcess(shoe: any) {
    if (shoe.deleteImages) { this.deleteImages(shoe); }
    this.addImages(shoe);
    shoe.updated = new Date().getTime();
    cache.del('header');
  }

  insertProcess(shoe: any) {
    this.updateProcess(shoe);
  }

  deleteProcess = async (req, res) => {
    try {
      const obj = await this.model.findOne({ _id: req.params.id });
      const storageService = new StorageService();
      const filePath = 'Images/Shoes/' + obj.id + '/';
      storageService.deleteImageFolder(filePath);
      await this.model.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({});
    } catch (err) { console.error(err); }
    return false;
  }

  genimg = async (req, res) => {
    const storageService = new StorageService();
    try {
      const shoes = await this.model.find({});
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
      res.status(200).json({});
    } catch (err) { console.error(err); }
  }

  gen(shoe, image, storageService) {
    const xlUrl = image.urlXL;
    if (!xlUrl.endsWith('.png')) {
      const xlUrlWithPng = xlUrl + '.png';
      storageService.tryToConvert(xlUrlWithPng, async () => {
        storageService.deleteImageUrl(image.urlXL);
        storageService.deleteImageUrl(image.urlLarge);
        storageService.deleteImageUrl(image.urlMedium);
        storageService.deleteImageUrl(image.urlSmall);
        image.urlXL    = xlUrlWithPng;
        image.urlLarge  = xlUrlWithPng.replace('/XL/', '/L/');
        image.urlMedium = xlUrlWithPng.replace('/XL/', '/M/');
        image.urlSmall  = xlUrlWithPng.replace('/XL/', '/S/');
        try {
          await this.model.findOneAndUpdate({ _id: shoe._id }, shoe);
        } catch (err) { console.error(err); }
      });
    }
  }
}
