import Classification from '../models/classification';
import BaseCtrl from './base';
import Shoe from '../models/shoe';
import cache = require('memory-cache');


export default class ClassificationCtrl extends BaseCtrl {
  model = Classification;
  shoeModel = Shoe;

  public lastResult;

  header = (req, res) => {
    const headerCache = cache.get('header');
    if (headerCache) {
      res.json(headerCache);
      return;
    }

    this.model.find({'show': true}).sort({'order': 1}).exec((err, docs) => {
      if (err) { return console.error(err); }
      const classificationList = docs;
      const result: any = [];
      let counter = 4;
      ['ילדים', 'ילדות', 'נשים', 'גברים'].forEach(g => {
        this.shoeModel.distinct('classification' , {gender: g, active: true, stock: { $gt : 0}}, (err2, docs2) => {
          if (err2) { return console.error(err2); }
          result.push({gen: g, cls: this.populateClassification(docs2, classificationList)});
          counter--;
          if (counter === 0) {
            cache.put('header', result);
            res.json(result);
          }
        });
      });
    });
  }

  populateClassification(doc, classificationList) {
    const selectedClassification = doc.map(d => d.toString());
    return classificationList.filter(c => selectedClassification.indexOf(c._id.toString()) > -1).map(c => c.name);
  }

}
