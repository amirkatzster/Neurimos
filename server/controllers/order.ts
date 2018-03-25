import Order from '../models/order';
import BaseCtrl from './base';
import MailService from '../services/mailService';

export default class OrderCtrl extends BaseCtrl {
  model = Order;

  statusUpdate = (req, res) => {
    this.model.update({ _id: req.params.id }, {
      $set: {
        'status' : req.params.newStatus
      }
    }, (err, obj) => {
      if (err) { return console.error(err); }
        this.model.findOne({ _id: req.params.id }, (err2, obj2) => {
          if (err2) { return console.error(err2); }
          const service = new MailService();
          const body = JSON.stringify(obj2);
          service.sendMailToUs('There is a new order from website (payed!)', body, body);
          res.status(201).json({});
        });
    });
  }

  insertProcess(obj: any) {
    const service = new MailService();
    const body = JSON.stringify(obj);
    service.sendMailToUs('There is a new order from website (unpayed yet)', body, body);
  }
}
