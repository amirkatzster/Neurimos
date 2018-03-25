import MailService from '../services/mailService';

export default class ContactUsCtrl {

  // Get all
  contactus = (req, res) => {
    const service = new MailService();
    console.log(req.body);
    const message = JSON.stringify(req.body);
    service.sendMailToUs('Contact us from neurim site - ' + req.body.name, message, message);
    res.status(200).json({});
  }

}
