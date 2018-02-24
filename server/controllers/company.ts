import Company from '../models/company';
import BaseCtrl from './base';
import StorageService from '../services/storageService';

export default class CompanyCtrl extends BaseCtrl {
  model = Company;

  addImages(company) {
    if (company.image) {
      if (company.image.indexOf('data:image') === 0) {
          company.image = this.addImage(company.image, company, 'M', 255);
        }
    };
  }

  addImage(image, company, size: string, width: number) {
    const storageService = new StorageService();
    const path = 'Images/Company/' + company.name;
    const url = storageService.addNewImage(image, path, width);
    return url;
  }


  updateProcess(company: any) {
    this.addImages(company);
  }

  insertProcess(company: any) {
    this.updateProcess(company);
  }


}



