import * as dotenv from 'dotenv';
import Order from '../models/order';




export default class PaypalCtrl {

  create = (req, res) => {
    Order.findOne({ _id: req.params.orderId }, (err, order) => {
        if (err) { return console.error(err); }
        const items: any = [];
        order.items.forEach(oi => {
            const item: any = {};
            item.name = oi.company + '-' + oi.model + '-' + oi.color + '-' + oi.size;
            item.sku = oi.sku;
            item.price = oi.pricePerItem;
            item.currency = 'ILS';
            item.quantity = oi.amount;
            items.push(item);
        });


        const create_payment_json = {
            'intent': 'authorize',
            'transactions': [{
                'item_list': {
                    'items': items
                },
                'amount': {
                    'currency': 'ILS',
                    'total': order.totalPrice,
                    'details': {
                        'subtotal': order.totalPrice - order.shippment.price,
                        'shipping': order.shippment.price
                      }
                },
                'description': 'תודה שבחרתם לרכוש דרך נעורים :)'
            }]};
            console.log(order.shippment.deliveryMethod);
          if (order.shippment.deliveryMethod !== 'SelfPick') {
            console.log('adding address to paypal info');
            (<any>create_payment_json.transactions[0]).item_list.shipping_address = {
                'recipient_name': order.customer.name,
                'line1': order.customer.address1,
                'line2': order.customer.address2,
                'city': order.customer.city,
                'country_code': 'IL',
                'postal_code': order.customer.zip,
                'phone': order.customer.phone
              }
          } else {
            // (<any>create_payment_json.transactions[0]).shipping_method = 'איסוף עצמי';
          }
          res.json(create_payment_json);
      });
  };


}
