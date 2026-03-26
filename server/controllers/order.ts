import Order from '../models/order';
import BaseCtrl from './base';
import MailService from '../services/mailService';

function deliveryMethodHe(method: string): string {
  switch (method) {
    case 'SelfPick': return 'איסוף עצמי';
    case 'Mail': return 'דואר';
    case 'Delivery': return 'משלוח';
    default: return method || '';
  }
}

function buildOrderHtml(obj: any, paid: boolean): string {
  const c = obj.customer || {};
  const s = obj.shippment || {};
  const items = (obj.items || []) as any[];
  const date = obj.createdDate ? new Date(obj.createdDate).toLocaleDateString('he-IL') : '';

  const itemRows = items.map(item =>
    `<tr>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;">${item.company || ''} ${item.model || ''}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;">${item.color || ''}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;">${item.size || ''}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;">${item.amount || ''}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;">₪${item.pricePerItem || ''}</td>
    </tr>`
  ).join('');

  const statusBadge = paid
    ? `<span style="background:#2e7d32;color:#fff;padding:3px 10px;border-radius:4px;font-size:14px;">שולם</span>`
    : `<span style="background:#e65100;color:#fff;padding:3px 10px;border-radius:4px;font-size:14px;">טרם שולם</span>`;

  return `
  <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
    <h2 style="border-bottom:2px solid #1565c0;padding-bottom:8px;color:#1565c0;">הזמנה חדשה מהאתר ${statusBadge}</h2>
    <p style="color:#555;font-size:13px;">תאריך: ${date}</p>

    <h3 style="color:#1565c0;">פרטי הלקוח</h3>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr><td style="padding:5px 10px;width:120px;color:#777;">שם</td><td style="padding:5px 10px;"><strong>${c.name || ''}</strong></td></tr>
      <tr><td style="padding:5px 10px;color:#777;">מייל</td><td style="padding:5px 10px;">${c.email || ''}</td></tr>
      <tr><td style="padding:5px 10px;color:#777;">טלפון</td><td style="padding:5px 10px;">${c.phone || ''}</td></tr>
      <tr><td style="padding:5px 10px;color:#777;">כתובת</td><td style="padding:5px 10px;">${c.address1 || ''} ${c.address2 || ''}, ${c.city || ''} ${c.zip || ''}</td></tr>
    </table>

    <h3 style="color:#1565c0;margin-top:20px;">משלוח</h3>
    <p style="font-size:15px;margin:0 10px;">${deliveryMethodHe(s.deliveryMethod)}${s.price ? ' — ₪' + s.price : ''}</p>

    <h3 style="color:#1565c0;margin-top:20px;">פריטים</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:8px 10px;text-align:right;">מוצר</th>
          <th style="padding:8px 10px;text-align:right;">צבע</th>
          <th style="padding:8px 10px;text-align:right;">מידה</th>
          <th style="padding:8px 10px;text-align:right;">כמות</th>
          <th style="padding:8px 10px;text-align:right;">מחיר</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <h3 style="text-align:left;margin-top:16px;">סה"כ: ₪${obj.totalPrice || ''}</h3>
  </div>`;
}

function buildOrderText(obj: any, paid: boolean): string {
  const c = obj.customer || {};
  const s = obj.shippment || {};
  const items = (obj.items || []) as any[];
  const lines = [
    `הזמנה חדשה מהאתר — ${paid ? 'שולם' : 'טרם שולם'}`,
    '',
    `לקוח: ${c.name || ''}`,
    `מייל: ${c.email || ''}`,
    `טלפון: ${c.phone || ''}`,
    `כתובת: ${c.address1 || ''} ${c.address2 || ''}, ${c.city || ''}`,
    `משלוח: ${deliveryMethodHe(s.deliveryMethod)}`,
    '',
    'פריטים:',
    ...items.map(i => `  ${i.company || ''} ${i.model || ''} | ${i.color || ''} | מידה ${i.size || ''} | כמות ${i.amount || ''} | ₪${i.pricePerItem || ''}`),
    '',
    `סה"כ: ₪${obj.totalPrice || ''}`
  ];
  return lines.join('\n');
}

export default class OrderCtrl extends BaseCtrl {
  model = Order;

  statusUpdate = async (req, res) => {
    try {
      await this.model.updateOne({ _id: req.params.id }, {
        $set: { 'status': req.params.newStatus }
      });
      const obj = await this.model.findOne({ _id: req.params.id });
      const service = new MailService();
      service.sendMailToUs(
        'הזמנה חדשה שהתקבלה ושולמה',
        buildOrderHtml(obj, true),
        buildOrderText(obj, true)
      );
      res.status(201).json({});
    } catch (err) { console.error(err); }
  }

  insertProcess(obj: any) {
    const service = new MailService();
    service.sendMailToUs(
      'הזמנה חדשה שהתקבלה (טרם שולמה)',
      buildOrderHtml(obj, false),
      buildOrderText(obj, false)
    );
  }
}
