import * as mongoose from 'mongoose';
import Classification from './classification'

const ImageSchema = new mongoose.Schema({
  urlSmall: String,
  urlMedium: String,
  urlLarge: String,
  urlXL: String,
  color: String,
  sizes: [String]
});



const shoeSchema = new mongoose.Schema({
  id: String,
  active: Boolean,
  company: String,
  name: String,
  price: Number,
  gender: [String],
  classification: {
    type: mongoose.Schema.ObjectId,
    ref: 'classificationSchema'
  },
  searchWords: [String],
  information: String,
  images: [ ImageSchema ],
  updated: { type: Date, default: Date.now },
});

const Shoe = mongoose.model('Shoe', shoeSchema);

export default Shoe;
