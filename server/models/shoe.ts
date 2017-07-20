import * as mongoose from 'mongoose';

const shoeSchema = new mongoose.Schema({
  id: String,
  active: Boolean,
  company: String,
  name: String,
  price: Number,
  gender: String,
  kidOrAdult: String,
  season: String,
  information: String,
  images: [String],
  updated: { type: Date, default: Date.now },
});

const Shoe = mongoose.model('Shoe', shoeSchema);

export default Shoe;
