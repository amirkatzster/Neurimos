import * as mongoose from 'mongoose';
import Classification from './classification'

const ImageUrlSchema = new mongoose.Schema({
  urlSmall: String,
  urlMedium: String,
  urlLarge: String,
  urlXL: String,
});

const SizeAmountSchema = new mongoose.Schema({
  size: String,
  amount: Number
});

const ImageSchema = new mongoose.Schema({
  color: String,
  sizes: [ SizeAmountSchema ],
  images: [ ImageUrlSchema ]
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
  imagesGroup: [ ImageSchema ],
  updated: { type: Date, default: Date.now },
});

const Shoe = mongoose.model('Shoe', shoeSchema);

export default Shoe;
