import * as mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  model: String,
  company: String,
  imageUrl: String,
  size: String,
  amount: Number,
  pricePerItem: Number

});

const ShippmentSchema = new mongoose.Schema({
  how: String,
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
  status: String,
  items: [ ItemSchema ],
  shippment: ShippmentSchema,
  customer: CustomerSchema,
  createdDate: { type: Date, default: Date.now },
  totalPrice: Number
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
