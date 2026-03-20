import Classification from '../models/classification';
import BaseCtrl from './base';
import Shoe from '../models/shoe';
import cache = require('memory-cache');

export default class ClassificationCtrl extends BaseCtrl {
  model = Classification;
  shoeModel = Shoe;

  header = async (req, res) => {
    const headerCache = cache.get('header');
    if (headerCache) {
      res.json(headerCache);
      return;
    }
    try {
      const classificationList = await this.model.find({ 'show': true }).sort({ 'order': 1 });
      const genders = ['ילדים', 'ילדות', 'נשים', 'גברים'];
      const results = await Promise.all(genders.map(async g => {
        const docs2 = await this.shoeModel.distinct('classification', { gender: g, active: true, stock: { $gt: 0 } });
        return { gen: g, cls: this.populateClassification(docs2, classificationList) };
      }));
      cache.put('header', results);
      res.json(results);
    } catch (err) { console.error(err); }
  }

  populateClassification(doc, classificationList) {
    const selectedClassification = doc.map(d => d.toString());
    return classificationList.filter(c => selectedClassification.indexOf(c._id.toString()) > -1).map(c => c.name);
  }
}
