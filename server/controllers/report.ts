import axios from 'axios';
import * as dotenv from 'dotenv';
import Shoe from '../models/shoe';

export default class ReportCtrl {

  cpReport = async (req, res) => {
    dotenv.load({ path: '.env' });
    const cpQuery = process.env.CPQEURY;
    const comps = process.env.CPCOMP.split(',');
    const promises = comps.map(comp => {
      console.log(comp);
      return Shoe.find(
        { searchWords: { $all: comp }, active: true },
        'id name finalPrice companyPrice price'
      ).then(docs => {
        docs.forEach(doc => {
          const query = cpQuery + doc.name;
          axios.get(query).then(async response => {
            const body = response.data;
            if (body.length > 0) {
              let price = body[0].ProductPrice.Price;
              price = price.match(/[+\-]?\d+(,\d+)?(\.\d+)?/)[0];
              if (price && price > 0) {
                await Shoe.updateOne({ _id: doc._id }, { $set: { 'companyPrice': price } });
              }
              if (price && (price < doc.finalPrice || price < (doc as any).price * 0.6)) {
                if (price < (doc as any).price * 0.6) { price = (doc as any).price * 0.6; }
                await Shoe.updateOne({ _id: doc._id }, {
                  $set: {
                    'finalPrice': Math.floor(price),
                    'discount.newAmount': Math.floor(price),
                    'discount.percentage': ''
                  }
                });
              }
            }
          }).catch(err => console.log(err));
        });
      });
    });
    try {
      const r = await Promise.all(promises);
      console.log('finally...');
      res.json(r);
    } catch (err) { console.error(err); }
  }
}
