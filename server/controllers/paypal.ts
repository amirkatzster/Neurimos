import * as dotenv from 'dotenv';



export default class PaypalCtrl {

  create = (req, res) => {
    const create_payment_json = {
      'intent': 'order',
      'transactions': [{
          'item_list': {
              'items': [{
                  'name': 'item',
                  'sku': 'item',
                  'price': '99.00',
                  'currency': 'ILS',
                  'quantity': 1
              }]
          },
          'amount': {
              'currency': 'ILS',
              'total': '99.00',
          },
          'description': 'תודה שבחרתם לרכוש דרך נעורים :)'
      }]};
    res.json(create_payment_json);
  };


}
