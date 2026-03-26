import MailService from '../services/mailService';

export default class ContactUsCtrl {

  // Get all
  contactus = (req, res) => {
    const service = new MailService();
    console.log(req.body);
    const { name, mail, phone, message } = req.body;
    const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">
  <h2 style="color:#333">הודעה חדשה מהאתר</h2>
  <table style="border-collapse:collapse;width:100%">
    <tr><td style="padding:6px 12px;font-weight:bold;width:100px">שם:</td><td style="padding:6px 12px">${name}</td></tr>
    <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold">דוא"ל:</td><td style="padding:6px 12px">${mail}</td></tr>
    <tr><td style="padding:6px 12px;font-weight:bold">טלפון:</td><td style="padding:6px 12px">${phone || '-'}</td></tr>
    <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:bold;vertical-align:top">הודעה:</td><td style="padding:6px 12px">${message}</td></tr>
  </table>
</div>`;
    const text = `הודעה חדשה מהאתר\n\nשם: ${name}\nדוא"ל: ${mail}\nטלפון: ${phone || '-'}\nהודעה:\n${message}`;
    service.sendMailToUs('הודעה חדשה מהאתר - ' + name, html, text);
    res.status(200).json({});
  }

}
