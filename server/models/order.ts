import * as mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  model: String,
  company: String,
  color: String,
  imageUrl: String,
  size: String,
  amount: Number,
  pricePerItem: Number,
  sku: String

});

const ShippmentSchema = new mongoose.Schema({
  deliveryMethod: {
    type: String,
    enum : ['mail', 'pickup'],
    default: 'mail'
  },
  price: Number
});

const CustomerSchema = new mongoose.Schema({
  name         : String,
  email        : String,
  phone        : String,
  address1     : String,
  address2     : String,
  city         : String,
  zip          : Number
});

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum : ['created', 'payed', 'verify', 'shipped', 'deliverd', 'cancel'],
    default: 'created'
  },
  items: [ ItemSchema ],
  shippment: ShippmentSchema,
  customer: CustomerSchema,
  createdDate: { type: Date, default: Date.now },
  totalPrice: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'userSchema'
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
