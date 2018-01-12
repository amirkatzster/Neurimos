import Order from '../models/order';
import BaseCtrl from './base';

export default class OrderCtrl extends BaseCtrl {
  model = Order;

  statusUpdate = (req, res) => {
    this.model.update({ _id: req.params.id }, {
      $set: {
        'status' : req.params.newStatus
      }
    }, (err, obj) => {
      if (err) { return console.error(err); }
        res.sendStatus(201);
    });
  }
}
