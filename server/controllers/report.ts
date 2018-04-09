const request = require('request');
import * as dotenv from 'dotenv';
import Shoe from '../models/shoe';




export default class ReportCtrl {

  cpReport = (req, res) => {
    dotenv.load({ path: '.env' });
    const promisses = [];
    const cpQuery = process.env.CPQEURY;
    process.env.CPCOMP.split(',').forEach(comp => {
        console.log(comp);
        const p = Shoe.find({
            searchWords: { $all: comp },
            active: true
            // return only those fields
        }, 'id name finalPrice companyPrice',
        (err, docs) => {
            if (err) { return console.error(err); }
            docs.forEach(doc => {
                const query = cpQuery + doc.name;
                request(query, { json: true }, (err2, res2, body) => {
                    if (err2) { return console.log(err2); }
                    if (body.length > 0) {
                        let price = body[0].ProductPrice.Price;
                        price = price.match(/[+\-]?\d+(,\d+)?(\.\d+)?/)[0];
                        if (price && price > 0) {
                            Shoe.update({ _id: doc._id }, {
                                $set: {
                                'companyPrice' : price,
                                }
                            }
                            , (err3, obj) => {
                                if (err3) { return console.error(err3); }
                                });
                        }
                        if (price < doc.finalPrice) {
                            Shoe.update({ _id: doc._id }, {
                                $set: {
                                'finalPrice' : Math.floor(price),
                                'discount.newAmount' : Math.floor(price),
                                'discount.percentage' : ''
                                }
                            }
                            , (err3, obj) => {
                                if (err3) { return console.error(err3); }
                                });
                        }}
                    });
                });
            })
            promisses.push(p);
        });
        Promise.all(promisses).then(r => {
            console.log('finally...');
            res.json(r);
        }
    );
    }
}
