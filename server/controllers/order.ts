import Order from '../models/order';
import BaseCtrl from './base';
import MailService from '../services/mailService';

export default class OrderCtrl extends BaseCtrl {
  model = Order;

  statusUpdate = async (req, res) => {
    try {
      await this.model.updateOne({ _id: req.params.id }, {
        $set: { 'status': req.params.newStatus }
      });
      const obj = await this.model.findOne({ _id: req.params.id });
      const service = new MailService();
      const body = JSON.stringify(obj);
      service.sendMailToUs('There is a new order from website (payed!)', body, body);
      res.status(201).json({});
    } catch (err) { console.error(err); }
  }

  insertProcess(obj: any) {
    const service = new MailService();
    const body = JSON.stringify(obj);
    service.sendMailToUs('There is a new order from website (unpayed yet)', body, body);
  }
}
