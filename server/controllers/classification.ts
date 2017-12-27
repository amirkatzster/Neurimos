import Classification from '../models/classification';
import BaseCtrl from './base';
import Shoe from '../models/shoe';

export default class ClassificationCtrl extends BaseCtrl {
  model = Classification;
  shoeModel = Shoe;

  header = (req, res) => {
    const result: any = {};
    this.shoeModel.distinct('classification' , {gender: 'ילדים', active: true, stock: { $gt : 0}}, (err, docs) => {
      if (err) { return console.error(err); }
      result.ילדים = docs;
      this.shoeModel.distinct('classification' , {gender: 'ילדות',  active: true, stock: { $gt : 0}}, (err, docs) => {
        if (err) { return console.error(err); }
        result.ילדות = docs;
        this.shoeModel.distinct('classification' , {gender: 'נשים',  active: true, stock: { $gt : 0}}, (err, docs) => {
          if (err) { return console.error(err); }
          result.נשים = docs;
          this.shoeModel.distinct('classification' , {gender: 'גברים',  active: true, stock: { $gt : 0}}, (err, docs) => {
            if (err) { return console.error(err); }
            result.גברים = docs;
            res.json(result);
          });
        });
      });
    });
  };

}
